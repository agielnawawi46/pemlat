"use client";
import { useState } from "react";

export default function AddEquipmentForm({ onSuccess, onCancel }: any) {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [stok, setStok] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const form = new FormData();
    form.append("name", nama);
    form.append("category", kategori);
    form.append("description", deskripsi);
    form.append("stock", stok);
    form.append("available", "true");
    if (gambar) form.append("image", gambar);

    try {
      const res = await fetch("http://localhost:3001/api/equipment", {
        method: "POST",
        body: form,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menyimpan data");

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4">Tambah Alat</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nama alat"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Kategori"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            placeholder="Deskripsi"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Stok"
            value={stok}
            onChange={(e) => setStok(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setGambar(file);
            }}
            className="w-full border p-2 rounded"
          />
          {gambar && (
            <img
              src={URL.createObjectURL(gambar)}
              alt="Preview"
              className="w-full h-40 object-contain rounded border"
            />
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}