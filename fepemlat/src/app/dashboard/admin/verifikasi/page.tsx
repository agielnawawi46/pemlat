"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function VerifikasiPeminjamanPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/borrow/pending");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifikasi = async (id: number, action: "approve" | "reject") => {
    try {
      await fetch(`http://localhost:3001/api/borrow/verify/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      fetchRequests(); // refresh data
    } catch (err) {
      console.error("Gagal verifikasi:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

        <main className="flex-1 ml-[272px] pt-20 pb-10 px-10">
          <h1 className="text-2xl font-bold text-[#289c93] mb-6">Verifikasi Peminjaman</h1>

          {loading ? (
            <p className="text-gray-500">Memuat data peminjaman...</p>
          ) : requests.length === 0 ? (
            <p className="text-gray-500">Tidak ada permintaan yang menunggu verifikasi.</p>
          ) : (
            <table className="min-w-full border rounded-xl shadow text-sm">
              <thead className="bg-[#289c93] text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Peminjam</th>
                  <th className="px-4 py-2 text-left">Alat</th>
                  <th className="px-4 py-2 text-left">Tanggal Pinjam</th>
                  <th className="px-4 py-2 text-left">Tanggal Kembali</th>
                  <th className="px-4 py-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((item: any) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">{item.peminjam}</td>
                    <td className="px-4 py-2">{item.item_name}</td>
                    <td className="px-4 py-2">{item.borrow_date}</td>
                    <td className="px-4 py-2">{item.return_date}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleVerifikasi(item.id, "approve")}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Setujui
                      </button>
                      <button
                        onClick={() => handleVerifikasi(item.id, "reject")}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Tolak
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      <Footer />
    </div>
  );
}