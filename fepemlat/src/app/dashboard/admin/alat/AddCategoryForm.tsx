import { useState } from "react";

export default function TambahKategoriForm({ onSelesai }: { onSelesai: () => void }) {
  const [namaKategori, setNamaKategori] = useState("");
  const [gambarKategori, setGambarKategori] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGambarKategori(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData();
    form.append("name", namaKategori);
    if (gambarKategori) {
      form.append("image", gambarKategori);
    }

    try {
      const res = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        body: form,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menambahkan kategori");

      setNamaKategori("");
      setGambarKategori(null);
      setPreviewUrl(null);
      onSelesai(); // refresh daftar kategori
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Kategori</label>
        <input
          type="text"
          value={namaKategori}
          onChange={(e) => setNamaKategori(e.target.value)}
          className="w-full border p-2 rounded mt-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gambar Kategori</label>
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