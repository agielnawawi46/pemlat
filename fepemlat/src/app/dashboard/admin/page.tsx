"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect jika bukan admin atau belum login
  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/login");
      else if (user.role !== "admin") router.replace("/dashboard/mahasiswa");
    }
  }, [user, loading, router]);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 relative overflow-y-auto pt-18 px-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Dashboard Admin
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {[
              { title: "Verifikasi Peminjaman", desc: "Periksa dan setujui permintaan peminjaman alat.", color: "from-blue-400 to-blue-600", link: "/dashboard/admin/verifikasi" },
              { title: "Kelola Alat", desc: "Tambah, ubah, atau hapus data alat.", color: "from-green-400 to-green-600", link: "/dashboard/admin/alat" },
              { title: "Riwayat Peminjaman", desc: "Pantau semua peminjaman yang sudah dilakukan.", color: "from-yellow-400 to-yellow-600", link: "/dashboard/admin/riwayat" },
              { title: "Upload Video Tutorial Penggunaan Aplikasi", desc: "Upload video panduan agar mahasiswa memahami cara memakai aplikasi.", color: "from-purple-400 to-purple-600", link: "/dashboard/admin/upload-video" },
              { title: "Kelola Ruangan", desc: "Tambah dan ubah data ruangan yang tersedia.", color: "from-indigo-400 to-indigo-600", link: "/dashboard/admin/ruangan" },
              { title: "Laporan Sistem", desc: "Lihat laporan penggunaan alat dan aktivitas sistem.", color: "from-red-400 to-red-600", link: "/dashboard/admin/laporan" },
            ].map((tugas, index) => (
              <a key={index} href={tugas.link} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100 p-8 relative overflow-hidden group">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${tugas.color} transition duration-300`} />
                <h2 className="text-2xl font-semibold text-gray-800 mb-3 relative z-10">{tugas.title}</h2>
                <p className="text-base text-gray-600 relative z-10">{tugas.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
