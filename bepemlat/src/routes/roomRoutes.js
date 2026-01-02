const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);

// ✅ WAJIB pakai multer
router.post("/", upload.single("image"), roomController.createRoom);
router.put("/:id", upload.single("image"), roomController.updateRoom);

router.delete("/:id", roomController.deleteRoom);

module.exports = router;
