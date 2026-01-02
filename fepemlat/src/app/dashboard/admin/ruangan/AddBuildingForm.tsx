"use client";
import { useState } from "react";

export default function AddBuildingForm({ onSelesai }: { onSelesai: () => void }) {
  const [namaGedung, setNamaGedung] = useState("");
  const [gambarGedung, setGambarGedung] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGambarGedung(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const formData = new FormData();
  formData.append("name", namaGedung);

  if (gambarGedung) {
    formData.append("image", gambarGedung); // ✅ BENAR
  }

  try {
    const res = await fetch("http://localhost:5000/api/buildings", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Gagal menambahkan gedung");

    // reset form
    setNamaGedung("");
    setGambarGedung(null);
    setPreviewUrl(null);

    onSelesai();
  } catch (err: any) {
    setError(err.message || "Terjadi kesalahan");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Gedung</label>
        <input
          type="text"
          value={namaGedung}
          onChange={(e) => setNamaGedung(e.target.value)}
          className="w-full border p-2 rounded mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gambar Gedung</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border p-2 rounded mt-1"
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-40 object-contain border mt-2 rounded"
          />
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onSelesai}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}