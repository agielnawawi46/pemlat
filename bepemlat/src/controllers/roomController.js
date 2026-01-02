const { Room, Building } = require("../models");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(process.cwd(), "uploads");

exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.findAll({
      include: [{ model: Building, as: "building" }],
      order: [["id", "ASC"]],
    });
    res.json({ data: rooms });
  } catch (err) {
    next(err);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id, {
      include: [{ model: Building, as: "building" }],
    });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ data: room });
  } catch (err) {
    next(err);
  }
};

exports.createRoom = async (req, res, next) => {
  try {
    const { name, buildingId, capacity, description, available } = req.body;
    if (!name || !buildingId) {
      return res.status(400).json({ error: "Nama ruangan dan gedung wajib diisi" });
    }

    const building = await Building.findByPk(buildingId);
    if (!building) return res.status(400).json({ error: "Gedung tidak ditemukan" });

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const room = await Room.create({
      name,
      buildingId,
      capacity: capacity ? Number(capacity) : null,
      description,
      available: available === true || available === "true",
      image,
    });

    const result = await Room.findByPk(room.id, { include: [{ model: Building, as: "building" }] });
    res.status(201).json({ data: result });
  } catch (err) {
    next(err);
  }
};

exports.updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const { name, buildingId, capacity, description, available } = req.body;
    let image = room.image;

    if (req.file) {
      if (room.image) {
        const basename = path.basename(room.image);
        const oldPath = path.join(uploadsDir, basename);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.error("Gagal hapus gambar:", e.message); }
        }
      }
      image = `/uploads/${req.file.filename}`;
    }

    await room.update({
      name,
      buildingId,
      capacity: capacity ? Number(capacity) : null,
      description,
      available: available === true || available === "true",
      image,
    });

    const result = await Room.findByPk(room.id, { include: [{ model: Building, as: "building" }] });
    res.json({ data: result });
  } catch (err) {
    next(err);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByPk(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    await room.destroy();
    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    next(err);
  }
};