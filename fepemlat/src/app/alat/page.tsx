"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // ✅ AuthContext

export default function AlatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kategoriQuery = searchParams.get("kategori");

  const { user, loading } = useAuth(); // ✅ Ambil user dan loading
  const [alatList, setAlatList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [kategoriTerpilih, setKategoriTerpilih] = useState<number | null>(null);

  // ✅ Cek login
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    fetchAlat();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (kategoriQuery) setKategoriTerpilih(parseInt(kategoriQuery));
  }, [kategoriQuery]);

  const fetchAlat = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/equipment");
      const json = await res.json();
      const data = json.data ?? [];
      setAlatList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data alat:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const json = await res.json();
      const data = json.data ?? [];
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    }
  };

  const alatTerfilter = kategoriTerpilih
    ? alatList.filter(
        (alat) =>
          Number(alat.categoryId) === Number(kategoriTerpilih) && alat.available
      )
    : alatList.filter((alat) => alat.available);

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 ml-[272px] pt-10 pb-24 bg-white overflow-y-auto">
          <div className="p-10">
            <h1 className="text-3xl font-bold text-[#289c93] mb-4">
              {kategoriTerpilih
                ? ` ${categories.find((c) => c.id === kategoriTerpilih)?.name}`
                : "Pilih Kategori"}
            </h1>

            {/* Tampilan kategori */}
            {!kategoriTerpilih && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setKategoriTerpilih(cat.id)}
                    className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-6 cursor-pointer text-center"
                  >
                    {/* Container gambar tetap, card tidak membesar */}
                    <div className="w-full h-40 relative mb-5">
                      <Image
                        src={
                          cat.image
                            ? `http://localhost:5000${cat.image}`
                            : "/default-alat.png"
                        }
                        alt={cat.name}
                        fill
                        className="object-contain rounded-xl"
                      />
                    </div>
                    <h2 className="text-lg font-semibold text-[#289c93]">{cat.name}</h2>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-gray-500 col-span-full">Belum ada kategori tersedia.</p>
                )}
              </div>
            )}

            {/* Tampilan alat dalam kategori */}
            {kategoriTerpilih && (
              <div>
                <button
                  onClick={() => {
                    setKategoriTerpilih(null);
                    router.push("/alat");
                  }}
                  className="mt-1 mb-5 px-4 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
                >
                  ← Kembali ke Kategori
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alatTerfilter.map((alat) => (
                    <Link key={alat.id} href={`/alat/${alat.id}`}>
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-6 cursor-pointer">
                        <div className="w-full h-40 relative mb-4">
                          <Image
                            src={
                              alat.image
                                ? `http://localhost:5000${alat.image}`
                                : "/default-alat.png"
                            }
                            alt={alat.name}
                            fill
                            className="object-contain rounded-xl"
                          />
                        </div>
                        <h2 className="text-xl font-semibold text-[#289c93]">{alat.name}</h2>
                        <p className="text-black mt-2 text-sm">{alat.description}</p>
                        <p className="mt-1 text-sm text-green-600">
                          Stok: {alat.stock} | {alat.available ? "Tersedia" : "Tidak"}
                        </p>
                      </div>
                    </Link>
                  ))}
                  {alatTerfilter.length === 0 && (
                    <p className="text-gray-500 col-span-full">
                      Belum ada alat untuk kategori ini.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
