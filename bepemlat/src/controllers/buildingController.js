// src/controller/buildingController.js
const { Building, Room } = require("../models");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(process.cwd(), "uploads");

exports.getAllBuildings = async (req, res, next) => {
  try {
    const buildings = await Building.findAll({ order: [["id", "ASC"]] });
    return res.json({ data: buildings });
  } catch (err) {
    return next(err);
  }
};

exports.getBuildingById = async (req, res, next) => {
  try {
    const building = await Building.findByPk(req.params.id, { include: [{ model: Room }] });
    if (!building) return res.status(404).json({ message: "Building not found" });
    return res.json({ data: building });
  } catch (err) {
    return next(err);
  }
};

exports.createBuilding = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Nama gedung wajib diisi" });
    }

    const existing = await Building.findOne({ where: { name } });
    if (existing) return res.status(400).json({ error: "Gedung sudah ada" });

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const building = await Building.create({ name, image });
    return res.status(201).json({ data: building });
  } catch (err) {
    return next(err);
  }
};

exports.updateBuilding = async (req, res, next) => {
  try {
    const { name } = req.body;
    const building = await Building.findByPk(req.params.id);
    if (!building) return res.status(404).json({ message: "Building not found" });

    if (name && name !== building.name) {
      const dupe = await Building.findOne({ where: { name } });
      if (dupe) return res.status(400).json({ error: "Gedung dengan nama ini sudah ada" });
    }

    let image = building.image;

    if (req.file) {
      // hapus gambar lama
      if (building.image) {
        const basename = path.basename(building.image); // aman dari path traversal
        const oldPath = path.join(uploadsDir, basename);
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (e) {
            console.error("Gagal hapus gambar lama gedung:", e.message);
          }
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    await building.update({ name: name ?? building.name, image });
    return res.json({ data: building });
  } catch (err) {
    return next(err);
  }
};

exports.deleteBuilding = async (req, res, next) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) return res.status(404).json({ message: "Building not found" });

    const used = await Room.findOne({ where: { buildingId: building.id } });
    if (used) return res.status(400).json({ error: "Gedung masih memiliki ruangan" });

    // hapus gambar
    if (building.image) {
      const basename = path.basename(building.image);
      const imgPath = path.join(uploadsDir, basename);
      if (fs.existsSync(imgPath)) {
        try {
          fs.unlinkSync(imgPath);
        } catch (e) {
          console.error("Gagal hapus gambar gedung:", e.message);
        }
      }
    }

    await building.destroy();
    return res.json({ message: "Building deleted successfully" });
  } catch (err) {
    return next(err);
  }
};