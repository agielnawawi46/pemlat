const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, nim } = req.body;

    // Validasi berdasarkan role
    if (role === "admin") {
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "Semua field wajib diisi untuk admin!" });
      }
    } else if (role === "mahasiswa") {
      if (!nim || !password || !role) {
        return res.status(400).json({ message: "Semua field wajib diisi untuk mahasiswa!" });
      }
    } else {
      return res.status(400).json({ message: "Role tidak valid!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let result;

    // Query berdasarkan role
    if (role === "admin") {
      result = await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, role`,
        [name, email, hashedPassword, role]
      );
    } else if (role === "mahasiswa") {
      result = await pool.query(
        `INSERT INTO users (nim, password, role)
         VALUES ($1, $2, $3)
         RETURNING id, nim, role`,
        [nim, hashedPassword, role]
      );
    }

    res.status(201).json({
      message: "Registrasi berhasil",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.login = async (req, res) => {
  try {
    const { nim, email, password } = req.body;

    // Bisa login pakai email atau nim
    const userQuery = nim
      ? await pool.query("SELECT * FROM users WHERE nim = $1", [nim])
      : await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    const user = userQuery.rows[0];
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Password salah" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login berhasil",
      token,
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, name, email, nim, role FROM users WHERE id = $1",
      [userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
};