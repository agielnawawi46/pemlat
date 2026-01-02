const { Equipment, Category } = require("../models");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(process.cwd(), "uploads");

// GET semua alat
exports.getAllEquipment = async (req, res, next) => {
  try {
    const { category_id } = req.query;
    const where = category_id ? { categoryId: Number(category_id) } : {};

    const equipment = await Equipment.findAll({
      where,
      include: [{ model: Category, as: "Category" }],
      order: [["id", "ASC"]],
    });

    return res.json({ data: equipment });
  } catch (err) {
    return next(err);
  }
};


// GET alat by id
exports.getEquipmentById = async (req, res, next) => {
  try {
    const alat = await Equipment.findByPk(req.params.id, {
      include: [{ model: Category, as: "Category" }],
    });
    if (!alat) return res.status(404).json({ message: "Equipment not found" });
    return res.json({ data: alat });
  } catch (err) {
    return next(err);
  }
};

// ✅ CREATE alat
exports.createEquipment = async (req, res, next) => {
  try {
    const { name, categoryId, description, stock, available } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!name || !categoryId) {
      return res.status(400).json({ error: "Nama dan kategori wajib diisi" });
    }

    const category = await Category.findByPk(Number(categoryId));
    if (!category) {
      return res.status(400).json({ error: "Kategori tidak ditemukan" });
    }

    const parsedStock = parseInt(stock, 10);
    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ error: "Stok tidak valid" });
    }

    const alat = await Equipment.create({
      name,
      description,
      stock: parsedStock,
      available: available === "true", // ✅ FIX DI SINI
      image,
      categoryId: Number(categoryId),
    });

    return res.status(201).json({ data: alat });
  } catch (err) {
    console.error("CREATE EQUIPMENT ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



// UPDATE alat
exports.updateEquipment = async (req, res, next) => {
  try {
    const { name, categoryId, description, stock, available } = req.body;
    const alat = await Equipment.findByPk(req.params.id);
    if (!alat) return res.status(404).json({ message: "Equipment not found" });

    const parsedStock = parseInt(stock, 10);
    if (!Number.isNaN(parsedStock) && parsedStock < 0) {
      return res.status(400).json({ error: "Stok tidak valid" });
    }

    let image = alat.image;
    if (req.file) {
      // hapus gambar lama
      if (alat.image) {
        const basename = path.basename(alat.image);
        const oldPath = path.join(uploadsDir, basename);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.error("Gagal hapus gambar:", e.message); }
        }
      }
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image === null) {
      image = null;
    } else if (req.body.image) {
      image = req.body.image;
    }

    const nextStock = Number.isNaN(parsedStock) ? alat.stock : parsedStock;
    await alat.update({
      name: name ?? alat.name,
      description: description ?? alat.description,
      stock: nextStock,
      available: available === "true", // ✅ gunakan nilai dari frontend
      image,
      categoryId: categoryId ?? alat.categoryId,
    });

    return res.json({ data: alat });
  } catch (err) {
    return next(err);
  }
};

// DELETE alat
exports.deleteEquipment = async (req, res, next) => {
  try {
    const alat = await Equipment.findByPk(req.params.id);
    if (!alat) return res.status(404).json({ message: "Equipment not found" });

    const image = alat.image;
    await alat.destroy();

    if (image) {
      const basename = path.basename(image);
      const fullPath = path.join(uploadsDir, basename);
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch (e) { console.error("Gagal hapus gambar:", e.message); }
      }
    }

    return res.json({ message: "Equipment deleted successfully" });
  } catch (err) {
    return next(err);
  }
};