const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // kamu tadi pakai backend di 3001

// 🔹 PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 🔹 Middleware umum
app.use(cors());
app.use(express.json());

// 🔹 Middleware untuk menyajikan gambar (static files)
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

// 🔹 Import routes
const authRoutes = require("./src/routes/authRoutes");
const equipmentRoutes = require("./src/routes/equipmentRoutes");
const roomRoutes = require("./src/routes/roomRoutes");
const borrowRoutes = require("./src/routes/borrowRoutes");
const tutorialRoutes = require("./src/routes/tutorialRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");

// 🔹 Gunakan routes
app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/tutorials", tutorialRoutes);
app.use("/api/categories", categoryRoutes);

// 🔹 Route default
app.get("/", (req, res) => {
  res.send("🚀 Backend bepemlat berjalan dengan baik!");
});

// 🔹 Route tes koneksi database
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Koneksi database berhasil 🎉",
      server_time: result.rows[0].now,
    });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Gagal koneksi database" });
  }
});

// 🔹 Fallback 404 JSON
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" });
});

// 🔹 Jalankan server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
