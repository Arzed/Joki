import { NextResponse } from "next/server";
import { TopsisService } from "@/services/topsis.service";

export async function POST() {
  try {
    const service = new TopsisService();
    const results = await service.calculate();
    
    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal melakukan perhitungan TOPSIS" }, { status: 500 });
  }
}
