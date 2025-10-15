"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [role, setRole] = useState("mahasiswa");
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    // Validasi input
    if (role === "admin" && (!name || !email || !password)) {
      alert("Nama, email, dan password wajib diisi untuk admin!");
      return;
    }
    if (role === "mahasiswa" && (!nim || !password)) {
      alert("NIM dan password wajib diisi untuk mahasiswa!");
      return;
    }

    try {
      const body =
        role === "admin"
          ? { role, name, email, password }
          : { role, nim, password };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Registrasi berhasil! Silakan login.");
        router.push("/login");
      } else {
        alert(data.message || "Registrasi gagal!");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server!");
    }
  };

  return (
    <div className="bg-gray-100 w-full min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-[400px] flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">
          Registrasi Akun
        </h1>

        {/* Pilihan Role */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
        >
          <option value="mahasiswa">Mahasiswa</option>
          <option value="admin">Admin</option>
        </select>

        {/* Input untuk Admin */}
        {role === "admin" && (
          <>
            <input
              type="text"
              placeholder="Nama Lengkap"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
            <input
              type="email"
              placeholder="Email Aktif"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />
          </>
        )}

        {/* Input untuk Mahasiswa */}
        {role === "mahasiswa" && (
          <input
            type="text"
            placeholder="NIM"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
          />
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
        />

        <button
          onClick={handleRegister}
          className="bg-[#299d94] hover:bg-[#21877f] text-white font-bold py-2 rounded-lg transition"
        >
          Daftar
        </button>

        <p className="text-center text-sm text-gray-500 mt-2">
          Sudah punya akun?{" "}
          <span
            className="text-[#299d94] font-semibold cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login di sini
          </span>
        </p>
      </div>
    </div>
  );
}
