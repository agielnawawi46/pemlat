import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes'; // Sesuaikan dengan path kamu

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routing
app.use('/auth', authRoutes);

// Port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});