"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Mahasiswa {
  id: number;
  name: string;
  nim: string;
  email: string | null;
  prodi: string | null;
  angkatan: string | null;
  status: string;
  role: "mahasiswa" | "admin";
}

export default function ProfilePage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect ke login jika user tidak ada
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  // Fetch profile dari backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("Token tidak tersedia. Silakan login kembali.");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET", headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errText}`);
        }

        const json = await res.json();
        console.log("Response /me:", json);

        // Flatten response: backend bisa mengirim { data: user } atau { user: {...} }
        const userData: Mahasiswa | null = json.data ?? json.user ?? null;

        if (!userData) throw new Error("Profil tidak ditemukan");

        console.log("Flattened userData:", userData);
        setMahasiswa(userData);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Gagal mengambil data profil.");
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) return <p className="p-10">Loading...</p>;
  if (error) return <p className="p-10 text-red-600">{error}</p>;
  if (!mahasiswa) return <p className="p-10 text-red-600">Profil tidak ditemukan.</p>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-[272px] pt-20 pb-6 px-10">
          <div className="max-w-screen-md mx-auto mt-6">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 w-full">
              <h1 className="text-2xl font-bold text-[#299d94] mb-6">Profil Mahasiswa</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <ProfileField label="Nama Lengkap" value={mahasiswa.name} />
                <ProfileField label="NIM" value={mahasiswa.nim} />
                <ProfileField label="Program Studi" value={mahasiswa.prodi || "-"} />
                <ProfileField label="Email" value={mahasiswa.email || "-"} />
                <ProfileField label="Angkatan" value={mahasiswa.angkatan || "-"} />
                <ProfileField
                  label="Status Akademik"
                  value={mahasiswa.status}
                  valueClass="text-green-600 font-semibold"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

// Component field profil
function ProfileField({
  label,
  value,
  valueClass = "text-black font-medium",
}: {
  label: string;
  value: string | number | null;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-lg ${valueClass}`}>{value}</p>
    </div>
  );
}
