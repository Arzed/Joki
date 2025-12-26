import { prisma } from '@/lib/prisma'

interface TopsisResult {
  karyawanId: number
  nama_karyawan: string
  skor: number
  rank: number
}

export class TopsisService {
  /**
   * Mengambil semua data yang diperlukan untuk perhitungan TOPSIS
   */
  async getData() {
    const karyawan = await prisma.karyawan.findMany({
      include: {
        penilaian: {
          include: {
            kriteria: true,
          },
        },
      },
    })
    const kriteria = await prisma.kriteria.findMany()
    return { karyawan, kriteria }
  }

  /**
   * Melakukan perhitungan TOPSIS dan menyimpan hasilnya
   */
  async calculate(): Promise<TopsisResult[]> {
    const { karyawan, kriteria } = await this.getData()

    if (karyawan.length === 0 || kriteria.length === 0) {
      return []
    }

    // 1. Matriks Keputusan (X)
    // Kita perlu memastikan setiap karyawan memiliki nilai untuk setiap kriteria
    // Jika tidak ada, kita anggap 0 (atau bisa dihandle error)
    
    // Helper untuk mendapatkan nilai
    const getNilai = (karyawanId: number, kriteriaId: number) => {
      const k = karyawan.find((k) => k.id === karyawanId)
      const p = k?.penilaian.find((p) => p.kriteriaId === kriteriaId)
      return p?.nilai || 0
    }

    // 2. Normalisasi Matriks (R)
    // Rumus: Rij = Xij / Sqrt(Sum(Xij^2))
    
    // Hitung pembagi (denominator) untuk setiap kriteria
    const denominators: Record<number, number> = {}
    
    for (const krit of kriteria) {
      let sumSquares = 0
      for (const kar of karyawan) {
        const val = getNilai(kar.id, krit.id)
        sumSquares += Math.pow(val, 2)
      }
      denominators[krit.id] = Math.sqrt(sumSquares)
    }

    // Hitung matriks ternormalisasi (R)
    // Struktur: { [karyawanId]: { [kriteriaId]: normalizedValue } }
    const normalizedMatrix: Record<number, Record<number, number>> = {}

    for (const kar of karyawan) {
      normalizedMatrix[kar.id] = {}
      for (const krit of kriteria) {
        const val = getNilai(kar.id, krit.id)
        const denominator = denominators[krit.id]
        // Hindari pembagian dengan nol
        normalizedMatrix[kar.id][krit.id] = denominator === 0 ? 0 : val / denominator
      }
    }

    // 3. Matriks Ternormalisasi Terbobot (Y)
    // Rumus: Yij = Rij * Wj
    const weightedMatrix: Record<number, Record<number, number>> = {}

    for (const kar of karyawan) {
      weightedMatrix[kar.id] = {}
      for (const krit of kriteria) {
        const r = normalizedMatrix[kar.id][krit.id]
        weightedMatrix[kar.id][krit.id] = r * krit.bobot
      }
    }

    // 4. Solusi Ideal Positif (A+) dan Negatif (A-)
    // Benefit: Max(Y) untuk A+, Min(Y) untuk A-
    // Cost: Min(Y) untuk A+, Max(Y) untuk A-

    const idealPositive: Record<number, number> = {} // A+
    const idealNegative: Record<number, number> = {} // A-

    for (const krit of kriteria) {
      const values = karyawan.map((k) => weightedMatrix[k.id][krit.id])
      const maxVal = Math.max(...values)
      const minVal = Math.min(...values)

      if (krit.tipe === 'Benefit') {
        idealPositive[krit.id] = maxVal
        idealNegative[krit.id] = minVal
      } else {
        // Cost
        idealPositive[krit.id] = minVal
        idealNegative[krit.id] = maxVal
      }
    }

    // 5. Jarak Solusi Ideal (D+ dan D-)
    // Rumus: Sqrt(Sum((Yij - A)^2))

    const distancePositive: Record<number, number> = {} // D+
    const distanceNegative: Record<number, number> = {} // D-

    for (const kar of karyawan) {
      let sumPos = 0
      let sumNeg = 0
      
      for (const krit of kriteria) {
        const y = weightedMatrix[kar.id][krit.id]
        const aPos = idealPositive[krit.id]
        const aNeg = idealNegative[krit.id]

        sumPos += Math.pow(y - aPos, 2)
        sumNeg += Math.pow(y - aNeg, 2)
      }

      distancePositive[kar.id] = Math.sqrt(sumPos)
      distanceNegative[kar.id] = Math.sqrt(sumNeg)
    }

    // 6. Nilai Preferensi (Ci)
    // Rumus: Ci = D- / (D- + D+)

    const preferences: { id: number; score: number }[] = []

    for (const kar of karyawan) {
      const dPos = distancePositive[kar.id]
      const dNeg = distanceNegative[kar.id]
      
      // Jika dPos + dNeg = 0 (misal semua nilai 0), maka score 0
      const score = (dPos + dNeg) === 0 ? 0 : dNeg / (dNeg + dPos)
      
      preferences.push({
        id: kar.id,
        score: score
      })
    }

    // 7. Perankingan
    // Urutkan dari score terbesar ke terkecil
    preferences.sort((a, b) => b.score - a.score)

    // 8. Simpan ke Database
    // Kita gunakan transaksi agar konsisten
    // Hapus hasil lama, simpan yang baru
    
    // Siapkan data untuk return
    const results: TopsisResult[] = []

    // Gunakan transaksi prisma
    await prisma.$transaction(async (tx) => {
      // Hapus semua data HasilTopsis
      await tx.hasilTopsis.deleteMany()

      // Insert data baru
      for (let i = 0; i < preferences.length; i++) {
        const item = preferences[i]
        const rank = i + 1
        
        // Simpan
        await tx.hasilTopsis.create({
          data: {
            karyawanId: item.id,
            skor: item.score,
            rank: rank
          }
        })

        // Cari nama karyawan untuk return data
        const karName = karyawan.find(k => k.id === item.id)?.nama_karyawan || 'Unknown'
        
        results.push({
          karyawanId: item.id,
          nama_karyawan: karName,
          skor: item.score,
          rank: rank
        })
      }
    })

    return results
  }
}
