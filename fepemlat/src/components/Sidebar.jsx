"use client";
import Image from "next/image";
import poltek2 from "@/../public/images/poltek1.png"; // cara aman

export default function Sidebar() {
  return (
    <div className="w-[272px] h-screen bg-[#299d94] flex flex-col items-center">
      {/* Logo atas */}
      <div className="w-full h-[190px] bg-white flex items-center justify-center">
        <Image src={poltek2} alt="Poltek" width={130} height={120} />
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-6 mt-10 text-white font-medium text-xl">
        <button className="hover:underline">Dashboard</button>
        <button className="hover:underline">Alat</button>
        <button className="hover:underline">Ruangan</button>
        <button className="hover:underline">Tentang</button>
        <button className="hover:underline">Panduan</button>
      </nav>
    </div>
  );
}
