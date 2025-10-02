"use client";

export default function Footer() {
  return (
    <footer className="w-full h-14 bg-gray-200 flex items-center justify-center text-sm text-gray-700">
      © {new Date().getFullYear()} Sistem Peminjaman Alat Kampus
    </footer>
  );
}