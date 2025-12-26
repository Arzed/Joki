import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { TopsisService } from "@/services/topsis.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { penilaian } = body; 
    // penilaian: { karyawanId: number, kriteriaId: number, nilai: number }[]

    if (!Array.isArray(penilaian)) {
      return NextResponse.json({ error: "Format data salah" }, { status: 400 });
    }

    // Gunakan transaksi untuk update bulk
    await prisma.$transaction(async (tx) => {
      // 1. Hapus semua data penilaian lama terlebih dahulu
      await tx.penilaian.deleteMany();

      // 2. Simpan data penilaian baru
      if (penilaian.length > 0) {
        const dataBaru = penilaian.map((p: any) => ({
          karyawanId: p.karyawanId,
          kriteriaId: p.kriteriaId,
          nilai: parseFloat(p.nilai),
        }));

        await tx.penilaian.createMany({
          data: dataBaru,
        });
      }
    });

    // Otomatis hitung ulang TOPSIS setelah data penilaian disimpan
    const service = new TopsisService();
    await service.calculate();

    return NextResponse.json({ message: "Penilaian berhasil disimpan dan hasil diperbarui" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menyimpan penilaian" }, { status: 500 });
  }
}
