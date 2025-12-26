import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const karyawan = await prisma.karyawan.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(karyawan);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data karyawan" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama_karyawan, jabatan } = body;

    if (!nama_karyawan || !jabatan) {
      return NextResponse.json({ error: "Nama dan Jabatan harus diisi" }, { status: 400 });
    }

    const karyawan = await prisma.karyawan.create({
      data: {
        nama_karyawan,
        jabatan,
      },
    });

    return NextResponse.json(karyawan, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan data karyawan" }, { status: 500 });
  }
}
