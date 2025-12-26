import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json();
    const { nama_karyawan, jabatan } = body;

    const karyawan = await prisma.karyawan.update({
      where: { id: parseInt(id) },
      data: {
        nama_karyawan,
        jabatan,
      },
    });

    return NextResponse.json(karyawan);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate data karyawan" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.karyawan.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Karyawan berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data karyawan" }, { status: 500 });
  }
}
