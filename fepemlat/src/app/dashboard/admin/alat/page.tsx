"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function KelolaAlat() {
  const [alatList, setAlatList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingAlat, setEditingAlat] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showKategoriForm, setShowKategoriForm] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    deskripsi: "",
    stok: "",
    gambar: null as File | string | null,
    tersedia: true,
  });

  const [kategoriBaru, setKategoriBaru] = useState("");
  const [kategoriGambar, setKategoriGambar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [kategoriError, setKategoriError] = useState("");

  const api = "http://localhost:5000/api";

  const fetchData = async (endpoint: string, setter: any) => {
  try {
    const res = await fetch(`${api}/${endpoint}`);
    const json = await res.json();
    const data = json.data ?? json; // ambil json.data kalau ada
    setter(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Gagal memuat:", endpoint, err);
  }
};

  useEffect(() => {
    fetchData("equipment", setAlatList);
    fetchData("categories", setCategories);
  }, []);

  const resetForm = () =>
    setFormData({
      nama: "",
      kategori: "",
      deskripsi: "",
      stok: "",
      gambar: null,
      tersedia: true,
    });

  const handleChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries({
      name: formData.nama,
      categoryId: formData.kategori,
      description: formData.deskripsi,
      stock: formData.stok,
      available: formData.tersedia.toString(),
    }).forEach(([k, v]) => form.append(k, v as string));

    if (formData.gambar instanceof File) form.append("image", formData.gambar);

    const method = editingAlat ? "PUT" : "POST";
    const url = editingAlat
      ? `${api}/equipment/${editingAlat.id}`
      : `${api}/equipment`;

    const res = await fetch(url, { method, body: form });
    const result = await res.json();

    if (!res.ok) return alert(result.error || "Gagal menyimpan");

    setShowForm(false);
    setEditingAlat(null);
    resetForm();
    fetchData("equipment", setAlatList);
  };

  const handleEdit = (alat: any) => {
    setEditingAlat(alat);
    setFormData({
      nama: alat.name,
      kategori: alat.categoryId,
      deskripsi: alat.description,
      stok: alat.stock.toString(),
      gambar: null,
      tersedia: alat.available,
    });
    setShowForm(true);
  };

  const remove = async (id: number, endpoint: string, refresh: any) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    await fetch(`${api}/${endpoint}/${id}`, { method: "DELETE" });
    refresh();
  };

  // FIX: kategori langsung refresh setelah ditambahkan
  const handleSubmitKategori = async (e: any) => {
    e.preventDefault();
    setKategoriError("");

    if (categories.some((c) => c.name.toLowerCase() === kategoriBaru.toLowerCase()))
      return setKategoriError("Kategori sudah ada");

    const form = new FormData();
    form.append("name", kategoriBaru);
    if (kategoriGambar) form.append("image", kategoriGambar);

    try {
      const res = await fetch(`${api}/categories`, { method: "POST", body: form });
      const result = await res.json();
      if (!res.ok) return setKategoriError(result.error || "Gagal");

      // refresh kategori langsung
      await fetchData("categories", setCategories);

      // reset form dan tutup popup
      setKategoriBaru("");
      setKategoriGambar(null);
      setPreviewUrl(null);
      setShowKategoriForm(false);
    } catch (err: any) {
      setKategoriError(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1 pt-20 pb-24 px-10">
        <div className="flex justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Kelola Alat</h1>

          <div className="flex gap-2">
            <button
              onClick={() => {
                resetForm();
                setEditingAlat(null);
                setShowForm(true);
              }}
              className="bg-[#299d94] text-white px-4 py-2 rounded-lg"
            >
              + Tambah Alat
            </button>

            <button
              onClick={() => setShowKategoriForm(true)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
            >
              + Tambah Kategori
            </button>
          </div>
        </div>

        <div className="text-gray-700 rounded-xl shadow p-6 border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                {["No", "Nama", "Kategori", "Stok", "Tersedia", "Gambar", "Aksi"].map((h) => (
                  <th key={h} className="p-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alatList.map((alat, i) => (
                <tr key={alat.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium">{alat.name}</td>
                  <td className="p-3">{alat.Category?.name || "-"}</td>
                  <td className="p-3">{alat.stock}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        alat.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {alat.available ? "Tersedia" : "Tidak"}
                    </span>
                  </td>
                  <td className="p-3">
                    {alat.image ? (
                      <img
                        src={`http://localhost:5000${alat.image}`}
                        className="w-16 h-16 object-cover rounded"
                        alt={alat.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 italic">Tidak ada gambar</span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(alat)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        remove(alat.id, "equipment", () =>
                          fetchData("equipment", setAlatList)
                        )
                      }
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <Popup title={editingAlat ? "Edit Alat" : "Tambah Alat"} onClose={() => setShowForm(false)}>
            <form onSubmit={handleSubmit} className="space-y-3 text-gray-400">
              <Input name="nama" value={formData.nama} onChange={handleChange} placeholder="Nama alat" required />
              <Select name="kategori" value={formData.kategori} onChange={handleChange} options={categories} />
              <textarea
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                placeholder="Deskripsi"
                className="w-full border p-2 rounded text-gray-400"
                required
              />
              <Input name="stok" type="number" value={formData.stok} onChange={handleChange} placeholder="Stok" required />
              <input type="file" name="gambar" onChange={handleChange} />
              <div className="flex gap-2">
                <input type="checkbox" name="tersedia" checked={formData.tersedia} onChange={handleChange} />
                <label>Tersedia</label>
              </div>
              <ButtonSubmit label={editingAlat ? "Simpan Perubahan" : "Tambah"} />
            </form>
          </Popup>
        )}

        {showKategoriForm && (
          <Popup title="Tambah Kategori" onClose={() => setShowKategoriForm(false)}>
            <form onSubmit={handleSubmitKategori} className="space-y-3 text-gray-700">
              <Input
                value={kategoriBaru}
                onChange={(e: any) => setKategoriBaru(e.target.value)}
                placeholder="Nama kategori"
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
                className="w-full border border-gray-400 rounded px-3 py-2 text-gray-700"
              />
              {previewUrl && <img src={previewUrl} className="h-32 object-contain" />}
              {kategoriError && <p className="text-red-600 text-sm">{kategoriError}</p>}
              <ButtonSubmit label="Simpan" />
            </form>

            <hr className="my-3" />

            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.id} className="flex items-center justify-between border border-gray-200 rounded px-3 py-2 mb-2">
                  <span className="text-gray-400">{c.name}</span>
                  <button
                    className="text-red-600 text-xs"
                    onClick={() =>
                      remove(c.id, "categories", () =>
                        fetchData("categories", setCategories)
                      )
                    }
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
          </Popup>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ------------------------------ COMPONENT REUSABLE ------------------------------ */

const Popup = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-[#289c93] mb-4">{title}</h2>
      {children}
      <button onClick={onClose} className="mt-3 px-3 py-1 bg-gray-700 rounded w-full">
        Tutup
      </button>
    </div>
  </div>
);

const Input = (props: any) => <input {...props} className="w-full border p-2 rounded" />;

const Select = ({ name, value, onChange, options }: any) => (
  <select name={name} value={value} onChange={onChange} className="w-full border p-2 rounded text-gray-400">
    <option value="" className="text-gray-400">Pilih kategori</option>
    {options.map((o: any) => (
      <option key={o.id} value={o.id} className="text-gray-400">{o.name}</option>
    ))}
  </select>
);

const ButtonSubmit = ({ label }: any) => (
  <button type="submit" className="px-3 py-2 bg-[#299d94] w-full text-white rounded">
    {label}
  </button>
);
