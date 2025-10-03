const pool = require("../config/db");

// GET semua tutorial
exports.getTutorials = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tutorials ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE tutorial baru
exports.createTutorial = async (req, res) => {
  const { title, description, youtube_url } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tutorials (title, description, youtube_url) VALUES ($1, $2, $3) RETURNING *",
      [title, description, youtube_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE tutorial
exports.updateTutorial = async (req, res) => {
  const { id } = req.params;
  const { title, description, youtube_url } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tutorials SET title=$1, description=$2, youtube_url=$3, updated_at=NOW() WHERE id=$4 RETURNING *",
      [title, description, youtube_url, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Tutorial not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE tutorial
exports.deleteTutorial = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM tutorials WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Tutorial not found" });
    res.json({ message: "Tutorial deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
