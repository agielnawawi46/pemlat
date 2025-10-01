// controllers/roomController.js
const pool = require("../config/db");

// GET semua ruangan
exports.getAllRooms = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM rooms ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ruangan by ID
exports.getRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM rooms WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE ruangan
exports.createRoom = async (req, res) => {
  const { name, location, capacity, available } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO rooms (name, location, capacity, available)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, location, capacity, available ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ruangan
exports.updateRoom = async (req, res) => {
  const { id } = req.params;
  const { name, location, capacity, available } = req.body;
  try {
    const result = await pool.query(
      `UPDATE rooms
       SET name=$1, location=$2, capacity=$3, available=$4
       WHERE id=$5
       RETURNING *`,
      [name, location, capacity, available, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ruangan
exports.deleteRoom = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM rooms WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
