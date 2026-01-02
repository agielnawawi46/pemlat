"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";

/* =======================
   INTERFACE ALAT
======================= */
interface BorrowingItem {
  Equipment: { name: string };
  quantity: number;
}

interface Borrowing {
  id: number;
  userId: number;
  User: { name: string; email: string };
  items: BorrowingItem[];
  borrowDate: string;
  returnDate: string;
  status: string;
}

/* =======================
   INTERFACE GEDUNG
======================= */
interface GedungBorrowing {
  id: number;
  User: { name: string };
  namaRuangan: string;
  kegiatan: string; 
  jamMulai: string;
  jamSelesai: string;
  status: string;
}

export default function VerifikasiPeminjamanPage() {
  const { token, user } = useAuth();

  const [alatRequests, setAlatRequests] = useState<Borrowing[]>([]);
  const [gedungRequests, setGedungRequests] = useState<GedungBorrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);

  /* =======================
     FETCH ALAT
  ======================= */
  const fetchAlatRequests = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/borrowings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAlatRequests(Array.isArray(data.data) ? data.data : []);
    } catch {
      setAlatRequests([]);
    }
  };

  /* =======================
     FETCH GEDUNG
  ======================= */
  const fetchGedungRequests = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/room-borrowings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setGedungRequests(Array.isArray(data.data) ? data.data : []);
    } catch {
      setGedungRequests([]);
    }
  };

  /* =======================
     VERIFIKASI ALAT
  ======================= */
  const handleAlatVerifikasi = async (id: number, status: string) => {
    if (!token) return;
    setVerifyingId(id);

    try {
      await fetch(`http://localhost:5000/api/borrowings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      setAlatRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, status } : r))
      );
    } finally {
      setVerifyingId(null);
    }
  };

  const handleAlatReturnVerification = async (id: number) => {
    if (!token) return;
    setVerifyingId(id);

    try {
      await fetch(`http://localhost:5000/api/borrowings/${id}/return`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlatRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, status: "RETURNED" } : r))
      );
    } finally {
      setVerifyingId(null);
    }
  };

  /* =======================
     VERIFIKASI GEDUNG
  ======================= */
  const handleGedungVerifikasi = async (id: number, status: string) => {
    if (!token) return;
    setVerifyingId(id);

    try {
      await fetch(`http://localhost:5000/api/room-borrowings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      setGedungRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, status } : r))
      );
    } finally {
      setVerifyingId(null);
    }
  };

  const handleGedungReturnVerification = async (id: number) => {
    if (!token) return;
    setVerifyingId(id);

    try {
      await fetch(`http://localhost:5000/api/room-borrowings/${id}/return`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      setGedungRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, status: "RETURNED" } : r))
      );
    } finally {
      setVerifyingId(null);
    }
  };

  useEffect(() => {
    if (token) {
      setLoading(true);
      Promise.all([fetchAlatRequests(), fetchGedungRequests()]).finally(() =>
        setLoading(false)
      );
    }
  }, [token]);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />

      <main className="flex-1 ml-[272px] pt-20 pb-10 px-10 overflow-y-auto space-y-12">
        {/* ================= TABEL ALAT ================= */}
        <section>
          <h2 className="font-semibold mb-3 text-[#289c93]">
            Verifikasi Peminjaman Alat
          </h2>

          <div className="overflow-x-auto max-h-[60vh] border rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-[#289c93] text-white sticky top-0">
                <tr>
                  <th className="px-4 py-2">Peminjam</th>
                  <th className="px-4 py-2">Alat</th>
                  <th className="px-4 py-2">Jumlah</th>
                  <th className="px-4 py-2">Pinjam</th>
                  <th className="px-4 py-2">Kembali</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {alatRequests.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">{item.User?.name}</td>
                    <td className="px-4 py-2">
                      {item.items.map(i => i.Equipment.name).join(", ")}
                    </td>
                    <td className="px-4 py-2">
                      {item.items.map(i => i.quantity).join(", ")}
                    </td>
                    <td className="px-4 py-2">{item.borrowDate}</td>
                    <td className="px-4 py-2">{item.returnDate}</td>
                    <td className="px-4 py-2 font-semibold">{item.status}</td>
                    <td className="px-4 py-2 space-x-2">
                      {item.status === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              handleAlatVerifikasi(item.id, "APPROVED")
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() =>
                              handleAlatVerifikasi(item.id, "REJECTED")
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      {item.status === "APPROVED" && (
                        <button
                          onClick={() =>
                            handleAlatReturnVerification(item.id)
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Verifikasi Pengembalian
                        </button>
                      )}
                      {item.status === "RETURNED" && (
                        <span className="text-gray-600 font-semibold">
                          Selesai
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= TABEL GEDUNG ================= */}
        <section>
          <h2 className="font-semibold mb-3 text-[#289c93]">
            Verifikasi Peminjaman Gedung
          </h2>

          <div className="overflow-x-auto max-h-[60vh] border rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-[#289c93] text-white sticky top-0">
                <tr>
                  <th className="px-4 py-2">Peminjam</th>
                  <th className="px-4 py-2">Gedung</th>
                  <th className="px-4 py-2">Kegiatan</th>
                  <th className="px-4 py-2">Jam Mulai</th>
                  <th className="px-4 py-2">Jam Selesai</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {gedungRequests.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">{item.User?.name}</td>
                    <td className="px-4 py-2">{item.namaRuangan}</td>
                    <td className="px-4 py-2">{item.kegiatan}</td>
                    <td className="px-4 py-2">{item.jamMulai}</td>
                    <td className="px-4 py-2">{item.jamSelesai}</td>
                    <td className="px-4 py-2 font-semibold">{item.status}</td>
                    <td className="px-4 py-2 space-x-2">
                      {item.status === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              handleGedungVerifikasi(item.id, "APPROVED")
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() =>
                              handleGedungVerifikasi(item.id, "REJECTED")
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Tolak
                          </button>
                        </>
                      )}
                      {item.status === "APPROVED" && (
                        <button
                          onClick={() =>
                            handleGedungReturnVerification(item.id)
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Verifikasi Pengembalian
                        </button>
                      )}
                      {item.status === "RETURNED" && (
                        <span className="text-gray-600 font-semibold">
                          Selesai
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
