"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RoomDetailPage() {
  const { user, token, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [room, setRoom] = useState<any>(null);
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Cek login
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  // Fetch detail ruangan
  const fetchRoom = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/rooms/${id}`);
      const json = await res.json();
      const data = json.data ?? json;
      setRoom(data);
    } catch (err) {
      console.error("Gagal mengambil data ruangan:", err);
    }
  };

  useEffect(() => {
    fetchRoom();
  }, [id]);

  // Submit peminjaman ruangan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    if (!jamMulai || !jamSelesai || !catatan.trim()) {
      alert("Semua field wajib diisi (jam mulai, jam selesai, catatan)");
      return;
    }

    if (jamMulai >= jamSelesai) {
      alert("Jam selesai harus lebih besar dari jam mulai");
      return;
    }

    setLoadingSubmit(true);

    try {
      const res = await fetch("http://localhost:5000/api/room-borrowings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: room.id,
          startTime: jamMulai,
          endTime: jamSelesai,
          activity: catatan.trim(),
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Gagal meminjam ruangan");

      alert("Pengajuan peminjaman ruangan berhasil!");
      router.push("/dashboard/mahasiswa");
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading || !room)
    return <p className="p-10 text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-[272px] pt-20 pb-10 px-10">
          <div className="max-w-screen-md mx-auto">
            <div className="flex flex-col md:flex-row gap-6 bg-white border rounded-xl shadow p-5">
              {/* GAMBAR */}
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div className="w-full h-80 relative border rounded-lg overflow-hidden">
                  {room.image ? (
                    <Image
                      src={
                        room.image.startsWith("http")
                          ? room.image
                          : `http://localhost:5000${room.image}`
                      }
                      alt={room.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Tidak ada gambar
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  form="form-peminjaman"
                  disabled={loadingSubmit || !room.available}
                  className={`w-full px-4 py-2 rounded text-white font-semibold transition-all ${
                    loadingSubmit || !room.available
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#289c93] hover:bg-[#238a83]"
                  }`}
                >
                  {loadingSubmit ? "Memproses..." : "Ajukan Peminjaman"}
                </button>

                <button
                  onClick={() => router.push(`/ruangan?building=${room.buildingId}`)}
                  className="w-full px-4 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all"
                >
                  ← Kembali ke Daftar Ruangan
                </button>
              </div>

              {/* DETAIL & FORM */}
              <div className="flex-1">
                <h1 className="text-xl font-bold text-[#289c93]">{room.name}</h1>
                <p className="text-black text-sm mt-1">{room.description}</p>
                <p className="text-black text-sm mt-1">
                  Kapasitas: {room.capacity} |{" "}
                  <span
                    className={room.available ? "text-green-600" : "text-red-600"}
                  >
                    {room.available ? "Tersedia" : "Tidak tersedia"}
                  </span>
                </p>

                {room.available ? (
                  <form
                    id="form-peminjaman"
                    onSubmit={handleSubmit}
                    className="mt-4 space-y-3 text-sm text-black"
                  >
                    <div>
                      <label className="block mb-1 font-medium">Jam Pinjam</label>
                      <input
                        type="time"
                        value={jamMulai}
                        onChange={(e) => setJamMulai(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Jam Selesai</label>
                      <input
                        type="time"
                        value={jamSelesai}
                        onChange={(e) => setJamSelesai(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Catatan</label>
                      <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        className="w-full border p-13 rounded"
                        rows={3}
                        required
                      />
                    </div>
                  </form>
                ) : (
                  <p className="text-red-600 mt-4 font-semibold text-sm">
                    Ruangan ini tidak tersedia untuk dipinjam
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
