"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full h-16 flex bg-white shadow-md px-8 items-center justify-between z-50">
      {/* Judul Navbar */}
      <h1 className="font-extrabold text-2xl text-[#299d94] tracking-wide">
        INFO SCROLLING
      </h1>

      {/* Profil dan Nama */}
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-800 text-base">
          Nama Mahasiswa
        </span>

        {/* Gambar Profil */}
        <div
          className={`relative w-10 h-10 cursor-pointer transform transition-all duration-300 ${
            isHovered ? "scale-110 drop-shadow-md" : "scale-100"
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => router.push("/profile")}
        >
          <Image
            src="/images/profil1.png"
            alt="Foto Profil"
            fill
            className="object-contain bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
