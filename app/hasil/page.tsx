import { prisma } from "@/lib/prisma";
import HasilClient from "./HasilClient";

export const dynamic = 'force-dynamic'

export default async function HasilPage() {
  const results = await prisma.hasilTopsis.findMany({
    orderBy: { rank: 'asc' },
    include: { karyawan: true }
  });

  const formattedResults = results.map((r: any) => ({
    id: r.id,
    karyawanId: r.karyawanId,
    nama_karyawan: r.karyawan.nama_karyawan,
    skor: r.skor,
    rank: r.rank,
    createdAt: r.createdAt
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Hasil Penilaian & Perankingan</h1>
      <p className="text-slate-600">
        Hasil perhitungan metode TOPSIS untuk menentukan karyawan terbaik.
      </p>
      
      <HasilClient initialResults={formattedResults} />
    </div>
  );
}
