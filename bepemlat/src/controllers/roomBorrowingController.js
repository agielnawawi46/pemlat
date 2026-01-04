const { RoomBorrowing, Room, User } = require("../models");
const { Op } = require("sequelize");

/* ============================
   CREATE PEMINJAMAN RUANGAN
============================ */
exports.createRoomBorrowing = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { roomId, startTime, endTime, activity, borrowDate } = req.body;

    // Validasi input
    if (!roomId || !startTime || !endTime || !activity) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }

    if (startTime >= endTime) {
      return res
        .status(400)
        .json({ error: "Jam selesai harus lebih besar dari jam mulai" });
    }

    const room = await Room.findByPk(roomId);
    if (!room) return res.status(404).json({ error: "Ruangan tidak ditemukan" });

    // Gunakan borrowDate dari frontend atau default hari ini
    const dateToUse = borrowDate || new Date().toISOString().split("T")[0];

    // Cek bentrok jadwal
    const conflict = await RoomBorrowing.findOne({
      where: {
        roomId,
        status: { [Op.in]: ["PENDING", "APPROVED"] },
        borrowDate: dateToUse,
        [Op.or]: [
          { startTime: { [Op.between]: [startTime, endTime] } },
          { endTime: { [Op.between]: [startTime, endTime] } },
          { startTime: { [Op.lte]: startTime }, endTime: { [Op.gte]: endTime } },
        ],
      },
    });

    if (conflict) {
      return res
        .status(400)
        .json({ error: "Ruangan sudah dipinjam di jam tersebut" });
    }

    const borrowing = await RoomBorrowing.create({
      userId,
      roomId,
      borrowDate: dateToUse,
      startTime,
      endTime,
      purpose: activity,
      status: "PENDING", // harus sesuai ENUM model
    });

    res.status(201).json({ data: borrowing });
  } catch (err) {
    console.error("Error createRoomBorrowing:", err);
    next(err);
  }
};

/* ============================
   RIWAYAT MAHASISWA
============================ */
exports.getMyRoomBorrowings = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const data = await RoomBorrowing.findAll({
      where: { userId }, // ambil semua status
      include: [{ model: Room, attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });

    const result = data.map((r) => ({
      id: r.id,
      room_name: r.Room?.name || "Ruangan tidak diketahui",
      activity: r.purpose,
      borrowDate: r.borrowDate,
      startTime: r.startTime || "-",
      endTime: r.endTime || "-",
      status: r.status, // bisa: PENDING, APPROVED, REJECTED, CANCELLED, RETURNED
    }));

    res.json({ data: result });
  } catch (err) {
    console.error("Error getMyRoomBorrowings:", err);
    next(err);
  }
};


/* ============================
   CANCEL PEMINJAMAN
============================ */
exports.cancelRoomBorrowing = async (req, res, next) => {
  try {
    const borrowing = await RoomBorrowing.findByPk(req.params.id);

    if (!borrowing)
      return res.status(404).json({ error: "Data tidak ditemukan" });

    if (borrowing.userId !== req.user.id)
      return res.status(403).json({ error: "Akses ditolak" });

    if (borrowing.status !== "PENDING")
      return res.status(400).json({ error: "Tidak bisa dibatalkan" });

    borrowing.status = "CANCELLED"; // sesuai ENUM model
    await borrowing.save();

    res.json({ message: "Peminjaman ruangan dibatalkan" });
  } catch (err) {
    console.error("Error cancelRoomBorrowing:", err);
    next(err);
  }
};

/* ============================
   ADMIN - SEMUA DATA
============================ */
exports.getAllRoomBorrowings = async (req, res, next) => {
  try {
    const data = await RoomBorrowing.findAll({
      include: [
        { model: Room, attributes: ["name"] },
        { model: User, attributes: ["name"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    const result = data.map((r) => ({
      id: r.id,
      User: r.User,
      namaRuangan: r.Room?.name,
      kegiatan: r.purpose,
      borrowDate: r.borrowDate, 
      jamMulai: r.startTime,
      jamSelesai: r.endTime,
      status: r.status,
    }));

    res.json({ data: result });
  } catch (err) {
    console.error("Error getAllRoomBorrowings:", err);
    next(err);
  }
};

/* ============================
   ADMIN - UPDATE STATUS
============================ */
exports.updateRoomBorrowingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const borrowing = await RoomBorrowing.findByPk(req.params.id);

    if (!borrowing)
      return res.status(404).json({ error: "Data tidak ditemukan" });

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Status tidak valid" });
    }

    borrowing.status = status;
    await borrowing.save();

    res.json({ message: "Status diperbarui" });
  } catch (err) {
    console.error("Error updateRoomBorrowingStatus:", err);
    next(err);
  }
};

exports.updateRoomBorrowingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({ error: "Status tidak valid" });
    }

    const borrowing = await RoomBorrowing.findByPk(id);
    if (!borrowing) return res.status(404).json({ error: "Peminjaman tidak ditemukan" });

    borrowing.status = status;
    await borrowing.save();

    res.json({ message: "Status peminjaman gudang diperbarui", data: borrowing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ============================
// ADMIN - VERIFIKASI PENGEMBALIAN
// ============================
exports.verifyRoomReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const borrowing = await RoomBorrowing.findByPk(id);

    if (!borrowing) return res.status(404).json({ error: "Peminjaman tidak ditemukan" });

    if (borrowing.status !== "APPROVED") {
      return res.status(400).json({ error: "Hanya peminjaman yang disetujui yang bisa diverifikasi pengembaliannya" });
    }

    borrowing.status = "RETURNED"; // sesuai ENUM model
    await borrowing.save();

    res.json({ message: "Peminjaman gedung telah selesai", data: borrowing });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
