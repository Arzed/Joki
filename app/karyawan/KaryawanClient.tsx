'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Kartu from '@/components/Kartu'
import Tabel from '@/components/Tabel'
import Form from '@/components/Form'
import Tombol from '@/components/Tombol'

interface Karyawan {
  id: number
  nama_karyawan: string
  jabatan: string
}

export default function KaryawanClient() { 
  const router = useRouter()
  const [data, setData] = useState<Karyawan[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ id: 0, nama_karyawan: '', jabatan: '' })
  const [isEditing, setIsEditing] = useState(false)

  console.log(data)

  const resetForm = () => {
    setForm({ id: 0, nama_karyawan: '', jabatan: '' })
    setIsEditing(false)
  }

  const getdata = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/karyawan')
      const newData = await res.json()
      setData(newData)
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getdata()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isEditing) {
        await fetch(`/api/karyawan/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama_karyawan: form.nama_karyawan, jabatan: form.jabatan }),
        })
      } else {
        await fetch('/api/karyawan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama_karyawan: form.nama_karyawan, jabatan: form.jabatan }),
        })
      }
      
      router.refresh()
      const res = await fetch('/api/karyawan')
      const newData = await res.json()
      setData(newData)
      
      resetForm()
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: Karyawan) => {
    setForm(item)
    setIsEditing(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return

    setLoading(true)
    try {
      await fetch(`/api/karyawan/${id}`, { method: 'DELETE' })
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
          <Kartu title={isEditing ? 'Edit Karyawan' : 'Tambah Karyawan'}>
            <Form onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Karyawan</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.nama_karyawan}
                  onChange={(e) => setForm({ ...form, nama_karyawan: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Jabatan</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.jabatan}
                  onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                />
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
        <Kartu title="Daftar Karyawan">
          <Tabel headers={['No', 'Nama', 'Jabatan', 'Aksi']}>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500">Belum ada data karyawan</td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.nama_karyawan}</td>
                  <td className="p-3">{item.jabatan}</td>
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
