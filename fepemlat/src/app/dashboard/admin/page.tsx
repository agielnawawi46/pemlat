"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SidebarAdmin from "@/components/SidebarAdmin";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function DashboardAdminPage() {
  const { token, user } = useAuth();

  const [totalAlat, setTotalAlat] = useState(0);
  const [totalRuangan, setTotalRuangan] = useState(0);
  const [peminjamanAktif, setPeminjamanAktif] = useState(0);

  // Fetch total alat
  const fetchAlat = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/equipment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];
      setTotalAlat(data.length);
    } catch {
      setTotalAlat(0);
    }
  };

  // Fetch total ruangan
  const fetchRuangan = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];
      setTotalRuangan(data.length);
    } catch {
      setTotalRuangan(0);
    }
  };

  // Fetch peminjaman aktif
 interface BorrowingLite {
  status?: string;
}

const fetchBorrowings = async () => {
  if (!token) return;

  try {
    const [alatRes, ruanganRes] = await Promise.all([
      fetch("http://localhost:5000/api/borrowings", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5000/api/room-borrowings", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const alatJson = await alatRes.json();
    const ruanganJson = await ruanganRes.json();

    const alatData: BorrowingLite[] = Array.isArray(alatJson.data) ? alatJson.data : [];
    const ruanganData: BorrowingLite[] = Array.isArray(ruanganJson.data) ? ruanganJson.data : [];

    const aktifCount =
      alatData.filter((r: BorrowingLite) => r.status === "APPROVED").length +
      ruanganData.filter((r: BorrowingLite) => r.status === "APPROVED").length;

    setPeminjamanAktif(aktifCount);
  } catch (e) {
    console.error("Error fetchBorrowings:", e);
    setPeminjamanAktif(0);
  }
};
  useEffect(() => {
    if (token) {
      fetchAlat();
      fetchRuangan();
      fetchBorrowings();
    }
  }, [token]);

  return (
    <div className="flex flex-col min-h-screen relative text-black">
      {/* Background tetap ada */}
      <Image
        src="/images/bg2.png"
        alt="Dashboard Background"
        fill
        className="object-cover opacity-90 -z-10"
      />

      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <SidebarAdmin />

        <main className="flex-1 ml-[272px] flex flex-col">
          <div className="flex-1 overflow-y-auto pt-10">
            <div className="p-10">
              {/* Selamat Datang */}
              <h1 className="text-4xl font-bold text-white drop-shadow-sm">
                Selamat Datang, {user?.name}
              </h1>

              {/* ===== CARD SUMMARY ===== */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {/* Total Alat */}
                <div className="bg-white/90 rounded-xl shadow p-6">
                  <h2 className="text-xl font-semibold text-[#299d94]">
                    Total Alat
                  </h2>
                  <p className="text-3xl font-bold">{totalAlat}</p>
                </div>

                {/* Total Ruangan */}
                <div className="bg-white/90 rounded-xl shadow p-6">
                  <h2 className="text-xl font-semibold text-[#299d94]">
                    Total Ruangan
                  </h2>
                  <p className="text-3xl font-bold">{totalRuangan}</p>
                </div>

                {/* Peminjaman Aktif */}
                <div className="bg-white/90 rounded-xl shadow p-6">
                  <h2 className="text-xl font-semibold text-[#299d94]">
                    Peminjaman Aktif
                  </h2>
                  <p className="text-3xl font-bold">{peminjamanAktif}</p>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}