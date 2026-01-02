"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RoomPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buildingQuery = searchParams.get("building");

  const { user, loading } = useAuth();

  const [roomList, setRoomList] = useState<any[]>([]);
  const [buildings, setBuildings] = useState<any[]>([]);
  const [buildingTerpilih, setBuildingTerpilih] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    fetchRooms();
    fetchBuildings();
  }, []);

  useEffect(() => {
    if (buildingQuery) setBuildingTerpilih(parseInt(buildingQuery));
  }, [buildingQuery]);

  const fetchBuildings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/buildings");
      const json = await res.json();
      const data = json.data ?? [];
      setBuildings(Array.isArray(data) ? data : []);
      console.log("Buildings:", data);
    } catch (err) {
      console.error("Gagal mengambil data gedung:", err);
      setBuildings([]);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/rooms");
      const json = await res.json();
      const data = json.data ?? [];
      setRoomList(Array.isArray(data) ? data : []);
      console.log("Rooms:", data);
    } catch (err) {
      console.error("Gagal mengambil data ruangan:", err);
      setRoomList([]);
    }
  };

  const roomTerfilter = buildingTerpilih
    ? roomList.filter((room) => room.buildingId === buildingTerpilih)
    : [];

  if (loading) return <p className="p-10">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 ml-[272px] pt-10 pb-24 bg-white overflow-y-auto">
          <div className="p-10">
            <h1 className="text-3xl font-bold text-[#289c93] mb-4">
              {buildingTerpilih
                ? `${buildings.find((b) => b.id === buildingTerpilih)?.name}`
                : "Pilih Gedung"}
            </h1>

            {/* Tampilan Gedung */}
            {!buildingTerpilih && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {buildings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setBuildingTerpilih(b.id)}
                    className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-6 cursor-pointer text-center"
                  >
                    {/* Container gambar tetap, card tidak membesar */}
                    <div className="w-full h-40 relative mb-3">
                      <Image
                        src={
                          b.image && b.image.trim() !== ""
                            ? `http://localhost:5000${b.image}`
                            : "/default-building.png"
                        }
                        alt={b.name}
                        fill
                        className="object-contain rounded-xl"
                      />
                    </div>
                    <h2 className="text-lg font-semibold text-[#289c93]">{b.name}</h2>
                  </div>
                ))}
                {buildings.length === 0 && (
                  <p className="text-gray-500 col-span-full">
                    Belum ada gedung tersedia.
                  </p>
                )}
              </div>
            )}

            {/* Tampilan Ruangan */}
            {buildingTerpilih && (
              <div>
                <button
                  onClick={() => {
                    setBuildingTerpilih(null);
                    router.push("/ruangan");
                  }}
                  className="mt-1 mb-5 px-4 py-2 rounded bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition-colors"
                >
                  ← Kembali ke Gedung
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roomTerfilter.map((room) => (
                    <Link key={room.id} href={`/ruangan/${room.id}`}>
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-6 cursor-pointer">
                        <div className="w-full h-40 relative mb-4">
                          <Image
                            src={
                              room.image
                                ? `http://localhost:5000/${room.image.replace(/^\/?/, "")}`
                                : "/default-room.png"
                            }
                            alt={room.name}
                            fill
                            className="object-contain rounded-xl"
                          />
                        </div>
                        <h2 className="text-xl font-semibold text-[#289c93]">{room.name}</h2>
                        <p className="text-black mt-2 text-sm">{room.description}</p>
                        <p className="mt-1 text-sm text-green-600">
                          Kapasitas: {room.capacity} | {room.available ? "Tersedia" : "Tidak"}
                        </p>
                      </div>
                    </Link>
                  ))}
                  {roomTerfilter.length === 0 && (
                    <p className="text-gray-500 col-span-full">
                      Belum ada ruangan untuk gedung ini.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
