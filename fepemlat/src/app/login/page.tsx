"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [role, setRole] = useState("mahasiswa");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (role === "mahasiswa" && (!nim || !password)) {
      alert("NIM dan Password wajib diisi untuk Mahasiswa!");
      return;
    }
    if (role === "admin" && (!email || !password)) {
      alert("Email dan Password wajib diisi untuk Admin!");
      return;
    }

    try {
      const body =
        role === "admin"
          ? { role, email, password }
          : { role, nim, password };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        // Simpan token dan role
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        // Arahkan sesuai role
        if (data.user.role === "admin") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/mahasiswa");
        }
      } else {
        alert(data.message || "Login gagal! Cek kembali data Anda.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server!");
    }
  };

  return (
    <div className="bg-white w-full min-h-screen relative flex items-center justify-center">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        alt="Background"
        src="/images/bg1.png"
      />

      <div className="relative w-[617px] bg-[#299d94] rounded-[70px] shadow-xl p-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-white font-bold text-3xl mb-4">Login Akun</h1>
        <p className="text-white text-lg mb-6">
          Pilih Role Anda untuk Login
        </p>

        {/* Pilihan Role */}
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setEmail("");
            setNim("");
            setPassword("");
          }}
          className="w-[487px] h-10 mb-4 px-4 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-teal-400 outline-none"
        >
          <option value="mahasiswa">Mahasiswa</option>
          <option value="admin">Admin</option>
        </select>

        {/* Input Khusus Mahasiswa */}
        {role === "mahasiswa" && (
          <input
            type="text"
            placeholder="Masukkan NIM"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            className="w-[487px] h-10 px-4 rounded-lg border border-gray-300 mb-4 focus:ring-2 focus:ring-teal-400 outline-none"
          />
        )}

        {/* Input Khusus Admin */}
        {role === "admin" && (
          <input
            type="email"
            placeholder="Masukkan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[487px] h-10 px-4 rounded-lg border border-gray-300 mb-4 focus:ring-2 focus:ring-teal-400 outline-none"
          />
        )}

        {/* Password */}
        <input
          type="password"
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-[487px] h-10 px-4 rounded-lg border border-gray-300 mb-6 focus:ring-2 focus:ring-teal-400 outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-[194px] h-10 bg-white rounded-[20px] font-bold text-[#299d94] hover:bg-gray-200 transition"
        >
          Log in
        </button>

        <p className="text-white text-sm mt-4">
          Belum punya akun?{" "}
          <span
            className="cursor-pointer underline"
            onClick={() => router.push("/register")}
          >
            Daftar di sini
          </span>
        </p>
      </div>
    </div>
  );
}
