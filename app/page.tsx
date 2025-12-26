import Stats from "@/components/Stats";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic'

export default async function Home() {
  const totalKaryawan = await prisma.karyawan.count();
  const totalKriteria = await prisma.kriteria.count();
  const latestResult = await prisma.hasilTopsis.findFirst({
    orderBy: { createdAt: 'desc' }
  });

  const latestResultDate = latestResult 
    ? latestResult.createdAt.toLocaleDateString('id-ID', { 
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
      }) 
    : null;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Sistem Penilaian Karyawan Terbaik
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Aplikasi ini membantu dalam pengambilan keputusan untuk menentukan karyawan terbaik
          menggunakan metode TOPSIS (Technique for Order Preference by Similarity to Ideal Solution).
        </p>
      </div>

      <Stats 
        totalKaryawan={totalKaryawan} 
        totalKriteria={totalKriteria} 
        latestResultDate={latestResultDate}
      />
    </div>
  );
}
