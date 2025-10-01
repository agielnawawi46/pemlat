const pool = require("../config/db");

// GET all equipment
exports.getAllEquipment = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM equipment ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET equipment by id
exports.getEquipmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM equipment WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new equipment
exports.createEquipment = async (req, res) => {
  const { name, category, description, available } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO equipment (name, category, description, available) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, category, description, available ?? true]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE equipment
exports.updateEquipment = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, available } = req.body;
  try {
    const result = await pool.query(
      "UPDATE equipment SET name=$1, category=$2, description=$3, available=$4 WHERE id=$5 RETURNING *",
      [name, category, description, available, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE equipment
exports.deleteEquipment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM equipment WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.json({ message: "Equipment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
