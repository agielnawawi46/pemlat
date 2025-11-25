const pool = require("../config/db");
const path = require("path");

// ✅ GET semua kategori
exports.getAllCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET all equipment (optional filter by category_id)
exports.getAllEquipment = async (req, res) => {
  const { category_id } = req.query; // ambil parameter dari URL
  try {
    let result;
    if (category_id) {
      // Jika ada kategori, filter berdasarkan category_id
      result = await pool.query(
        "SELECT * FROM equipment WHERE category_id = $1 ORDER BY id ASC",
        [category_id]
      );
    } else {
      // Jika tidak ada kategori, tampilkan semua alat
      result = await pool.query("SELECT * FROM equipment ORDER BY id ASC");
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET kategori berdasarkan ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ CREATE kategori baru
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await pool.query(
      "INSERT INTO categories (name, image) VALUES ($1, $2) RETURNING *",
      [name, imagePath]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE kategori
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.image || null;

  try {
    const result = await pool.query(
      "UPDATE categories SET name=$1, image=$2 WHERE id=$3 RETURNING *",
      [name, imagePath, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE kategori
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM categories WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
