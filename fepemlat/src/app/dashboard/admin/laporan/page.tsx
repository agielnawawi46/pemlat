"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SidebarAdmin from "@/components/SidebarAdmin";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BorrowingAlat {
  id: number;
  borrowDate: string;
  status: string;
}

interface BorrowingRuangan {
  id: number;
  borrowDate?: string;
  startTime: string;
  endTime: string;
  status: string;
}

export default function DashboardGrafikPage() {
  const { token, user } = useAuth(); 
  const role = user?.role; // ✅ ambil role dari user
  const [labels, setLabels] = useState<string[]>([]);
  const [dataAlat, setDataAlat] = useState<number[]>([]);
  const [dataRuangan, setDataRuangan] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchBorrowings = async (month: number, year: number) => {
  if (!token || !role) return;

  try {
    const alatRes = await fetch("http://localhost:5000/api/borrowings", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ pilih endpoint sesuai role
    const ruanganEndpoint =
      role === "admin"
        ? "http://localhost:5000/api/room-borrowings"
        : "http://localhost:5000/api/room-borrowings/my";

    const ruanganRes = await fetch(ruanganEndpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const alatJson = await alatRes.json();
    const ruanganJson = await ruanganRes.json();

    const alatData = Array.isArray(alatJson.data) ? alatJson.data : [];
    const ruanganData = Array.isArray(ruanganJson.data) ? ruanganJson.data : [];

    console.log("Data ruangan:", ruanganData); // ✅ debug

      const daysInMonth = new Date(year, month, 0).getDate();
      const days = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
      setLabels(days);

      const validStatuses = ["APPROVED", "RETURNED"];

      const alatCount = days.map((day) =>
        alatData.filter((item: BorrowingAlat) => {
          const d = new Date(item.borrowDate);
          return (
            d.getMonth() + 1 === month &&
            d.getFullYear() === year &&
            d.getDate() === parseInt(day) &&
            validStatuses.includes(item.status?.toUpperCase())
          );
        }).length
      );

      const ruanganCount = days.map((day) =>
        ruanganData.filter((item: BorrowingRuangan) => {
          const rawDate = item.borrowDate || item.startTime; // ✅ fallback
          const d = new Date(rawDate);
          if (isNaN(d.getTime())) return false;
          return (
            d.getMonth() + 1 === month &&
            d.getFullYear() === year &&
            d.getDate() === parseInt(day) &&
            validStatuses.includes(item.status?.toUpperCase())
          );
        }).length
      );

      setDataAlat(alatCount);
      setDataRuangan(ruanganCount);
    } catch (e) {
      console.error("Gagal ambil data grafik:", e);
    }
  };

  useEffect(() => {
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    fetchBorrowings(month, year);
  }, [selectedDate, token, role, refreshKey]);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Peminjaman Alat",
        data: dataAlat,
        backgroundColor: "rgba(41, 157, 148, 0.7)",
      },
      {
        label: "Peminjaman Ruangan",
        data: dataRuangan,
        backgroundColor: "rgba(249, 115, 22, 0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: `Grafik Peminjaman Bulan ${selectedDate.toLocaleString("id-ID", {
          month: "long",
          year: "numeric",
        })}`,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarAdmin />
        <main className="flex-1 ml-[272px] pt-20 pb-32 px-10">
          {/* Card Pilih Bulan & Tahun */}
          <div className="bg-white rounded-xl shadow">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                if (date) setSelectedDate(date);
              }}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="border px-3 py-2 rounded"
            />
          </div>

          {/* Grafik */}
          <div className="bg-white rounded-xl shadow mt-10">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}