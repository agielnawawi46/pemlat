"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, token } = useAuth();

  const [riwayatAlat, setRiwayatAlat] = useState<any[]>([]);
  const [riwayatRuangan, setRiwayatRuangan] = useState<any[]>([]);

// ===============================
// Helpers
// ===============================
const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-400 text-black"; // kuning
    case "APPROVED":
      return "bg-green-500 text-white";  // hijau
    case "REJECTED":
      return "bg-red-600 text-white";    // merah
    default:
      return "bg-gray-500 text-white";   // default
  }
};

  // ===============================
  // Helpers
  // ===============================
  const formatDate = (isoDate: string) => {
    if (!isoDate) return "-";
    const date = new Date(isoDate);
    return date.toLocaleDateString("id-ID");
  };

  const formatTime = (time: string) => {
    if (!time) return "-";
    const [h, m] = time.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  // ===============================
  // Fetch data
  // ===============================
  useEffect(() => {
    if (!user || !token) return;

    const fetchAlat = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrowings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRiwayatAlat(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setRiwayatAlat([]);
      }
    };

    const fetchRuangan = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room-borrowings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRiwayatRuangan(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setRiwayatRuangan([]);
      }
    };

    fetchAlat();
    fetchRuangan();
  }, [user, token]);

  // ===============================
  // Batalkan peminjaman
  // ===============================
  const handleCancelAlat = async (id: number) => {
    if (!confirm("Batalkan peminjaman alat ini?")) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/borrowings/${id}/cancel`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) setRiwayatAlat((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCancelRuangan = async (id: number) => {
    if (!confirm("Batalkan peminjaman ruangan ini?")) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room-borrowings/${id}/cancel`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) setRiwayatRuangan((prev) => prev.filter((r) => r.id !== id));
  };

  const activeCount = [
    ...riwayatAlat,
    ...riwayatRuangan,
  ].filter((r) => r.status === "PENDING" || r.status === "APPROVED").length;

  // ===============================
  // UI
  // ===============================
  return (
    <div className="flex flex-col h-screen relative text-black">
      <Image
        src="/images/bg2.png"
        alt="Dashboard Background"
        fill
        className="object-cover opacity-90 -z-10"
      />

      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 ml-[272px] overflow-y-auto pt-14">
          <div className="p-10">
            <h1 className="text-4xl font-bold text-white drop-shadow-sm">
              Selamat Datang, {user?.name}
            </h1>

            {/* ===== CARD ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {/* Total Alat */}
              <div className="bg-white/90 rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-[#299d94]">Total Alat</h2>
                <p className="text-3xl font-bold">
                  {riwayatAlat
                    .filter((r) => r.status === "APPROVED") // hanya yang sudah disetujui
                    .length}
                </p>
              </div>

              {/* Total Ruangan */}
              <div className="bg-white/90 rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-[#299d94]">Total Ruangan</h2>
                <p className="text-3xl font-bold">
                  {riwayatRuangan
                    .filter((r) => r.status === "APPROVED") // hanya yang sudah disetujui
                    .length}
                </p>
              </div>

              {/* Peminjaman Aktif */}
              <div className="bg-white/90 rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-[#299d94]">Peminjaman Aktif</h2>
                <p className="text-3xl font-bold">
                  {[
                    ...riwayatAlat,
                    ...riwayatRuangan,
                  ].filter((r) => r.status === "APPROVED").length}
                </p>
              </div>
            </div>

            {/* ===== RIWAYAT ALAT ===== */}
            <div className="bg-white/90 rounded-xl shadow p-6 mt-6 mb-2">
              <h2 className="text-xl font-bold text-[#299d94] mb-4">Riwayat Peminjaman Alat</h2>
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full table-fixed text-left border-collapse">
                  <thead className="bg-white sticky top-0">
                    <tr>
                      <th className="w-1/4 px-4 py-2">Nama Alat</th>
                      <th className="w-1/12 px-4 py-2">Jumlah</th>
                      <th className="w-1/6 px-4 py-2">Pinjam</th>
                      <th className="w-1/6 px-4 py-2">Kembali</th>
                      <th className="w-1/4 px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatAlat
                      .filter((item) => item.status !== "RETURNED")
                      .map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-4 py-2 text-left">{item.item_name}</td>
                          <td className="px-4 py-2 text-left">{item.quantity}</td>
                          <td className="px-4 py-2 text-left">{formatDate(item.borrow_date)}</td>
                          <td className="px-4 py-2 text-left">{formatDate(item.return_date)}</td>
                          <td className="px-4 py-2 flex gap-2 items-center">
                            {item.status === "PENDING" && (
                              <button
                                onClick={() => handleCancelAlat(item.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Batalkan
                              </button>
                            )}
                            <span
                              className={`px-3 py-1 rounded text-white text-sm ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ===== RIWAYAT RUANGAN ===== */}
            <div className="bg-white/90 rounded-xl shadow p-6 mt-6 mb-2">
              <h2 className="text-xl font-bold text-[#299d94] mb-4">Riwayat Peminjaman Ruangan</h2>
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full table-fixed text-left border-collapse">
                  <thead className="bg-white sticky top-0">
                    <tr>
                      <th className="w-1/5 px-4 py-2">Ruangan</th>
                      <th className="w-1/4 px-4 py-2">Kegiatan</th>
                      <th className="w-1/6 px-4 py-2">Mulai</th>
                      <th className="w-1/6 px-4 py-2">Selesai</th>
                      <th className="w-1/4 px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatRuangan
                      .filter((item) => item.status !== "RETURNED") // tampilkan yang belum RETURNED
                      .map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-4 py-2 text-left">{item.room_name}</td>
                          <td className="px-4 py-2 text-left">{item.activity}</td>
                          <td className="px-4 py-2 text-left">{formatTime(item.startTime)}</td>
                          <td className="px-4 py-2 text-left">{formatTime(item.endTime)}</td>
                          <td className="px-4 py-2 flex gap-2 items-center">
                            {item.status === "PENDING" && (
                              <button
                                onClick={() => handleCancelRuangan(item.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                              >
                                Batalkan
                              </button>
                            )}
                            <span
                              className={`px-3 py-1 rounded text-white text-sm ${getStatusColor(item.status)}`}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
