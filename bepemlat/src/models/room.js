const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Room = sequelize.define(
  "Room",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    buildingId: { type: DataTypes.INTEGER, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    available: { type: DataTypes.BOOLEAN, defaultValue: true },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "rooms",
    timestamps: true,
  }
);

module.exports = Room;
