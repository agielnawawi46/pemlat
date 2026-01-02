const express = require("express");
const router = express.Router();
const equipmentController = require("../controllers/equipmentController");
const upload = require("../middlewares/uploadMiddleware");

// GET semua alat
router.get("/", equipmentController.getAllEquipment);

// GET alat berdasarkan ID
router.get("/:id", equipmentController.getEquipmentById);

// POST alat baru dengan upload gambar
router.post("/", upload.single("image"), equipmentController.createEquipment);

// PUT update alat dengan upload gambar baru (opsional)
router.put("/:id", upload.single("image"), equipmentController.updateEquipment);

// DELETE alat
router.delete("/:id", equipmentController.deleteEquipment);

module.exports = router;