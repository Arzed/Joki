import { prisma } from "@/lib/prisma";
import PenilaianClient from "./PenilaianClient";

export const dynamic = 'force-dynamic'

export default async function PenilaianPage() {
  const karyawan = await prisma.karyawan.findMany({ orderBy: { id: 'asc' } });
  const kriteria = await prisma.kriteria.findMany({ orderBy: { id: 'asc' } });
  const penilaian = await prisma.penilaian.findMany();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Input Penilaian</h1>
      <p className="text-slate-600">Masukkan nilai kinerja karyawan (1-100) untuk setiap kriteria.</p>
      
      <PenilaianClient 
        karyawan={karyawan} 
        kriteria={kriteria} 
        existingPenilaian={penilaian} 
      />
    </div>
  );
}
