// src/controllers/borrowingController.js
const { Borrowing, BorrowingItem, Equipment, sequelize, User } = require("../models");
const { Op } = require("sequelize");

// ========================
// CREATE peminjaman (mahasiswa)
// ========================
exports.createBorrowing = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user?.id;
    const { borrowDate, returnDate, note, items } = req.body;

    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (!borrowDate || !returnDate || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Tanggal dan daftar alat wajib diisi" });
    }

    // Validasi stok
    for (const item of items) {
      const equipment = await Equipment.findByPk(item.equipmentId, { transaction: t });
      if (!equipment) throw new Error("Alat tidak ditemukan");
      const qty = parseInt(item.quantity, 10);
      if (qty <= 0) throw new Error("Jumlah harus lebih dari 0");
      if (equipment.stock < qty) throw new Error(`Stok alat ${equipment.name} tidak mencukupi`);
    }

    // Buat borrowing (status PENDING)
    const borrowing = await Borrowing.create(
      { userId, borrowDate, returnDate, note, status: "PENDING" },
      { transaction: t }
    );

    // Buat item
    for (const item of items) {
      const qty = parseInt(item.quantity, 10);
      await BorrowingItem.create(
        { borrowingId: borrowing.id, equipmentId: item.equipmentId, quantity: qty },
        { transaction: t }
      );
    }

    await t.commit();
    return res.status(201).json({
      message: "Pengajuan peminjaman berhasil",
      data: { borrowingId: borrowing.id },
    });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
};

// ========================
// Riwayat peminjaman mahasiswa
// ========================
exports.getMyBorrowings = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const rows = await Borrowing.findAll({
      where: { userId, status: { [Op.not]: "RETURNED" } },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: BorrowingItem,
          as: "items",
          include: [{ model: Equipment, attributes: ["name"] }],
        },
      ],
    });

    const result = rows.map((b) => ({
      id: b.id,
      item_name: (b.items || []).map((i) => i.Equipment?.name).filter(Boolean).join(", "),
      quantity: (b.items || []).map((i) => i.quantity).join(", "),
      borrow_date: b.borrowDate,
      return_date: b.returnDate,
      status: b.status,
    }));


    return res.json({ data: result });
  } catch (err) {
    return next(err);
  }
};

// ========================
// Cancel peminjaman (mahasiswa)
// ========================
exports.cancelBorrowing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const borrowing = await Borrowing.findByPk(id);
    if (!borrowing) return res.status(404).json({ error: "Peminjaman tidak ditemukan" });
    if (borrowing.status !== "PENDING") return res.status(400).json({ error: "Hanya peminjaman PENDING yang bisa dibatalkan" });

    await borrowing.destroy();
    return res.json({ message: "Peminjaman berhasil dibatalkan" });
  } catch (err) {
    return next(err);
  }
};

// ========================
// Admin: lihat semua peminjaman
// ========================
exports.getAllBorrowings = async (req, res, next) => {
  try {
    const rows = await Borrowing.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: BorrowingItem,
          as: "items",
          include: [{ model: Equipment }],
        },
        { model: User, attributes: ["id", "name", "email"] },
      ],
    });
    return res.json({ data: rows });
  } catch (err) {
    return next(err);
  }
};

// ========================
// Admin: lihat peminjaman user tertentu
// ========================
exports.getBorrowingByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const rows = await Borrowing.findAll({
      where: { userId },
      include: [
        { model: BorrowingItem, as: "items", include: [{ model: Equipment }] },
      ],
    });
    return res.json({ data: rows });
  } catch (err) {
    return next(err);
  }
};

// ========================
// Update status peminjaman (admin)
// ========================
exports.updateStatus = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const borrowing = await Borrowing.findByPk(id, {
      include: [{ model: BorrowingItem, as: "items" }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!borrowing) {
      await t.rollback();
      return res.status(404).json({ error: "Data tidak ditemukan" });
    }

    // Side effect stok
    if (status === "APPROVED") {
      for (const item of borrowing.items) {
        const eq = await Equipment.findByPk(item.equipmentId, { transaction: t, lock: t.LOCK.UPDATE });
        if (!eq) throw new Error("Alat tidak ditemukan saat approval");
        if (eq.stock < item.quantity) throw new Error(`Stok alat ${eq.name} tidak cukup`);
        await eq.update({ stock: eq.stock - item.quantity, available: eq.stock - item.quantity > 0 }, { transaction: t });
      }
    }

    await borrowing.update({ status, adminNote }, { transaction: t });
    await t.commit();
    return res.json({ message: "Status berhasil diperbarui" });
  } catch (err) {
    await t.rollback();
    return next(err);
  }
};

// ========================
// Verifikasi pengembalian alat (admin)
// ========================
exports.verifyReturn = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const borrowing = await Borrowing.findByPk(id, {
      include: [{ model: BorrowingItem, as: "items" }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!borrowing) {
      await t.rollback();
      return res.status(404).json({ error: "Data peminjaman tidak ditemukan" });
    }

    if (borrowing.status !== "APPROVED") {
      await t.rollback();
      return res.status(400).json({ error: "Peminjaman belum disetujui atau sudah dikembalikan" });
    }

    // Kembalikan stok
    for (const item of borrowing.items) {
      const equipment = await Equipment.findByPk(item.equipmentId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!equipment) throw new Error(`Alat dengan ID ${item.equipmentId} tidak ditemukan`);
      await equipment.update({ stock: equipment.stock + item.quantity, available: true }, { transaction: t });
    }

    await borrowing.update({ status: "RETURNED" }, { transaction: t });
    await t.commit();
    return res.json({ message: "Pengembalian berhasil diverifikasi" });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: err.message || "Terjadi kesalahan server" });
  }
};
