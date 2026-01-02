"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<"mahasiswa" | "admin">("mahasiswa");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (role === "mahasiswa" && (!nim || !password)) {
      alert("NIM dan Password wajib diisi!");
      return;
    }
    if (role === "admin" && (!email || !password)) {
      alert("Email dan Password wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const body = role === "admin" ? { role, email, password } : { role, nim, password };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok || !data.data?.token) {
        alert(data.message || "Login gagal");
        setLoading(false);
        return;
      }

      const user = data.data.user;
      const token = data.data.token;

      // SIMPAN di AuthContext & localStorage
      login(user, token);

      // Redirect sesuai role
      if (user.role === "admin") router.replace("/dashboard/admin");
      else router.replace("/dashboard/mahasiswa");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white w-full min-h-screen flex items-center justify-center relative">
      <img
        src="/images/bg1.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative w-[617px] bg-[#299d94] rounded-[70px] shadow-xl p-10 flex flex-col items-center text-center">
        <h1 className="text-white font-bold text-3xl mb-4">Login Akun</h1>
        <p className="text-white text-lg mb-6">Pilih Role Anda untuk Login</p>

        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value as "mahasiswa" | "admin");
            setNim("");
            setEmail("");
            setPassword("");
          }}
          className="w-[487px] h-10 mb-4 px-4 rounded-lg border border-gray-300 text-gray-700"
        >
          <option value="mahasiswa">Mahasiswa</option>
          <option value="admin">Admin</option>
        </select>

        {role === "mahasiswa" && (
          <input
            type="text"
            placeholder="Masukkan NIM"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            className="w-[487px] h-10 px-4 rounded-lg border border-gray-300 mb-4"
          />
        )}

        {role === "admin" && (
          <input
            type="email"
            placeholder="Masukkan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[487px] h-10 px-4 rounded-lg border border-gray-300 mb-4"
          />
        )}

        <input
          type="password"
          placeholder="Masukkan Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-[487px] h-10 px-4 rounded-lg border border-gray-300 mb-6"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-[194px] h-10 bg-white rounded-[20px] font-bold text-[#299d94] hover:bg-gray-200 transition disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Log in"}
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
