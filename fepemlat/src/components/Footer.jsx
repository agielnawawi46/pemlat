"use client";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-64 w-[calc(100%-16rem)] h-14 bg-gray-200 flex items-center justify-center text-sm text-gray-700">
       © {new Date().getFullYear()} Sistem Peminjaman Alat Kampus
    </footer>
  );
}