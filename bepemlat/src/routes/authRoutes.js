const express = require("express");
const router = express.Router();

// Endpoint login
router.post("/login", (req, res) => {
  const { name, nim, email, password } = req.body;

  // Mahasiswa login (pakai name + nim)
  if (name && nim) {
    return res.json({
      success: true,
      role: "mahasiswa",
      message: `Login mahasiswa berhasil: ${name} (${nim})`
    });
  }

  // Admin login (pakai email + password)
  if (email && password) {
    return res.json({
      success: true,
      role: "admin",
      message: `Login admin berhasil: ${email}`
    });
  }

  // Kalau datanya gak sesuai
  return res.status(400).json({
    success: false,
    message: "Data login tidak valid"
  });
});

module.exports = router;
