const pool = require("../config/db");

// GET semua tutorial
exports.getTutorials = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM tutorials ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    next(err); // ✅ kirim ke errorHandler
  }
};

// CREATE tutorial baru
exports.createTutorial = async (req, res, next) => {
  const { title, description, youtube_url } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tutorials (title, description, youtube_url) VALUES ($1, $2, $3) RETURNING *",
      [title, description, youtube_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    err.status = 400; // ✅ bisa kasih status khusus
    next(err);
  }
};

// UPDATE tutorial
exports.updateTutorial = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, youtube_url } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tutorials SET title=$1, description=$2, youtube_url=$3, updated_at=NOW() WHERE id=$4 RETURNING *",
      [title, description, youtube_url, id]
    );
    if (result.rows.length === 0) {
      const error = new Error("Tutorial not found");
      error.status = 404;
      return next(error);
    }
    res.json(result.rows[0]);
  } catch (err) {
    err.status = 400;
    next(err);
  }
};

// DELETE tutorial
exports.deleteTutorial = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM tutorials WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) {
      const error = new Error("Tutorial not found");
      error.status = 404;
      return next(error);
    }
    res.json({ message: "Tutorial deleted" });
  } catch (err) {
    next(err);
  }
};