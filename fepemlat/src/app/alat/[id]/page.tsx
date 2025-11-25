"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function AlatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [alat, setAlat] = useState<any>(null);
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [catatan, setCatatan] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAlat = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/equipment/${id}`);
      const data = await res.json();
      setAlat(data);
    } catch (err) {
      console.error("Gagal mengambil data alat:", err);
    }
  };

  useEffect(() => {
    fetchAlat();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggalPinjam || !tanggalKembali) {
      alert("Tanggal pinjam dan kembali harus diisi!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        user_id: 1,
        user_type: "mahasiswa", // sementara hardcoded, nanti bisa diganti dari session
        item_type: "alat",
        item_id: id,
        borrow_date: tanggalPinjam,
        return_date: tanggalKembali,
        catatan,
        status: "pending"
        }),
      });

      const data = await res.json();
if (!res.ok) throw new Error(data.error || "Gagal meminjam alat");

      alert("Peminjaman berhasil!");
      router.push("/alat");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat meminjam alat.");
    } finally {
      setLoading(false);
    }
  };

  if (!alat) return <p className="p-10 text-center text-gray-500">Memuat data alat...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 ml-[272px] pt-20 pb-6 px-10">
          <div className="max-w-screen-md mx-auto mt-6">
           <div className="flex flex-col md:flex-row gap-4 bg-white border rounded-xl shadow p-4">
              {/* Gambar */}
              <div className="w-full md:w-1/2 h-90 relative border rounded-lg overflow-hidden">
                {alat.image ? (
                  <Image
                    src={
                      alat.image.startsWith("http")
                        ? alat.image
                        : `http://localhost:3001${alat.image}`
                    }
                    alt={alat.name}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Tidak ada gambar
                  </div>
                )}
              </div>

              {/* Info dan Form */}
              <div className="flex-1 h-full flex flex-col justify-between overflow-auto">
                <div>
                  <h1 className="text-xl font-bold text-[#289c93]">{alat.name}</h1>
                  <p className="text-gray-700 mt-1 text-sm">{alat.description}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Stok: {alat.stock} |{" "}
                    <span className={alat.available ? "text-green-600" : "text-red-600"}>
                      {alat.available ? "Tersedia" : "Tidak tersedia"}
                    </span>
                  </p>
                </div>

                {alat.available ? (
                  <form onSubmit={handleSubmit} className="mt-2 space-y-2 text-sm">
                    <div>
                      <label className="block mb-1 font-medium">Tanggal Pinjam</label>
                      <input
                        type="date"
                        value={tanggalPinjam}
                        onChange={(e) => setTanggalPinjam(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Tanggal Kembali</label>
                      <input
                        type="date"
                        value={tanggalKembali}
                        onChange={(e) => setTanggalKembali(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium">Catatan (Opsional)</label>
                      <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        className="w-full border p-2 rounded"
                        rows={2}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full px-4 py-2 rounded text-white ${
                        loading ? "bg-gray-400" : "bg-[#289c93] hover:bg-[#238a83]"
                      }`}
                    >
                      {loading ? "Memproses..." : "Pinjam Alat"}
                    </button>
                  </form>
                ) : (
                  <p className="text-red-600 mt-2 font-semibold text-sm">
                    Alat ini sedang tidak tersedia untuk dipinjam.
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