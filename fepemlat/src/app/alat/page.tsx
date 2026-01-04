"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AlatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kategoriQuery = searchParams.get("kategori");

  const { user, loading } = useAuth();
  const [alatList, setAlatList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [kategoriTerpilih, setKategoriTerpilih] = useState<number | null>(null);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchActive, setSearchActive] = useState(false);

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

  const alatAvailable = useMemo(
    () => alatList.filter((a) => a?.available),
    [alatList]
  );

  const alatBase = useMemo(() => {
    if (kategoriTerpilih == null) return alatAvailable;
    return alatAvailable.filter(
      (a) => Number(a?.categoryId) === Number(kategoriTerpilih)
    );
  }, [alatAvailable, kategoriTerpilih]);

  const alatFinal = useMemo(() => {
    if (!searchActive) return alatBase;
    const kw = searchKeyword.trim().toLowerCase();
    if (!kw) return alatBase;
    return alatBase.filter(
      (a) =>
        a?.name?.toLowerCase().includes(kw) ||
        a?.description?.toLowerCase().includes(kw)
    );
  }, [alatBase, searchActive, searchKeyword]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchActive(Boolean(searchKeyword.trim()));
  };

  const resetSearch = () => {
    setSearchKeyword("");
    setSearchActive(false);
  };

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        {/* ⬇️ PERUBAHAN HANYA DI SINI (hapus overflow-y-auto) */}
        <main className="flex-1 ml-[272px] pt-10 pb-24 bg-white">
          <div className="p-10">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-[#289c93]">
                {kategoriTerpilih != null
                  ? `${categories.find((c) => c.id === kategoriTerpilih)?.name}`
                  : searchActive
                  ? "Hasil Pencarian"
                  : "Pilih Kategori"}
              </h1>

              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Cari alat..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="px-4 py-2 w-64 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#289c93]"
                />
                {searchActive && (
                  <button
                    type="button"
                    onClick={resetSearch}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Reset
                  </button>
                )}
              </form>
            </div>

            {kategoriTerpilih == null && !searchActive && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setKategoriTerpilih(cat.id);
                      setSearchActive(false);
                    }}
                    className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-6 cursor-pointer text-center"
                  >
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
                    <h2 className="text-lg font-semibold text-[#289c93]">
                      {cat.name}
                    </h2>
                  </div>
                ))}
              </div>
            )}

            {(kategoriTerpilih != null || searchActive) && (
              <div>
                {kategoriTerpilih != null && (
                  <button
                    onClick={() => setKategoriTerpilih(null)}
                    className="mt-1 mb-5 px-4 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300"
                  >
                    ← Kembali ke Kategori
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alatFinal.map((alat) => (
                    <Link key={alat.id} href={`/alat/${alat.id}`}>
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-6">
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
                        <h2 className="text-xl font-semibold text-[#289c93]">
                          {alat.name}
                        </h2>
                        <p className="text-black mt-2 text-sm">
                          {alat.description}
                        </p>
                        <p className="mt-1 text-sm text-green-600">
                          Stok: {alat.stock} |{" "}
                          {alat.available ? "Tersedia" : "Tidak"}
                        </p>
                      </div>
                    </Link>
                  ))}
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
