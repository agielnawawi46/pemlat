"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function TentangPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1 min-h-0"> {/* min-h-0 penting agar scroll berfungsi */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 ml-[272px] pt-14 pb-24 bg-white overflow-y-auto relative">
          {/* Background */}
          <Image
            src="/images/bg2.png"
            alt="Background"
            fill
            className="object-cover -z-10"
          />

          <div className="p-10 max-w-4xl mx-auto text-gray-800">
            <h1 className="text-3xl font-bold text-[#289c93] mb-6">
              Tentang Sistem Peminjaman Alat
            </h1>

            <p className="text-base leading-relaxed mb-4">
              Sistem ini dibuat untuk membantu mahasiswa dan staf kampus dalam
              proses{" "}
              <span className="font-semibold text-[#289c93]">
                peminjaman alat
              </span>{" "}
              dan pengelolaan inventaris. Dengan adanya sistem ini, proses
              pencatatan peminjaman menjadi lebih mudah, cepat, dan transparan.
            </p>

            <p className="text-base leading-relaxed mb-4">
              Melalui dashboard ini, pengguna dapat melihat daftar alat, status
              ketersediaan, serta ruangan tempat alat tersebut berada. Data alat
              dan ruangan disinkronkan langsung dengan database kampus untuk
              memastikan akurasi dan efisiensi pengelolaan.
            </p>

            <h2 className="text-2xl font-semibold text-[#289c93] mb-3">
              Tujuan Pengembangan
            </h2>
            <ul className="list-disc ml-6 text-gray-700 space-y-2 mb-8">
              <li>
                Meningkatkan efisiensi proses peminjaman alat di lingkungan
                kampus.
              </li>
              <li>Mempermudah pelacakan alat dan ruangan yang tersedia.</li>
              <li>
                Mendukung kegiatan akademik dan penelitian dengan manajemen alat
                yang terorganisir.
              </li>
              <li>
                Mengurangi kehilangan atau kerusakan alat karena data tersimpan
                secara digital.
              </li>
            </ul>

            <div className="p-6 bg-[#e5f8f7] rounded-2xl border border-[#289c93]/20 shadow-sm">
              <h3 className="text-lg font-semibold text-[#289c93] mb-2">
                Pengembang Sistem
              </h3>
              <p className="text-sm text-gray-700">
                Sistem ini dikembangkan oleh tim mahasiswa Teknik Informatika
                sebagai bagian dari proyek pengembangan aplikasi kampus, dengan
                bimbingan dosen pembimbing dan dukungan unit fasilitas kampus.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
