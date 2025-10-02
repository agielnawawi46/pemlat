"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nim, password }), // kirim nim + password
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/items"); // pindah ke halaman daftar barang
      } else {
        alert("Login gagal! NIM atau password salah.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server.");
    }
  };

  return (
    <div className="bg-white w-full min-h-screen relative flex items-center justify-center">
      {/* Background */}
      <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        alt="Background"
        src="/images/bg1.png"
      />

      {/* Card Login */}
      <div className="relative w-[617px] h-auto bg-[#299d94] rounded-[70px] shadow-xl p-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-white font-bold text-3xl mb-4">Sign In</h1>
        <p className="text-white text-lg mb-6">
          *Gunakan Akun Learning Untuk Login
        </p>

        {/* Input NIM */}
        <input
          type="text"
          value={nim}
          onChange={(e) => setNim(e.target.value)}
          placeholder="Masukkan NIM"
          className="w-[487px] h-10 px-4 rounded-lg border border-gray-300 mb-4"
        />

        {/* Input Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan Password"
          className="w-[487px] h-10 px-4 rounded-lg border border-gray-300 mb-6"
        />

        {/* Tombol Login */}
        <button
          onClick={handleLogin}
          className="w-[194px] h-10 bg-white rounded-[20px] font-bold text-[#299d94] hover:bg-gray-200 transition"
        >
          Log in
        </button>
      </div>
    </div>
  );
}
