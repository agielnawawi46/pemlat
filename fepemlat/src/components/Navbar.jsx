"use client";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="w-full h-14 flex bg-white shadow-md px-6 items-center justify-between">
      <h1 className="font-bold text-xl text-black">INFO SCROLLING</h1>
      <div className="flex items-center gap-2">
        <span className="font-bold text-black text-base">Nama Mahasiswa</span>
        <Image
          src="/images/profil1.png"
          alt="Logo Profil"
          width={24}
          height={24}
          className="rounded-full object-cover my-1"
        />
      </div>
    </div>
  );
}
