"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import poltek2 from "@/../public/images/poltek1.png";

export default function SidebarAdmin() {
  const pathname = usePathname();

  const menus = [
    { name: "Dashboard", href: "/dashboard/admin" },
    { name: "Manajemen Alat", href: "/dashboard/admin/alat" },
    { name: "Manajemen Ruangan", href: "/dashboard/admin/ruangan" },
    { name: "Verifikasi Peminjaman", href: "/dashboard/admin/verifikasi" },
    { name: "Laporan", href: "/dashboard/admin/laporan" },
  ];

  return (
    <div className="w-[272px] h-[calc(100vh-56px)] bg-[#299d94] flex flex-col items-center shadow-lg fixed top-14 left-0 z-20">
      {/* Logo */}
      <div className="w-[230px] h-30 bg-white rounded-b-full flex items-center justify-start pl-18 mt-2 shadow-md">
        <Image
          src="/images/poltek1.png"
          alt="Logo Kampus"
          width={80}
          height={50}
          className="object-contain"
        />
      </div>

      {/* Navigasi */}
      <nav className="flex flex-col gap-2 mt-10 w-full px-6">
        {menus.map((menu) => {
          const isActive = pathname === menu.href;

          return (
            <Link key={menu.name} href={menu.href}>
              <motion.div
                whileHover={{ scale: 1.03, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-300
                  ${
                    isActive
                      ? "bg-white text-[#1f6f68] font-semibold shadow-md"
                      : "text-white hover:bg-white/20 hover:shadow-sm"
                  }`}
              >
                {menu.name}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto mb-6 text-white text-xs opacity-70">
        <p>© 2025 Admin Panel</p>
      </div>
    </div>
  );
}
