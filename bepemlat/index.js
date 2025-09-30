const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());

// Route default
app.get("/", (req, res) => {
  res.send("Backend bepemlat jalan 🚀");
});

// Route tes koneksi database
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

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
