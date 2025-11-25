"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function KelolaAlat() {
  const [alatList, setAlatList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState<{
    nama: string;
    kategori: string;
    deskripsi: string;
    stok: string;
    gambar: File | string | null;
    tersedia: boolean;
  }>({
    nama: "",
    kategori: "",
    deskripsi: "",
    stok: "",
    gambar: null,
    tersedia: true,
  });

  const [kategoriBaru, setKategoriBaru] = useState("");
  const [kategoriGambar, setKategoriGambar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [kategoriError, setKategoriError] = useState("");
  const [editingAlat, setEditingAlat] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showKategoriForm, setShowKategoriForm] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/equipment");
      const data = await res.json();
      setAlatList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal memuat kategori:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    if (type === "file" && files?.[0]) {
      setFormData((prev) => ({ ...prev, gambar: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.nama);
    form.append("category", formData.kategori);
    form.append("description", formData.deskripsi);
    form.append("stock", formData.stok);
    form.append("available", formData.tersedia.toString());
    if (formData.gambar instanceof File) {
      form.append("image", formData.gambar);
    }

    const method = editingAlat ? "PUT" : "POST";
    const url = editingAlat
      ? `http://localhost:3001/api/equipment/${editingAlat.id}`
      : "http://localhost:3001/api/equipment";

    try {
      const res = await fetch(url, { method, body: form });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menyimpan data");

      setShowForm(false);
      setEditingAlat(null);
      setFormData({
        nama: "",
        kategori: "",
        deskripsi: "",
        stok: "",
        gambar: null,
        tersedia: true,
      });
      fetchData();
    } catch (err) {
      console.error("Gagal menyimpan:", err);
    }
  };

  const handleEdit = (alat: any) => {
    setEditingAlat(alat);
    setFormData({
      nama: alat.name,
      kategori: alat.category,
      deskripsi: alat.description,
      stok: alat.stock?.toString() || "",
      gambar: alat.image || null,
      tersedia: alat.available,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus alat ini?")) return;
    try {
      await fetch(`http://localhost:3001/api/equipment/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Gagal menghapus data:", err);
    }
  };

  const handleDeleteKategori = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      await fetch(`http://localhost:3001/api/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err) {
      console.error("Gagal hapus kategori:", err);
    }
  };

  const handleSubmitKategori = async (e: React.FormEvent) => {
    e.preventDefault();
    setKategoriError("");

    if (categories.some((cat) => cat.name.toLowerCase() === kategoriBaru.toLowerCase())) {
      setKategoriError("Kategori dengan nama ini sudah ada.");
      return;
    }

    const form = new FormData();
    form.append("name", kategoriBaru);
    if (kategoriGambar instanceof File) {
      form.append("image", kategoriGambar);
    }

    try {
      const res = await fetch("http://localhost:3001/api/categories", {
        method: "POST",
        body: form,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menambahkan kategori");

      setKategoriBaru("");
      setKategoriGambar(null);
      setPreviewUrl(null);
      setShowKategoriForm(false);
      fetchCategories();
    } catch (err: any) {
      setKategoriError(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <div className="flex flex-1">
        <main className="flex-1 pt-14 pb-24 px-10 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Kelola Alat</h1>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingAlat(null);
                  setFormData({
                    nama: "",
                    kategori: "",
                    deskripsi: "",
                    stok: "",
                    gambar: null,
                    tersedia: true,
                  });
                  setShowForm(true);
                }}
                className="bg-[#299d94] text-white px-4 py-2 rounded-lg hover:bg-[#238a83] shadow"
              >
                + Tambah Alat
              </button>
              <button
                onClick={() => setShowKategoriForm(true)}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 shadow"
              >
                + Tambah Kategori
              </button>
            </div>
          </div>

          {/* Tabel alat */}
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100 overflow-x-auto">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th className="p-3 text-left">No</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Kategori</th>
                  <th className="p-3 text-left">Stok</th>
                  <th className="p-3 text-left">Tersedia</th>
                  <th className="p-3 text-left">Gambar</th>
                  <th className="p-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {alatList.map((alat, i) => (
                  <tr key={alat.id} className="border-t hover:bg-gray-100">
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3 font-medium">{alat.name}</td>
                    <td className="p-3">{alat.category}</td>
                    <td className="p-3">{alat.stock}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          alat.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {alat.available ? "Tersedia" : "Tidak"}
                      </span>
                    </td>
                                        <td className="p-3">
                      {alat.image && (
                        <img
                          src={
                            alat.image.startsWith("http")
                              ? alat.image
                              : `http://localhost:3001${alat.image}`
                          }
                          alt={alat.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                      )}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(alat)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(alat.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Popup Tambah/Edit Alat */}
          {showForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-96">
                <h2 className="text-xl font-semibold mb-4 text-[#299d94]">
                  {editingAlat ? "Edit Alat" : "Tambah Alat"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    name="nama"
                    placeholder="Nama alat"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <textarea
                    name="deskripsi"
                    placeholder="Deskripsi"
                    value={formData.deskripsi}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="number"
                    name="stok"
                    placeholder="Stok"
                    value={formData.stok}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="file"
                    name="gambar"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="tersedia"
                      checked={formData.tersedia}
                      onChange={handleChange}
                    />
                    <label>Tersedia</label>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-[#299d94] text-white rounded hover:bg-[#238a83]"
                    >
                      {editingAlat ? "Simpan Perubahan" : "Tambah"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Popup Tambah Kategori */}
          {showKategoriForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-80 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-indigo-600">Tambah Kategori</h2>
                <form onSubmit={handleSubmitKategori} className="space-y-3">
                  <input
                    type="text"
                    value={kategoriBaru}
                    onChange={(e) => setKategoriBaru(e.target.value)}
                    placeholder="Nama kategori"
                    className="w-full border p-2 rounded"
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setKategoriGambar(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      }
                    }}
                    className="w-full border p-2 rounded"
                  />
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-32 object-contain border rounded"
                    />
                  )}
                  {kategoriError && (
                    <p className="text-red-600 text-sm">{kategoriError}</p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowKategoriForm(false);
                        setKategoriBaru("");
                        setKategoriGambar(null);
                        setPreviewUrl(null);
                        setKategoriError("");
                      }}
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Tutup
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    >
                      Simpan
                    </button>
                  </div>
                </form>

                <hr className="my-4" />
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Kategori Tersedia</h3>
                <ul className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded"
                    >
                      <span>{cat.name}</span>
                      <button
                        onClick={() => {
                          if (confirm(`Yakin ingin menghapus kategori "${cat.name}"?`)) {
                            handleDeleteKategori(cat.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Hapus
                      </button>
                    </li>
                  ))}
                  {categories.length === 0 && (
                    <li className="text-gray-500 text-sm text-center">Belum ada kategori.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}