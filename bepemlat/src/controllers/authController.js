// src/controller/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, nim, prodi, angkatan } = req.body;

    if (!role) return res.status(400).json({ message: "Role wajib diisi!" });
    if (role === "admin") {
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Semua field wajib diisi untuk admin!" });
      }
    } else if (role === "mahasiswa") {
      if (!name || !nim || !password) {
        return res.status(400).json({ message: "Semua field wajib diisi untuk mahasiswa!" });
      }
    } else {
      return res.status(400).json({ message: "Role tidak valid!" });
    }

    // Optional: pre-check duplicate untuk pesan lebih spesifik
    if (email) {
      const emailUsed = await User.findOne({ where: { email } });
      if (emailUsed) return res.status(400).json({ message: "Email sudah digunakan!" });
    }
    if (nim) {
      const nimUsed = await User.findOne({ where: { nim } });
      if (nimUsed) return res.status(400).json({ message: "NIM sudah digunakan!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = await User.create({
      name,
      email: email || null,
      nim: nim || null,
      password: hashedPassword,
      role,
      prodi: prodi || null,
      angkatan: angkatan || null,
      status: "Aktif",
    });

    return res.status(201).json({
      message: "Registrasi berhasil",
      data: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        nim: userData.nim,
        role: userData.role,
        prodi: userData.prodi,
        angkatan: userData.angkatan,
        status: userData.status,
      },
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Email atau NIM sudah digunakan!" });
    }
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { nim, email, password } = req.body;
    if (!password) return res.status(400).json({ message: "Password wajib diisi" });

    let user;
    if (nim) user = await User.findOne({ where: { nim } });
    else if (email) user = await User.findOne({ where: { email } });
    else return res.status(400).json({ message: "Email atau NIM wajib diisi" });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Password salah" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "Konfigurasi server belum lengkap (JWT_SECRET missing)" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res.json({
      message: "Login berhasil",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email, 
          nim: user.nim,
          role: user.role,
          prodi: user.prodi,
          angkatan: user.angkatan,
          status: user.status, 
          avatar: user.avatar || null
        },
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    // req.user harus diisi oleh middleware auth
    if (!req.user || !req.user.id) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "nim", "role", "prodi", "angkatan", "status"],
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    return res.json({ data: user });
  } catch (err) {
    return next(err);
  }
};