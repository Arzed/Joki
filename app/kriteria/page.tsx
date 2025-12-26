import { prisma } from "@/lib/prisma";
import KriteriaClient from "./KriteriaClient";

export const dynamic = 'force-dynamic'

export default async function KriteriaPage() {
  const kriteria = await prisma.kriteria.findMany({
    orderBy: { id: 'asc' }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Manajemen Kriteria</h1>
      <p className="text-slate-600">Atur kriteria penilaian dan bobot untuk metode TOPSIS.</p>
      
      <KriteriaClient initialData={kriteria} />
    </div>
  );
}
