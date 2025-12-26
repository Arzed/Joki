'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Kartu from '@/components/Kartu'
import Tabel from '@/components/Tabel'
import Form from '@/components/Form'
import Tombol from '@/components/Tombol'

interface Kriteria {
  id: number
  nama_kriteria: string
  bobot: number
  tipe: string
}

export default function KriteriaClient({ initialData }: { initialData: Kriteria[] }) {
  const router = useRouter()
  const [data, setData] = useState<Kriteria[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ id: 0, nama_kriteria: '', bobot: '', tipe: 'Benefit' })
  const [isEditing, setIsEditing] = useState(false)

  const totalBobot = useMemo(() => {
    return data.reduce((sum, item) => sum + item.bobot, 0)
  }, [data])

  const resetForm = () => {
    setForm({ id: 0, nama_kriteria: '', bobot: '', tipe: 'Benefit' })
    setIsEditing(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        nama_kriteria: form.nama_kriteria,
        bobot: parseFloat(form.bobot),
        tipe: form.tipe
      }

      if (isEditing) {
        await fetch(`/api/kriteria/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch('/api/kriteria', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      
      router.refresh()
      const res = await fetch('/api/kriteria')
      const newData = await res.json()
      setData(newData)
      
      resetForm()
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: Kriteria) => {
    setForm({
      id: item.id,
      nama_kriteria: item.nama_kriteria,
      bobot: item.bobot.toString(),
      tipe: item.tipe
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return

    setLoading(true)
    try {
      await fetch(`/api/kriteria/${id}`, { method: 'DELETE' })
      const newData = data.filter(item => item.id !== id)
      setData(newData)
      router.refresh()
    } catch (error) {
      alert('Gagal menghapus')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Form Section */}
      <div className="md:col-span-1">
        <div className="sticky top-4">
          <Kartu title={isEditing ? 'Edit Kriteria' : 'Tambah Kriteria'}>
            <Form onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kriteria</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.nama_kriteria}
                  onChange={(e) => setForm({ ...form, nama_kriteria: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bobot (Desimal, contoh: 0.25)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.bobot}
                  onChange={(e) => setForm({ ...form, bobot: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipe Atribut</label>
                <select
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.tipe}
                  onChange={(e) => setForm({ ...form, tipe: e.target.value })}
                >
                  <option value="Benefit">Benefit (Semakin besar semakin baik)</option>
                  <option value="Cost">Cost (Semakin kecil semakin baik)</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Tombol type="submit" disabled={loading}>
                  {loading ? 'Menyimpan...' : (isEditing ? 'Update' : 'Simpan')}
                </Tombol>
                {isEditing && (
                  <Tombol type="button" variant="secondary" onClick={resetForm} disabled={loading}>
                    Batal
                  </Tombol>
                )}
              </div>
            </Form>
          </Kartu>
        </div>
      </div>

      {/* Table Section */}
      <div className="md:col-span-2">
        <Kartu>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Daftar Kriteria</h2>
            <div className={`text-sm font-bold px-3 py-1 rounded ${Math.abs(totalBobot - 1) < 0.001 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              Total Bobot: {totalBobot.toFixed(2)} {Math.abs(totalBobot - 1) >= 0.001 && '(Harus 1.00)'}
            </div>
          </div>
          
          <Tabel headers={['No', 'Nama Kriteria', 'Bobot', 'Tipe', 'Aksi']}>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">Belum ada data kriteria</td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.nama_kriteria}</td>
                  <td className="p-3">{item.bobot}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${item.tipe === 'Benefit' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      {item.tipe}
                    </span>
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </Tabel>
        </Kartu>
      </div>
    </div>
  )
}