const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Database
const sequelize = require("./src/config/db");
require("./src/models");

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads
const uploadsDir = path.join(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/categories", require("./src/routes/categoryRoutes"));
app.use("/api/equipment", require("./src/routes/equipmentRoutes"));
app.use("/api/buildings", require("./src/routes/buildingRoutes"));
app.use("/api/rooms", require("./src/routes/roomRoutes"));
app.use("/api/borrowings", require("./src/routes/borrowingRoutes"));
app.use("/api/room-borrowings", require("./src/routes/roomBorrowingRoutes"));

// Test endpoint
app.get("/", (req, res) => {
  res.send("Backend bepemlat jalan 🚀");
});

// ✅ Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Run server dan connect ke database
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync({ alter: true });
    console.log("✅ Database synced");

    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Server error:", err);
  }
})();
