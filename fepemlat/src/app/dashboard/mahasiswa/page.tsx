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
  // STATE MODAL BUKTI
  // ===============================
  const [showBukti, setShowBukti] = useState(false);
  const [selectedBukti, setSelectedBukti] = useState<{
    type: "alat" | "ruangan";
    data: any;
  } | null>(null);

  // ===============================
  // Helpers
  // ===============================
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-400 text-black";
      case "APPROVED":
        return "bg-green-500 text-white";
      case "REJECTED":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/borrowings/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setRiwayatAlat(Array.isArray(data.data) ? data.data : []);
      } catch {
        setRiwayatAlat([]);
      }
    };

    const fetchRuangan = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/room-borrowings/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setRiwayatRuangan(Array.isArray(data.data) ? data.data : []);
      } catch {
        setRiwayatRuangan([]);
      }
    };

    fetchAlat();
    fetchRuangan();
  }, [user, token]);

  // ===============================
  // Cancel
  // ===============================
  const handleCancelAlat = async (id: number) => {
    if (!confirm("Batalkan peminjaman alat ini?")) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/borrowings/${id}/cancel`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      setRiwayatAlat((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleCancelRuangan = async (id: number) => {
    if (!confirm("Batalkan peminjaman ruangan ini?")) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/room-borrowings/${id}/cancel`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      setRiwayatRuangan((prev) => prev.filter((r) => r.id !== id));
    }
  };

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
       <div className="flex flex-1 min-h-0">
        <Sidebar />

        {/* ⬇️ FIX SCROLL DI SINI */}
        <main className="flex-1 ml-[272px] overflow-y-auto pt-10 pb-24">
          <div className="p-10">
            <h1 className="text-4xl font-bold text-white drop-shadow-sm">
              Selamat Datang, {user?.name}
            </h1>
            {/* ===== CARD SUMMARY ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white/90 rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-[#299d94]">
                  Total Alat
                </h2>
                <p className="text-3xl font-bold">
                  {riwayatAlat.filter((r) => r.status === "APPROVED").length}
                </p>
              </div>

              <div className="bg-white/90 rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-[#299d94]">
                  Total Ruangan
                </h2>
                <p className="text-3xl font-bold">
                  {riwayatRuangan.filter((r) => r.status === "APPROVED").length}
                </p>
              </div>

              <div className="bg-white/90 rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-[#299d94]">
                  Peminjaman Aktif
                </h2>
                <p className="text-3xl font-bold">
                  {[...riwayatAlat, ...riwayatRuangan].filter(
                    (r) => r.status === "APPROVED"
                  ).length}
                </p>
              </div>
            </div>

           {/* ===== RIWAYAT ALAT ===== */}
            <div className="bg-white/90 rounded-xl shadow p-6 mt-6">
              <h2 className="text-xl font-bold text-[#299d94] mb-4">Riwayat Peminjaman Alat</h2>
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full table-auto text-sm">
                  <thead className="sticky top-0 bg-white text-left">
                    <tr>
                      <th className="px-2 py-2 w-1/5">Nama Alat</th>
                      <th className="px-2 py-2 w-1/5">Jumlah</th>
                      <th className="px-2 py-2 w-1/6">Pinjam</th>
                      <th className="px-2 py-2 w-1/6">Kembali</th>
                      <th className="px-2 py-2 w-1/3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatAlat
                      .filter(
                        (item) =>
                          item.status !== "RETURNED" &&
                          item.status !== "CANCELLED" &&
                          item.status !== "REJECTED"
                      )
                      .map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-2 py-2 truncate">{item.item_name}</td>
                          <td className="px-2 py-2 text-center">{item.quantity}</td>
                          <td className="px-2 py-2">{formatDate(item.borrow_date)}</td>
                          <td className="px-2 py-2">{formatDate(item.return_date)}</td>
                          <td className="px-2 py-2 flex gap-2 flex-nowrap items-center">
                            {item.status === "PENDING" && (
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                                Pending
                              </span>
                            )}
                            {item.status === "APPROVED" && (
                              <>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                  Disetujui
                                </span>
                                <button
                                onClick={() => {
                                  setSelectedBukti({ type: "alat", data: item });
                                  setShowBukti(true);
                                }}
                                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                                >
                                  Bukti
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ===== RIWAYAT RUANGAN ===== */}
            <div className="bg-white/90 rounded-xl shadow p-6 mt-6">
              <h2 className="text-xl font-bold text-[#299d94] mb-4">Riwayat Peminjaman Ruangan</h2>
              <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full table-auto text-sm">
                  <thead className="sticky top-0 bg-white text-left">
                    <tr>
                      <th className="px-2 py-2 w-1/5">Ruangan</th>
                      <th className="px-2 py-2 w-1/5">Kegiatan</th>
                      <th className="px-2 py-2 w-1/6">Mulai</th>
                      <th className="px-2 py-2 w-1/6">Selesai</th>
                      <th className="px-2 py-2 w-1/3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riwayatRuangan
                      .filter(
                        (item) =>
                          item.status !== "RETURNED" &&
                          item.status !== "CANCELLED" &&
                          item.status !== "REJECTED"
                      )
                      .map((item) => (
                        <tr key={item.id} className="border-t">
                          <td className="px-2 py-2 truncate">{item.room_name}</td>
                          <td className="px-2 py-2 truncate">{item.activity}</td>
                          <td className="px-2 py-2">{formatTime(item.startTime)}</td>
                          <td className="px-2 py-2">{formatTime(item.endTime)}</td>
                          <td className="px-2 py-2 flex gap-2 flex-nowrap items-center">
                            {item.status === "PENDING" && (
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                                Pending
                              </span>
                            )}
                            {item.status === "APPROVED" && (
                              <>
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                  Disetujui
                                </span>
                                <button
                                  onClick={() => {
                                  setSelectedBukti({ type: "ruangan", data: item });
                                  setShowBukti(true);
                                }}
                                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs"
                                >
                                  Bukti
                                </button>
                              </>
                            )}
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

      {/* ===== MODAL BUKTI ===== */}
      {showBukti && selectedBukti && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-[420px] rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-[#299d94] mb-4 text-center">
              Bukti Peminjaman
            </h2>

            <div className="text-sm space-y-2">
              <p>
                <b>Status:</b>{" "}
                <span className="text-green-600 font-semibold">
                  APPROVED
                </span>
              </p>

              {selectedBukti.type === "alat" && (
                <>
                  <p><b>Nama Alat:</b> {selectedBukti.data.item_name}</p>
                  <p><b>Jumlah:</b> {selectedBukti.data.quantity}</p>
                  <p><b>Pinjam:</b> {formatDate(selectedBukti.data.borrow_date)}</p>
                  <p><b>Kembali:</b> {formatDate(selectedBukti.data.return_date)}</p>
                </>
              )}

              {selectedBukti.type === "ruangan" && (
                <>
                  <p><b>Ruangan:</b> {selectedBukti.data.room_name}</p>
                  <p><b>Kegiatan:</b> {selectedBukti.data.activity}</p>
                  <p>
                    <b>Waktu:</b>{" "}
                    {formatTime(selectedBukti.data.startTime)} -{" "}
                    {formatTime(selectedBukti.data.endTime)}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => {
                setShowBukti(false);
                setSelectedBukti(null);
              }}
              className="mt-6 w-full bg-[#299d94] text-white py-2 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
