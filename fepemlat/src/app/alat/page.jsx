"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";

export default function AlatPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Nanti ini diganti dengan data dari database kampus
  const categories = [
    {
      id: 1,
      name: "Electronic Equipment",
      desc: "Laptop, kamera, proyektor, hingga alat dokumentasi untuk kegiatan akademik.",
      image: "/images/electronic.png",
    },
    {
      id: 2,
      name: "Classroom Equipment",
      desc: "Fasilitas kelas seperti whiteboard, meja lipat, hingga LCD proyektor.",
      image: "/images/classroom.png",
    },
    {
      id: 3,
      name: "Laboratory Equipment",
      desc: "Alat-alat laboratorium untuk praktikum dan riset, seperti mikroskop, perangkat pengukuran.",
      image: "/images/lab.png",
    },
    // tambahan untuk uji scroll panjang
    ...Array.from({ length: 15 }).map((_, i) => ({
      id: 100 + i,
      name: `Alat Tambahan ${i + 1}`,
      desc: "Data dummy untuk memastikan halaman bisa di-scroll dengan baik.",
      image: "/images/electronic.png",
    })),
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Wrapper utama (Sidebar + Konten) */}
      <div className="flex flex-1 min-h-0">
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 ml-[272px] pt-14 pb-24 bg-white overflow-y-auto min-h-0">
          <div className="p-10">
            <h1 className="text-3xl font-bold text-[#289c93] mb-8">
              Kategori Alat
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className="cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-6"
                >
                  <div className="w-full h-40 relative mb-4">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="text-xl font-semibold text-[#289c93]">
                    {cat.name}
                  </h2>
                  <p className="text-gray-700 mt-2 text-sm">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
