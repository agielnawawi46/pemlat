"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    nim: "",
    email: "",
    prodi: "",
    angkatan: "",
    password: "",
    role: "mahasiswa",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validasi sesuai role
    if (form.role === "mahasiswa" && (!form.name || !form.nim || !form.password)) {
      setError("Nama, NIM, dan Password wajib diisi untuk mahasiswa");
      return;
    }
    if (form.role === "admin" && (!form.name || !form.email || !form.password)) {
      setError("Nama, Email, dan Password wajib diisi untuk admin");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registrasi gagal");

      setSuccess("Registrasi berhasil! Silakan login.");
      setForm({
        name: "",
        nim: "",
        email: "",
        prodi: "",
        angkatan: "",
        password: "",
        role: "mahasiswa",
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-[#299d94] mb-4">Registrasi</h1>

        <input
          type="text"
          name="name"
          placeholder="Nama Lengkap"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
          required
        />

        <input
          type="text"
          name="nim"
          placeholder="NIM"
          value={form.nim}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
          required={form.role === "mahasiswa"}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
          required={form.role === "admin"}
        />

        <input
          type="text"
          name="prodi"
          placeholder="Program Studi"
          value={form.prodi}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        />

        <input
          type="text"
          name="angkatan"
          placeholder="Angkatan"
          value={form.angkatan}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        >
          <option value="mahasiswa">Mahasiswa</option>
          <option value="admin">Admin</option>
        </select>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {success ? (
          <div className="space-y-2">
            <p className="text-green-600 text-sm">{success}</p>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-[#299d94] text-white py-2 rounded hover:bg-[#238a83]"
          >
            Register
          </button>
        )}
      </form>
    </div>
  );
}
