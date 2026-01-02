"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AlatDetailPage() {
  const { user, token, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };

  const [alat, setAlat] = useState<any>(null);
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");
  const [jumlah, setJumlah] = useState(1);
  const [catatan, setCatatan] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Cek login
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  const fetchAlat = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/equipment/${id}`);
      const json = await res.json();
      setAlat(json.data ?? json);
    } catch (err) {
      console.error("Gagal mengambil data alat:", err);
    }
  };

  useEffect(() => {
    fetchAlat();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Silakan login");
      router.push("/login");
      return;
    }

    if (!tanggalPinjam || !tanggalKembali) {
      alert("Tanggal wajib diisi");
      return;
    }

    if (jumlah < 1 || jumlah > alat.stock) {
      alert("Jumlah alat tidak valid");
      return;
    }

    setLoadingSubmit(true);

    try {
      const res = await fetch("http://localhost:5000/api/borrowings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          borrowDate: tanggalPinjam,
          returnDate: tanggalKembali,
          note: catatan,
          items: [{ equipmentId: alat.id, quantity: jumlah }],
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal meminjam");

      alert("Pengajuan peminjaman berhasil!");
      router.push("/dashboard/mahasiswa");
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading || !alat)
    return <p className="p-10 text-center text-gray-500">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 ml-[272px] pt-20 pb-10 px-10">
          <div className="max-w-screen-md mx-auto">
            <div className="flex flex-col md:flex-row gap-6 bg-white border rounded-xl shadow p-5">

              {/* ===== GAMBAR + TOMBOL ===== */}
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div className="w-full h-80 relative border rounded-lg overflow-hidden">
                  {alat.image ? (
                    <Image
                      src={
                        alat.image.startsWith("http")
                          ? alat.image
                          : `http://localhost:5000${alat.image}`
                      }
                      alt={alat.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Tidak ada gambar
                    </div>
                  )}
                </div>

                {/* TOMBOL DI BAWAH GAMBAR */}
                <button
                  type="submit"
                  form="form-peminjaman"
                  disabled={loadingSubmit || !alat.available || alat.stock === 0}
                  className={`w-full px-4 py-2 rounded text-white font-semibold transition-all
                  ${
                    loadingSubmit || !alat.available || alat.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#289c93] hover:bg-[#238a83]"
                  }`}
                >
                  {loadingSubmit ? "Memproses..." : "Ajukan Peminjaman"}
                </button>

                <button
                  onClick={() =>
                    router.push(`/alat?kategori=${alat.categoryId}`)
                  }
                  className="w-full px-4 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-all"
                >
                  ← Kembali ke Daftar Alat
                </button>
              </div>

              {/* ===== DETAIL & FORM ===== */}
              <div className="flex-1">
                <h1 className="text-xl font-bold text-[#289c93]">
                  {alat.name}
                </h1>

                <p className="text-black text-sm mt-1">{alat.description}</p>
                <p className="text-black text-sm mt-1">
                  Kategori: {alat.Category?.name || "-"}
                </p>
                <p className="text-black text-sm mt-1">
                  Stok: {alat.stock} |{" "}
                  <span
                    className={
                      alat.available ? "text-green-600" : "text-red-600"
                    }
                  >
                    {alat.available ? "Tersedia" : "Tidak"}
                  </span>
                </p>

                {alat.available && alat.stock > 0 ? (
                  <form
                    id="form-peminjaman"
                    onSubmit={handleSubmit}
                    className="mt-4 space-y-3 text-sm text-black"
                  >
                    <div>
                      <label className="block mb-1 font-medium">
                        Tanggal Pinjam
                      </label>
                      <input
                        type="date"
                        value={tanggalPinjam}
                        onChange={(e) => setTanggalPinjam(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        Tanggal Kembali
                      </label>
                      <input
                        type="date"
                        value={tanggalKembali}
                        onChange={(e) => setTanggalKembali(e.target.value)}
                        className="w-full border p-2 rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        Jumlah Alat
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={alat.stock}
                        value={jumlah}
                        onChange={(e) =>
                          setJumlah(Number(e.target.value))
                        }
                        className="w-full border p-2 rounded"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Maksimal {alat.stock} unit
                      </p>
                    </div>

                    <div>
                      <label className="block mb-1 font-medium">
                        Catatan (Opsional)
                      </label>
                      <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        className="w-full border p-2 rounded"
                        rows={2}
                      />
                    </div>
                  </form>
                ) : (
                  <p className="text-red-600 mt-4 font-semibold text-sm">
                    Alat ini tidak tersedia untuk dipinjam
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
