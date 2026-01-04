const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

module.exports = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nim: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  prodi: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  angkatan: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    // ⚠️ Jangan pakai `unique: true` kalau index sudah ada di DB
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "mahasiswa",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Aktif",
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});