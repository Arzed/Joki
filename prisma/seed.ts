import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }

  // Hapus data lama
  await prisma.penilaian.deleteMany()
  await prisma.hasilTopsis.deleteMany()
  await prisma.kriteria.deleteMany()
  await prisma.karyawan.deleteMany()

  console.log('Memulai seeding...')

  // Buat Kriteria
  const kriteriaData = [
    { nama_kriteria: 'Kedisiplinan', bobot: 0.30, tipe: 'Benefit' },
    { nama_kriteria: 'Kerjasama Tim', bobot: 0.25, tipe: 'Benefit' },
    { nama_kriteria: 'Hasil Kerja', bobot: 0.35, tipe: 'Benefit' },
    { nama_kriteria: 'Keterlambatan', bobot: 0.10, tipe: 'Cost' }, // Cost karena semakin kecil semakin baik
  ]

  const kriteriaList = []
  for (const k of kriteriaData) {
    const created = await prisma.kriteria.create({ data: k })
    kriteriaList.push(created)
  }

  // Buat Karyawan
  const karyawanData = [
    { nama_karyawan: 'Budi Santoso', jabatan: 'Staff IT' },
    { nama_karyawan: 'Siti Aminah', jabatan: 'Staff HRD' },
    { nama_karyawan: 'Rudi Hartono', jabatan: 'Marketing' },
    { nama_karyawan: 'Dewi Sartika', jabatan: 'Keuangan' },
    { nama_karyawan: 'Agus Salim', jabatan: 'Operasional' },
  ]

  const karyawanList = []
  for (const k of karyawanData) {
    const created = await prisma.karyawan.create({ data: k })
    karyawanList.push(created)
  }

  // Berikan Penilaian Random (1-100)
  for (const karyawan of karyawanList) {
    for (const kriteria of kriteriaList) {
      let nilai = 0
      if (kriteria.nama_kriteria === 'Keterlambatan') {
        nilai = Math.floor(Math.random() * 20) // 0 - 20 (jarang terlambat)
      } else {
        nilai = Math.floor(Math.random() * 30) + 70 // 70 - 100 (bagus)
      }
      
      await prisma.penilaian.create({
        data: {
          karyawanId: karyawan.id,
          kriteriaId: kriteria.id,
          nilai: nilai,
        },
      })
    }
  }

  console.log('Seeding selesai.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
