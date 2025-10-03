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
    const result = await pool.query(
      `UPDATE borrow_requests 
       SET status=$1
       WHERE id=$2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Borrow request not found" });
    }

    res.json(result.rows[0]);
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
