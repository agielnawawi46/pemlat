const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Equipment = sequelize.define(
  "Equipment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // ✅ default tidak tersedia
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, // ✅ bisa null kalau belum upload
    },
  },
  {
    tableName: "equipment",
    timestamps: true,
  }
);

module.exports = Equipment;