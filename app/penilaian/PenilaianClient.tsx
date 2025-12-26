'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Kartu from '@/components/Kartu'
import Tombol from '@/components/Tombol'
import Form from '@/components/Form'

interface Karyawan {
  id: number
  nama_karyawan: string
}

interface Kriteria {
  id: number
  nama_kriteria: string
}

interface Penilaian {
  karyawanId: number
  kriteriaId: number
  nilai: number
}

interface Props {
  karyawan: Karyawan[]
  kriteria: Kriteria[]
  existingPenilaian: Penilaian[]
}

export default function PenilaianClient({ karyawan, kriteria, existingPenilaian }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Initialize state from existing data
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {}
    existingPenilaian.forEach(p => {
      initial[`${p.karyawanId}-${p.kriteriaId}`] = p.nilai
    })
    return initial
  })

  const handleChange = (karyawanId: number, kriteriaId: number, value: string) => {
    setScores(prev => ({
      ...prev,
      [`${karyawanId}-${kriteriaId}`]: parseFloat(value) || 0
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Convert state back to array
      const payload = []
      for (const k of karyawan) {
        for (const c of kriteria) {
          const key = `${k.id}-${c.id}`
          if (scores[key] !== undefined) {
            payload.push({
              karyawanId: k.id,
              kriteriaId: c.id,
              nilai: scores[key]
            })
          }
        }
      }

      const res = await fetch('/api/penilaian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ penilaian: payload }),
      })

      if (!res.ok) throw new Error('Gagal menyimpan')

      alert('Penilaian berhasil disimpan')
      router.refresh()
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan')
    } finally {
      setLoading(false)
    }
  }

  if (karyawan.length === 0 || kriteria.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md text-yellow-800">
        Data Karyawan atau Kriteria belum lengkap. Silahkan lengkapi data terlebih dahulu.
      </div>
    )
  }

  return (
    <Kartu className="overflow-x-auto">
      <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b">
              <th className="p-3 text-left min-w-[200px] sticky left-0 bg-slate-100 z-10">Karyawan</th>
              {kriteria.map(k => (
                <th key={k.id} className="p-3 text-center min-w-[120px]">{k.nama_kriteria}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {karyawan.map(kar => (
              <tr key={kar.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium sticky left-0 bg-white z-10">{kar.nama_karyawan}</td>
                {kriteria.map(krit => (
                  <td key={krit.id} className="p-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-20 px-2 py-1 border rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={scores[`${kar.id}-${krit.id}`] ?? ''}
                      onChange={(e) => handleChange(kar.id, krit.id, e.target.value)}
                      placeholder="0"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <Tombol type="submit" disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Penilaian'}
          </Tombol>
        </div>
      </Form>
    </Kartu>
  )
}
