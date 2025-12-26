-- CreateTable
CREATE TABLE "Karyawan" (
    "id" SERIAL NOT NULL,
    "nama_karyawan" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,

    CONSTRAINT "Karyawan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kriteria" (
    "id" SERIAL NOT NULL,
    "nama_kriteria" TEXT NOT NULL,
    "bobot" DOUBLE PRECISION NOT NULL,
    "tipe" TEXT NOT NULL,

    CONSTRAINT "Kriteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Penilaian" (
    "id" SERIAL NOT NULL,
    "nilai" DOUBLE PRECISION NOT NULL,
    "karyawanId" INTEGER NOT NULL,
    "kriteriaId" INTEGER NOT NULL,

    CONSTRAINT "Penilaian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HasilTopsis" (
    "id" SERIAL NOT NULL,
    "skor" DOUBLE PRECISION NOT NULL,
    "rank" INTEGER NOT NULL,
    "karyawanId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HasilTopsis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Penilaian_karyawanId_kriteriaId_key" ON "Penilaian"("karyawanId", "kriteriaId");

-- CreateIndex
CREATE UNIQUE INDEX "HasilTopsis_karyawanId_key" ON "HasilTopsis"("karyawanId");

-- AddForeignKey
ALTER TABLE "Penilaian" ADD CONSTRAINT "Penilaian_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "Karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Penilaian" ADD CONSTRAINT "Penilaian_kriteriaId_fkey" FOREIGN KEY ("kriteriaId") REFERENCES "Kriteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HasilTopsis" ADD CONSTRAINT "HasilTopsis_karyawanId_fkey" FOREIGN KEY ("karyawanId") REFERENCES "Karyawan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
