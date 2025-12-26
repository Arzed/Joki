"use client"

interface StatsProps {
  totalKaryawan: number
  totalKriteria: number
  latestResultDate: string | null
}

export default function Stats({ totalKaryawan, totalKriteria, latestResultDate }: StatsProps) {
  return(
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h3 className="text-xl font-semibold mb-2">Total Karyawan</h3>
          <p className="text-4xl font-bold text-blue-600">{totalKaryawan}</p>
          <p className="text-sm text-slate-500 mt-2">Data karyawan terdaftar</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h3 className="text-xl font-semibold mb-2">Total Kriteria</h3>
          <p className="text-4xl font-bold text-green-600">{totalKriteria}</p>
          <p className="text-sm text-slate-500 mt-2">Kriteria penilaian aktif</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
          <h3 className="text-xl font-semibold mb-2">Status Penilaian</h3>
          <p className="text-lg font-medium text-slate-700">
            {latestResultDate ? "Sudah dilakukan" : "Belum ada data"}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            {latestResultDate ? `Terakhir: ${latestResultDate}` : "Silahkan lakukan penilaian"}
          </p>
        </div>
      </div>
    )
}
