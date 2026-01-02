const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Building = sequelize.define(
  "Building",
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
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "buildings",
    timestamps: true,
  }
);

module.exports = Building;
