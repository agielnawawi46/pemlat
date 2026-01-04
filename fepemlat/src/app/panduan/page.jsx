"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function PanduanPage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1 min-h-0"> {/* min-h-0 penting agar scroll aktif */}
        <Sidebar />

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
              Panduan Penggunaan Sistem
            </h1>

            <p className="text-base leading-relaxed mb-8">
              Halaman ini berisi langkah-langkah untuk menggunakan sistem
              peminjaman alat secara efektif. Ikuti panduan berikut untuk
              memastikan proses peminjaman berjalan dengan lancar dan data
              tercatat dengan benar.
            </p>

            {/* Langkah-langkah */}
            <div className="space-y-8">
              {[
                {
                  step: "1️⃣ Login ke Sistem",
                  desc: "Gunakan akun mahasiswa atau staf kampus untuk masuk ke sistem. Pastikan data yang digunakan benar agar akses sesuai dengan peran Anda.",
                },
                {
                  step: "2️⃣ Pilih Kategori Alat",
                  desc: "Setelah masuk, pilih kategori alat seperti Electronic, Classroom, atau Laboratory Equipment untuk melihat daftar alat yang tersedia.",
                },
                {
                  step: "3️⃣ Ajukan Peminjaman",
                  desc: "Klik alat yang ingin dipinjam, lalu isi form peminjaman. Pastikan data seperti tanggal peminjaman dan keperluan dicantumkan dengan jelas.",
                },
                {
                  step: "4️⃣ Konfirmasi & Persetujuan",
                  desc: "Setelah diajukan, admin akan meninjau dan menyetujui peminjaman. Notifikasi status akan muncul di dashboard Anda.",
                },
                {
                  step: "5️⃣ Pengambilan dan Pengembalian",
                  desc: "Ambil alat sesuai jadwal yang telah disetujui. Setelah selesai digunakan, kembalikan alat ke petugas sesuai prosedur untuk menghindari denda atau pembatasan akses di masa mendatang.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-md border border-gray-100"
                >
                  <h2 className="text-xl font-semibold text-[#289c93] mb-2">
                    {item.step}
                  </h2>
                  <p className="text-gray-700 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Catatan */}
            <div className="p-6 bg-[#e5f8f7] rounded-2xl border border-[#289c93]/20 shadow-sm mt-10">
              <h3 className="text-lg font-semibold text-[#289c93] mb-2">
                Catatan Penting
              </h3>
              <ul className="list-disc ml-6 text-gray-700 space-y-2">
                <li>Gunakan alat sesuai dengan ketentuan dan tujuan akademik.</li>
                <li>Laporkan segera jika alat mengalami kerusakan atau hilang.</li>
                <li>
                  Pastikan alat dikembalikan tepat waktu untuk menghindari
                  sanksi.
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
