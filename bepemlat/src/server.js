const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const roomRoutes = require('./routes/roomRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const tutorialRoutes = require('./routes/tutorialRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/tutorials', tutorialRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
