// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token tidak ditemukan" });
    }

    const token = authHeader.split(" ")[1];
    try {
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ error: "JWT_SECRET belum dikonfigurasi" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { id, role } = decoded;
      req.user = { id, role };

      if (roles.length && !roles.includes(role)) {
        return res.status(403).json({ error: "Akses ditolak" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: "Token tidak valid" });
    }
  };
};

module.exports = authMiddleware;