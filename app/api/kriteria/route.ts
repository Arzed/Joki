import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const kriteria = await prisma.kriteria.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(kriteria);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data kriteria" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_kriteria, bobot, tipe } = body;

    if (!nama_kriteria || bobot === undefined || !tipe) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const kriteria = await prisma.kriteria.create({
      data: {
        nama_kriteria,
        bobot: parseFloat(bobot),
        tipe,
      },
    });

    return NextResponse.json(kriteria, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan data kriteria" }, { status: 500 });
  }
}
