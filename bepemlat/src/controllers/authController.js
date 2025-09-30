import pool from '../config/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { name, nim, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    'INSERT INTO users (name, nim, email, password, role) VALUES ($1, $2, $3, $4, $5)',
    [name, nim, email, hashed, role]
  );

  res.status(201).json({ message: 'User registered' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
};