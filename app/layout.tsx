import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistem Penilaian Karyawan Terbaik (TOPSIS)",
  description: "Aplikasi SPK menggunakan metode TOPSIS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100 min-h-screen flex`}
      >
        <Sidebar />
        <div className="flex-1 ml-64">
          <main className="p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
