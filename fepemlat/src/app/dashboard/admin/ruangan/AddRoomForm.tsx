"use client";
import { useEffect, useState } from "react";

export default function AddRoomForm({ onSuccess, onCancel }: any) {
  const [nama, setNama] = useState("");
  const [gedung, setGedung] = useState("");
  const [kapasitas, setKapasitas] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/buildings")
      .then((res) => res.json())
      .then(setBuildings)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (!gedung) return setError("Gedung wajib dipilih");

    const form = new FormData();
    form.append("name", nama);
    form.append("buildingId", gedung);
    form.append("capacity", kapasitas); // hanya info kapasitas
    form.append("description", deskripsi);
    form.append("available", "true"); // ✅ selalu tersedia saat ditambahkan
    if (gambar) form.append("image", gambar);

    try {
      const res = await fetch("http://localhost:5000/api/rooms", {
        method: "POST",
        body: form,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menyimpan data");

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-red-500">{error}</p>}

      <input
        value={nama}
        onChange={(e) => setNama(e.target.value)}
        placeholder="Nama ruangan"
        required
        className="w-full border p-2 rounded"
      />

      <select
        value={gedung}
        onChange={(e) => setGedung(e.target.value)}
        required
        className="w-full border p-2 rounded"
      >
        <option value="">Pilih gedung</option>
        {buildings.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      <input
        type="number"
        value={kapasitas}
        onChange={(e) => setKapasitas(e.target.value)}
        placeholder="Kapasitas (informasi saja)"
        className="w-full border p-2 rounded"
      />

      <textarea
        value={deskripsi}
        onChange={(e) => setDeskripsi(e.target.value)}
        placeholder="Deskripsi"
        className="w-full border p-2 rounded"
      />

      <input
        type="file"
        onChange={(e) => setGambar(e.target.files?.[0] || null)}
        className="w-full border p-2 rounded"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-[#299d94] text-white rounded hover:bg-green-600"
        >
          Simpan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
