"use client";
import { useState, useEffect } from "react";

export default function AddEquipmentForm({ onSuccess, onCancel }: any) {
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [deskripsi, setDeskripsi] = useState("");
  const [stok, setStok] = useState("");
  const [gambar, setGambar] = useState<File | null>(null);
  const [tersedia, setTersedia] = useState(false); // ✅ tambahkan state untuk checkbox
  const [error, setError] = useState("");

  const api = "http://localhost:5000/api";

  // Ambil kategori dari API saat komponen mount
  useEffect(() => {
    fetch(`${api}/categories`)
      .then((res) => res.json())
      .then((json) => {
        const data = json.data ?? json; // ✅ ambil json.data kalau ada
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const form = new FormData();
    form.append("name", nama);
    form.append("categoryId", kategori); // kirim ID kategori
    form.append("description", deskripsi);
    form.append("stock", stok);
    form.append("available", tersedia.toString()); // ✅ kirim nilai checkbox
    if (gambar) form.append("image", gambar);

    try {
      const res = await fetch(`${api}/equipment`, {
        method: "POST",
        body: form,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menyimpan data");

      onSuccess();
      // reset form
      setNama("");
      setKategori("");
      setDeskripsi("");
      setStok("");
      setGambar(null);
      setTersedia(false); // ✅ reset checkbox
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

          {/* Dropdown kategori */}
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Pilih kategori</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

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

          {/* ✅ Checkbox tersedia */}
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={tersedia}
              onChange={(e) => setTersedia(e.target.checked)}
            />
            <label>Tersedia</label>
          </div>

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