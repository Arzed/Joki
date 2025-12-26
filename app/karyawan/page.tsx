import { prisma } from "@/lib/prisma";
import KaryawanClient from "./KaryawanClient";

// export const dynamic = 'force-dynamic'

export default async function KaryawanPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Manajemen Karyawan</h1>
      <p className="text-slate-600">Kelola data karyawan yang akan dinilai kinerjanya.</p>
      
      <KaryawanClient />
    </div>
  );
}
