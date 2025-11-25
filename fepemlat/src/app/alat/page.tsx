"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AlatPage() {
  const [alatList, setAlatList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [kategoriTerpilih, setKategoriTerpilih] = useState<string | null>(null);

  const fetchAlat = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/equipment");
      const data = await res.json();
      setAlatList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil data alat:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil kategori:", err);
    }
  };

  useEffect(() => {
    fetchAlat();
    fetchCategories();
  }, []);

  const alatTerfilter = kategoriTerpilih
    ? alatList.filter((alat) => alat.category === kategoriTerpilih)
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 ml-[272px] pt-14 pb-24 bg-white overflow-y-auto">
          <div className="p-10">
            <h1 className="text-3xl font-bold text-[#289c93] mb-8">
              {kategoriTerpilih ? `Kategori: ${kategoriTerpilih}` : "Pilih Kategori"}
            </h1>

            {/* Tombol kembali */}
            {kategoriTerpilih && (
              <button
                onClick={() => setKategoriTerpilih(null)}
                className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                ← Kembali ke Kategori
              </button>
            )}

            {/* Tampilan kategori */}
            {!kategoriTerpilih && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => setKategoriTerpilih(cat.name)}
                    className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-6 cursor-pointer text-center"
                  >
                    <div className="w-full h-24 relative mb-3">
                      <Image
                        src={
                          cat.image?.startsWith("http")
                            ? cat.image
                            : `http://localhost:3001${cat.image || "/default-kategori.png"}`
                        }
                        alt={cat.name}
                        fill
                        className="object-contain rounded"
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

            {/* Tampilan alat */}
            {kategoriTerpilih && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {alatTerfilter.map((alat) => (
                  <Link key={alat.id} href={`/alat/${alat.id}`}>
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-6 cursor-pointer">
                      <div className="w-full h-40 relative mb-4">
                        {alat.image && (
                          <Image
                            src={
                              alat.image.startsWith("http")
                                ? alat.image
                                : `http://localhost:3001${alat.image}`
                            }
                            alt={alat.name}
                            fill
                            className="object-contain rounded-xl"
                          />
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-[#289c93]">{alat.name}</h2>
                      <p className="text-gray-700 mt-2 text-sm">{alat.description}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Stok: {alat.stock} | {alat.available ? "Tersedia" : "Tidak"}
                      </p>
                    </div>
                  </Link>
                ))}
                {alatTerfilter.length === 0 && (
                  <p className="text-gray-500 col-span-full">Belum ada alat untuk kategori ini.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}