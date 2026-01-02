// src/routes/borrowingRoutes.js
const express = require("express");
const router = express.Router();
const borrowingController = require("../controllers/borrowingController");
const authMiddleware = require("../middlewares/authMiddleware");

// ===============================
// Mahasiswa
// ===============================

// Membuat peminjaman
router.post("/", authMiddleware(["mahasiswa"]), borrowingController.createBorrowing);

// Melihat riwayat peminjaman sendiri
router.get("/my", authMiddleware(["mahasiswa"]), borrowingController.getMyBorrowings);

// Cancel peminjaman (mahasiswa)
router.delete("/:id/cancel", authMiddleware(["mahasiswa"]), borrowingController.cancelBorrowing);

// ===============================
// Admin
// ===============================

// Admin bisa lihat peminjaman user tertentu
router.get("/user/:userId", authMiddleware(["admin"]), borrowingController.getBorrowingByUser);

// Lihat semua peminjaman
router.get("/", authMiddleware(["admin"]), borrowingController.getAllBorrowings);

// Update status peminjaman
router.put("/:id/status", authMiddleware(["admin"]), borrowingController.updateStatus);

// Verifikasi pengembalian alat
router.put("/:id/return", authMiddleware(["admin"]), borrowingController.verifyReturn);

module.exports = router;
