const express = require("express");
const router = express.Router();
const controller = require("../controllers/roomBorrowingController");
const auth = require("../middlewares/authMiddleware");

// ================= MAHASISWA =================
router.get("/my", auth(["mahasiswa"]), controller.getMyRoomBorrowings);
router.post("/", auth(["mahasiswa"]), controller.createRoomBorrowing);
router.delete("/:id/cancel", auth(["mahasiswa"]), controller.cancelRoomBorrowing);

// ================= ADMIN =================
router.get("/", auth(["admin"]), controller.getAllRoomBorrowings);
router.put("/:id/status", auth(["admin"]), controller.updateRoomBorrowingStatus);
router.put("/:id/return", auth(["admin"]), controller.verifyRoomReturn);

module.exports = router;
