"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function KelolaRuangan() {
  const [roomList, setRoomList] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showGedungForm, setShowGedungForm] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    gedung: "",
    kapasitas: "",
    deskripsi: "",
    gambar: null as File | string | null,
    tersedia: true, // ✅ default tersedia
  });

  const [gedungBaru, setGedungBaru] = useState("");
  const [gedungGambar, setGedungGambar] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [gedungError, setGedungError] = useState("");

  const api = "http://localhost:5000/api";

  const fetchData = async (endpoint: string, setter: any) => {
    try {
      const res = await fetch(`${api}/${endpoint}`);
      const json = await res.json();
      const data = Array.isArray(json) ? json : json.data;
      setter(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat:", endpoint, err);
      setter([]);
    }
  };

  useEffect(() => {
    fetchData("rooms", setRoomList);
    fetchData("buildings", setBuildings);
  }, []);

  const resetForm = () =>
    setFormData({
      nama: "",
      gedung: "",
      kapasitas: "",
      deskripsi: "",
      gambar: null,
      tersedia: true,
    });

  const handleChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.nama);
    form.append("buildingId", formData.gedung);
    form.append("capacity", formData.kapasitas || "0"); // fallback 0
    form.append("description", formData.deskripsi || "");
    form.append("available", formData.tersedia ? "true" : "false");
    if (formData.gambar instanceof File) form.append("image", formData.gambar);

    const method = editingRoom ? "PUT" : "POST";
    const url = editingRoom
      ? `${api}/rooms/${editingRoom.id}`
      : `${api}/rooms`;

    const res = await fetch(url, { method, body: form });
    const result = await res.json();
    if (!res.ok) return alert(result.error || "Gagal menyimpan");

    setShowForm(false);
    setEditingRoom(null);
    resetForm();
    fetchData("rooms", setRoomList);
  };

  const handleEdit = (room: any) => {
    setEditingRoom(room);
    setFormData({
      nama: room.name || "",
      gedung: room.buildingId || "",
      kapasitas: room.capacity?.toString() || "",
      deskripsi: room.description || "",
      gambar: null,
      tersedia: room.available ?? true,
    });
    setShowForm(true);
  };

  const remove = async (id: number, endpoint: string, refresh: any) => {
    if (!confirm("Yakin ingin menghapus?")) return;
    await fetch(`${api}/${endpoint}/${id}`, { method: "DELETE" });
    refresh();
  };

  const handleSubmitGedung = async (e: any) => {
    e.preventDefault();
    setGedungError("");

    if (buildings.some((b) => b.name.toLowerCase() === gedungBaru.toLowerCase()))
      return setGedungError("Gedung sudah ada");

    const form = new FormData();
    form.append("name", gedungBaru);
    if (gedungGambar) form.append("image", gedungGambar);

    const res = await fetch(`${api}/buildings`, { method: "POST", body: form });
    const result = await res.json();
    if (!res.ok) return setGedungError(result.error || "Gagal");

    setGedungBaru("");
    setGedungGambar(null);
    setPreviewUrl(null);
    setShowGedungForm(false);

    fetchData("buildings", setBuildings);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-1 pt-20 pb-24 px-10">
        {/* Header */}
        <div className="flex justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Kelola Ruangan</h1>
          <div className="flex gap-2">
            <button
              onClick={() => { resetForm(); setEditingRoom(null); setShowForm(true); }}
              className="bg-[#299d94] text-white px-4 py-2 rounded-lg"
            >
              + Tambah Ruangan
            </button>
            <button
              onClick={() => setShowGedungForm(true)}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg"
            >
              + Tambah Gedung
            </button>
          </div>
        </div>

        {/* Tabel Ruangan */}
        <div className="text-gray-700 rounded-xl shadow p-6 border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                {["No", "Nama", "Gedung", "Kapasitas", "Tersedia", "Gambar", "Aksi"].map((h) => (
                  <th key={h} className="p-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roomList.map((room, i) => (
                <tr key={room.id} className="border-t hover:bg-gray-100">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3 font-medium">{room.name}</td>
                  <td className="p-3">{room.building?.name || "-"}</td>
                  <td className="p-3">{room.capacity || "-"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${room.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {room.available ? "Tersedia" : "Tidak"}
                    </span>
                  </td>
                  <td className="p-3">
                    {(room.image || room.imageUrl) ? (
                      <img
                        src={(room.image || room.imageUrl).startsWith("http") ? room.image || room.imageUrl : `http://localhost:5000${room.image || room.imageUrl}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : "-"}
                  </td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleEdit(room)} className="px-3 py-1 bg-yellow-500 text-white rounded">
                      Edit
                    </button>
                    <button
                      onClick={() => remove(room.id, "rooms", () => fetchData("rooms", setRoomList))}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {roomList.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
                    Belum ada ruangan ditambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Popup Tambah/Edit Ruangan */}
        {showForm && (
          <Popup title={editingRoom ? "Edit Ruangan" : "Tambah Ruangan"} onClose={() => setShowForm(false)}>
            <form onSubmit={handleSubmit} className="space-y-3 text-gray-400">
              <Input name="nama" type="text" value={formData.nama || ""} onChange={handleChange} placeholder="Nama ruangan" required />
              <Select name="gedung" value={formData.gedung || ""} onChange={handleChange} options={buildings} />
              <Input name="kapasitas" type="number" value={formData.kapasitas || ""} onChange={handleChange} placeholder="Kapasitas" required />
              <textarea name="deskripsi" value={formData.deskripsi || ""} onChange={handleChange} placeholder="Deskripsi" className="w-full border p-2 rounded text-gray-400" required />
              <div className="flex gap-2 items-center">
                <input type="checkbox" name="tersedia" checked={formData.tersedia ?? true} onChange={handleChange} />
                <label>Tersedia</label>
              </div>
              <input type="file" name="gambar" onChange={handleChange} />
              <ButtonSubmit label={editingRoom ? "Simpan Perubahan" : "Tambah"} />
            </form>
          </Popup>
        )}

        {/* Popup Tambah Gedung */}
        {showGedungForm && (
          <Popup title="Tambah Gedung" onClose={() => setShowGedungForm(false)}>
            <form onSubmit={handleSubmitGedung} className="space-y-3 text-gray-700">
              <Input value={gedungBaru} onChange={(e: any) => setGedungBaru(e.target.value)} placeholder="Nama gedung" required />
              <input type="file" name="image" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) { setGedungGambar(file); setPreviewUrl(URL.createObjectURL(file)); }
              }} className="w-full border border-gray-400 rounded px-3 py-2 text-gray-700" />
              {previewUrl && <img src={previewUrl} className="h-32 object-contain" />}
              {gedungError && <p className="text-red-600 text-sm">{gedungError}</p>}
              <ButtonSubmit label="Simpan" />
            </form>
            <hr className="my-3" />
            <ul className="space-y-2">
              {buildings.map((b) => (
                <li key={b.id} className="flex items-center justify-between border border-gray-200 rounded px-3 py-2 mb-2">
                  <span className="text-gray-400">{b.name}</span>
                  <button className="text-red-600 text-xs" onClick={() => remove(b.id, "buildings", () => fetchData("buildings", setBuildings))}>Hapus</button>
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

/* ------------------ COMPONENT REUSABLE ------------------ */
const Popup = ({ title, children, onClose }: any) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-[#289c93] mb-4">{title}</h2>
      {children}
      <button onClick={onClose} className="mt-3 px-3 py-1 bg-gray-700 text-white rounded w-full">Tutup</button>
    </div>
  </div>
);

const Input = (props: any) => <input {...props} className="w-full border p-2 rounded text-gray-700" />;
const Select = ({ name, value, onChange, options }: any) => (
  <select name={name} value={value || ""} onChange={onChange} className="w-full border p-2 rounded text-gray-400">
    <option value="" className="text-gray-400">Pilih gedung</option>
    {options.map((o: any) => <option key={o.id} value={o.id} className="text-gray-400">{o.name}</option>)}
  </select>
);
const ButtonSubmit = ({ label }: any) => <button type="submit" className="px-3 py-2 bg-[#299d94] w-full text-white rounded">{label}</button>;
