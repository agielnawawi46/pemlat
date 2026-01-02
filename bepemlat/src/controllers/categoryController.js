// src/controller/categoryController.js
const { Category, Equipment } = require("../models");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(process.cwd(), "uploads");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({ order: [["id", "ASC"]] });
    return res.json({ data: categories });
  } catch (err) {
    return next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    return res.json({ data: category });
  } catch (err) {
    return next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Nama kategori wajib diisi" });
    }

    const existing = await Category.findOne({ where: { name } });
    if (existing) return res.status(400).json({ error: "Kategori dengan nama ini sudah ada" });

    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const category = await Category.create({ name, image });

    return res.status(201).json({ data: category });
  } catch (err) {
    return next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    if (name && name !== category.name) {
      const dupe = await Category.findOne({ where: { name } });
      if (dupe) return res.status(400).json({ error: "Kategori dengan nama ini sudah ada" });
    }

    let image = category.image;
    if (req.file) {
      if (category.image) {
        const basename = path.basename(category.image);
        const oldPath = path.join(uploadsDir, basename);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (e) {
            console.error("Gagal hapus gambar kategori:", e.message);
          }
        }
      }
      image = `/uploads/${req.file.filename}`;
    } else if (req.body.image === null) {
      // mendukung penghapusan gambar via payload eksplisit
      image = null;
    }

    await category.update({ name: name ?? category.name, image });
    return res.json({ data: category });
  } catch (err) {
    return next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const used = await Equipment.findOne({ where: { categoryId: category.id } });
    if (used) return res.status(400).json({ error: "Kategori ini masih digunakan oleh alat" });

    if (category.image) {
      const basename = path.basename(category.image);
      const imgPath = path.join(uploadsDir, basename);
      if (fs.existsSync(imgPath)) {
        try {
          fs.unlinkSync(imgPath);
        } catch (e) {
          console.error("Gagal hapus gambar kategori:", e.message);
        }
      }
    }

    await category.destroy();
    return res.json({ message: "Category deleted successfully" });
  } catch (err) {
    return next(err);
  }
};