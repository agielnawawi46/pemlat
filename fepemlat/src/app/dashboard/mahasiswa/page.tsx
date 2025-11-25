"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // ✅ Ambil userId dari localStorage di client
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/borrow/user/${userId}`);
        const data = await res.json();
        console.log("Data riwayat:", data);
        setRiwayat(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal mengambil riwayat:", err);
        setRiwayat([]);
      } finally {
        setLoadingRiwayat(false);
      }
    };

    if (userId) fetchRiwayat();
  }, [userId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 ml-[272px] relative overflow-y-auto pt-14">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/bg2.png"
              alt="Dashboard Background"
              fill
              className="object-cover opacity-90"
            />
          </div>

          <div className="p-10">
            <h1 className="text-4xl font-bold text-white mb-6 drop-shadow-sm">
              Selamat Datang di Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-[#299d94] mb-2">Total Alat</h2>
                <p className="text-3xl font-bold text-gray-800">128</p>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-[#299d94] mb-2">Total Ruangan</h2>
                <p className="text-3xl font-bold text-gray-800">24</p>
              </div>

              <div className="bg-white/90 backdrop-blur-md rounded-xl shadow p-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-[#299d94] mb-2">Peminjaman Aktif</h2>
                <p className="text-3xl font-bold text-gray-800">
                  {Array.isArray(riwayat)
                    ? riwayat.filter((r) => r.status === "pending" || r.status === "approved").length
                    : 0}
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mt-12 mb-4 drop-shadow-sm">
              Riwayat Peminjaman Anda
            </h2>

            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow p-6 border border-gray-100 overflow-x-auto">
              {loadingRiwayat ? (
                <p className="text-gray-500 text-sm">Memuat riwayat peminjaman...</p>
              ) : riwayat.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada riwayat peminjaman.</p>
              ) : (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#299d94] font-semibold">
                      <th className="px-4 py-2">Nama Alat</th>
                      <th className="px-4 py-2">Tanggal Pinjam</th>
                      <th className="px-4 py-2">Tanggal Kembali</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayat.map((item) => (
                      <tr key={item.id} className="border-t">
                        <td className="px-4 py-2">{item.item_name || "Alat #" + item.item_id}</td>
                        <td className="px-4 py-2">{item.borrow_date}</td>
                        <td className="px-4 py-2">{item.return_date}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}