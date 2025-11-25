// controllers/borrowController.js
const pool = require("../config/db");

// GET semua request peminjaman
exports.getAllBorrowRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT br.*, u.name AS user_name 
       FROM borrow_requests br
       JOIN users u ON br.user_id = u.id
       ORDER BY br.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET request peminjaman by ID
exports.getBorrowRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT br.*, u.name AS user_name 
       FROM borrow_requests br
       JOIN users u ON br.user_id = u.id
       WHERE br.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE request peminjaman
exports.createBorrowRequest = async (req, res) => {
  const { user_id, item_type, item_id, borrow_date, return_date } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO borrow_requests 
        (user_id, item_type, item_id, borrow_date, return_date, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [user_id, item_type, item_id, borrow_date, return_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE status peminjaman (admin only)
exports.updateBorrowStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "approved" atau "rejected"

  try {
    // Ambil data permintaan dulu
    const requestResult = await pool.query(
      "SELECT * FROM borrow_requests WHERE id = $1",
      [id]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    const request = requestResult.rows[0];

    // Update status
    const updateResult = await pool.query(
      `UPDATE borrow_requests 
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    // Jika disetujui dan item_type adalah equipment, kurangi stok
    if (status === "approved" && request.item_type === "alat") {
      await pool.query(
        `UPDATE equipment 
         SET stock = stock - 1 
         WHERE id = $1 AND stock > 0`,
        [request.item_id]
      );
    }

    res.json(updateResult.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE request peminjaman
exports.deleteBorrowRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM borrow_requests WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    res.json({ message: "Borrow request deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBorrowRequestsByUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT br.*, e.name AS item_name
       FROM borrow_requests br
       JOIN equipment e ON br.item_id = e.id
       WHERE br.user_id = $1
       ORDER BY br.created_at DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyBorrowRequest = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "approve" atau "reject"

  try {
    if (action === "approve") {
      // Kurangi stok alat
      await pool.query(
        `UPDATE equipment SET stock = stock - 1
         WHERE id = (SELECT item_id FROM borrow_requests WHERE id = $1)`,
        [id]
      );

      // Update status
      await pool.query(
        `UPDATE borrow_requests SET status = 'approved' WHERE id = $1`,
        [id]
      );
    } else if (action === "reject") {
      await pool.query(
        `UPDATE borrow_requests SET status = 'rejected' WHERE id = $1`,
        [id]
      );
    } else {
      return res.status(400).json({ message: "Aksi tidak valid" });
    }

    res.json({ message: "Permintaan berhasil diverifikasi" });
  } catch (err) {
    console.error("Verifikasi error:", err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

exports.getPendingRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT br.*, u.name AS peminjam, e.name AS item_name
       FROM borrow_requests br
       JOIN users u ON br.user_id = u.id
       JOIN equipment e ON br.item_id = e.id
       WHERE br.status = 'pending'
       ORDER BY br.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Get pending error:", err);
    res.status(500).json({ message: "Gagal mengambil data pending" });
  }
};