'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Tombol from '@/components/Tombol'

interface HasilTopsis {
  id?: number
  karyawanId: number
  nama_karyawan: string
  skor: number
  rank: number
  createdAt?: Date
}

export default function HasilClient({ initialResults }: { initialResults: HasilTopsis[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<HasilTopsis[]>(initialResults)

  const handleCalculate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/topsis', { method: 'POST' })
      if (!res.ok) throw new Error('Gagal')
      
      const newResults = await res.json()
      setResults(newResults)
      router.refresh()
    } catch (error) {
      alert('Gagal melakukan perhitungan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Hasil Perankingan</h2>
          <p className="text-sm text-slate-500">Klik tombol untuk memperbarui hasil perhitungan TOPSIS</p>
        </div>
        <Tombol onClick={handleCalculate} disabled={loading}>
          {loading ? 'Menghitung...' : 'Hitung TOPSIS'}
        </Tombol>
      </div>

      {results.length > 0 && (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Tabel Peringkat</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b">
                    <th className="p-3">Peringkat</th>
                    <th className="p-3">Nama Karyawan</th>
                    <th className="p-3">Skor Preferensi (Vi)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((item) => (
                    <tr key={item.karyawanId} className={`border-b hover:bg-slate-50 ${item.rank === 1 ? 'bg-yellow-50' : ''}`}>
                      <td className="p-3 font-bold text-center w-24">
                        {item.rank === 1 ? '👑 1' : item.rank}
                      </td>
                      <td className="p-3 font-medium">{item.nama_karyawan}</td>
                      <td className="p-3">{item.skor.toFixed(4)}</td>
                      <td className="p-3">
                        {item.rank === 1 && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                            Terbaik
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-6">Visualisasi Hasil</h3>
            <div className="space-y-4">
              {results.map((item) => (
                <div key={item.karyawanId} className="relative">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{item.nama_karyawan}</span>
                    <span className="text-slate-500">{item.skor.toFixed(4)}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full transition-all duration-1000 ${item.rank === 1 ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${item.skor * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
