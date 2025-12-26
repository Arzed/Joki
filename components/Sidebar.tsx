import Link from 'next/link'

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-slate-700">
        <Link href="/" className="text-2xl font-bold">
          SPK TOPSIS
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
          Dashboard
        </Link>
        <Link href="/karyawan" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
          Data Karyawan
        </Link>
        <Link href="/kriteria" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
          Kriteria
        </Link>
        <Link href="/penilaian" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
          Penilaian
        </Link>
        <Link href="/hasil" className="block px-4 py-3 rounded-lg hover:bg-slate-700 transition-colors">
          Hasil Perankingan
        </Link>
      </nav>
      <div className="p-4 border-t border-slate-700 text-sm text-slate-400">
        &copy; 2025 SPK TOPSIS
      </div>
    </aside>
  )
}
