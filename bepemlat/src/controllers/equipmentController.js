const pool = require("../config/db");
const path = require("path");
const fs = require("fs");

// GET all equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM equipment ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET equipment by id
exports.getEquipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM equipment WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new equipment (otomatis tambahkan kategori jika belum ada)
exports.createEquipment = async (req, res) => {
  const { name, category, description, stock, available } = req.body;
  const imagePath = req.file?.filename ? `/uploads/${req.file.filename}` : null;

  try {
    // 🔹 1. Cek apakah kategori sudah ada di tabel categories
    let categoryId;
    const categoryResult = await pool.query(
      "SELECT id FROM categories WHERE name = $1",
      [category]
    );

    if (categoryResult.rows.length === 0) {
      // 🔹 2. Jika belum ada, buat kategori baru (pakai gambar default)
      const defaultImage = "/uploads/default-category.jpg";
      const newCategory = await pool.query(
        "INSERT INTO categories (name, image) VALUES ($1, $2) RETURNING id",
        [category, defaultImage]
      );
      categoryId = newCategory.rows[0].id;
    } else {
      categoryId = categoryResult.rows[0].id;
    }

    // 🔹 3. Simpan alat baru ke tabel equipment
    const result = await pool.query(
      `INSERT INTO equipment 
        (name, category, description, stock, available, image, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        name,
        category,
        description,
        parseInt(stock, 10),
        available === "true",
        imagePath,
        categoryId,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Gagal menambahkan alat:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE equipment
exports.updateEquipment = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, stock, available } = req.body;
  const imagePath =
    req.file?.filename ? `/uploads/${req.file.filename}` : req.body.image || null;

  try {
    const result = await pool.query(
      "UPDATE equipment SET name=$1, category=$2, description=$3, stock=$4, available=$5, image=$6 WHERE id=$7 RETURNING *",
      [
        name,
        category,
        description,
        parseInt(stock, 10),
        available === "true",
        imagePath,
        id,
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE equipment
exports.deleteEquipment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM equipment WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Hapus file gambar jika ada
    const imagePath = result.rows[0]?.image;
    if (imagePath) {
      const fullPath = path.join(__dirname, "..", imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) console.error("Gagal hapus gambar:", err.message);
        });
      }
    }

    res.json({ message: "Equipment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
