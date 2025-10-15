"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState } from "react";

export default function RuanganPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const rooms = [
    { id: 1, name: "Ruang Multimedia", desc: "Dilengkapi dengan LCD projector, speaker, dan komputer untuk presentasi.", image: "/images/room1.png" },
    { id: 2, name: "Ruang Laboratorium Komputer", desc: "Berisi perangkat komputer dan jaringan untuk kegiatan praktikum.", image: "/images/room2.png" },
    { id: 3, name: "Ruang Rapat Dosen", desc: "Digunakan untuk pertemuan staf dan dosen dengan fasilitas AC dan proyektor.", image: "/images/room3.png" },
    { id: 4, name: "Ruang Praktikum Elektronika", desc: "Berisi alat pengukuran dan eksperimen kelistrikan.", image: "/images/room4.png" },
    // tambahkan banyak item untuk testing scroll
    ...Array.from({ length: 20 }).map((_, i) => ({
      id: 100 + i,
      name: `Ruang Tambahan ${i + 1}`,
      desc: "Testing panjang konten untuk memastikan scroll bekerja.",
      image: "/images/room1.png",
    })),
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Wrapper: tambahkan min-h-0 supaya anak yang overflow dapat scroll */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar (fixed dalam komponennya) */}
        <Sidebar />

        {/* Main content: margin kiri untuk sidebar, padding top untuk navbar, pb untuk footer */}
        <main className="flex-1 ml-[272px] pt-14 pb-24 bg-white overflow-y-auto min-h-0">
          <div className="p-10">
            <h1 className="text-3xl font-bold text-[#289c93] mb-8">Daftar Ruangan</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room.name)}
                  className="cursor-pointer bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-6"
                >
                  <div className="w-full h-40 relative mb-4">
                    <Image src={room.image} alt={room.name} fill className="object-contain" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#289c93]">{room.name}</h2>
                  <p className="text-gray-700 mt-2 text-sm">{room.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Footer (pindahkan di luar main) */}
      <Footer />
    </div>
  );
}
