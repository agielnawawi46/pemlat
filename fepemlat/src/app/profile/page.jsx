"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function ProfilePage() {
  // 🔹 Data sementara (nanti diganti dengan fetch dari database kampus)
  const mahasiswa = {
    nama: "John Doe",
    nim: "123456789",
    prodi: "Teknik Informatika",
    email: "john.doe@poltek.ac.id",
    angkatan: "2023",
    status: "Aktif",
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Konten utama */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 relative bg-white overflow-y-auto">
          {/* Background */}
          <Image
            src="/images/bg2.png"
            alt="Background"
            fill
            className="object-cover -z-10"
          />

          {/* Konten Profil */}
          <div className="p-10">
            <h1 className="text-3xl font-bold text-[#299d94] mb-8">
              Profil Mahasiswa
            </h1>

            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                  <p className="font-semibold text-lg">{mahasiswa.nama}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">NIM</p>
                  <p className="font-semibold text-lg">{mahasiswa.nim}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Program Studi</p>
                  <p className="font-semibold text-lg">{mahasiswa.prodi}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-lg">{mahasiswa.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Angkatan</p>
                  <p className="font-semibold text-lg">{mahasiswa.angkatan}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status Akademik</p>
                  <p className="font-semibold text-lg text-green-600">
                    {mahasiswa.status}
                  </p>
                </div>
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
