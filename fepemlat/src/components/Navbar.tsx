"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-16 flex bg-white shadow-md px-6 md:px-12 items-center justify-between z-50">
      <h1 className="font-extrabold text-2xl text-[#299d94] tracking-wide">
        INFO SCROLLING
      </h1>

      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        <span className="font-semibold text-gray-800">
          {user?.name || "Pengguna"}
        </span>

        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white hover:border-[#299d94] transition"
        >
          <img
            src={user?.avatar || "/images/profil1.png"}
            alt="Profil"
            className="w-10 h-9 object-cover"
          />
        </button>

        {openDropdown && (
          <div className="absolute top-12 right-0 bg-white shadow-lg rounded-md w-56 py-3 flex flex-col z-50">
            <button
              onClick={() => { router.push("/profile"); setOpenDropdown(false); }}
              className="text-left px-5 py-3 hover:bg-gray-100 text-base text-black flex items-center gap-3"
            >
              Profil
            </button>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="text-left px-5 py-3 hover:bg-gray-100 text-base text-red-500 flex items-center gap-3"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
