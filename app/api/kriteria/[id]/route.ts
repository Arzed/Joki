import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json();
    const { nama_kriteria, bobot, tipe } = body;

    const kriteria = await prisma.kriteria.update({
      where: { id: parseInt(id) },
      data: {
        nama_kriteria,
        bobot: parseFloat(bobot),
        tipe,
      },
    });

    return NextResponse.json(kriteria);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengupdate data kriteria" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.kriteria.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Kriteria berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus data kriteria" }, { status: 500 });
  }
}
