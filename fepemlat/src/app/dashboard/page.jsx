"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Konten utama */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Area utama dashboard */}
        <main className="flex-1 ml-[272px] relative overflow-y-auto pt-14">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/bg2.png"
              alt="Dashboard Background"
              fill
              className="object-cover opacity-90"
            />
          </div>

          {/* Konten Dashboard */}
          <div className="p-10">
            <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-sm">
              Selamat Datang di Dashboard
            </h1>
            {/* Contoh tambahan konten */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-[#299d94] mb-2">
                  Total Alat
                </h2>
                <p className="text-3xl font-bold text-gray-800">128</p>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-[#299d94] mb-2">
                  Total Ruangan
                </h2>
                <p className="text-3xl font-bold text-gray-800">24</p>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-[#299d94] mb-2">
                  Peminjaman Aktif
                </h2>
                <p className="text-3xl font-bold text-gray-800">7</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
