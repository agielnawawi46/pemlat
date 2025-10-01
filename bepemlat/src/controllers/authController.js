const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Mahasiswa login: name + nim
// Admin login: email + password
async function login(req, res) {
  try {
    const { name, nim, email, password } = req.body;

    if ((name && nim) && (!email && !password)) {
      // mahasiswa flow
      const q = 'SELECT id, name, nim, role FROM users WHERE name = $1 AND nim = $2';
      const { rows } = await db.query(q, [name, nim]);
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Mahasiswa not found' });
      }
      const user = rows[0];
      const token = jwt.sign({
        id: user.id,
        name: user.name,
        nim: user.nim,
        role: user.role
      }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      return res.json({ token, user: { id: user.id, name: user.name, nim: user.nim, role: user.role } });
    }

    if (email && password) {
      // admin flow (or any user who has email+password)
      const q = 'SELECT id, name, nim, email, password, role FROM users WHERE email = $1';
      const { rows } = await db.query(q, [email]);
      if (rows.length === 0) {
        return res.status(401).json({ message: 'User not found' });
      }
      const user = rows[0];
      if (!user.password) return res.status(401).json({ message: 'User has no password set' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({
        id: user.id,
        name: user.name,
        email: user.email,
        nim: user.nim,
        role: user.role
      }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    }

    return res.status(400).json({ message: 'Provide name+nim (mahasiswa) or email+password (admin)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function me(req, res) {
  // expects authMiddleware used
  res.json({ user: req.user });
}

module.exports = { login, me };
