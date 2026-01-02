const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RoomBorrowing = sequelize.define(
  "RoomBorrowing",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    userId: { type: DataTypes.INTEGER, allowNull: false },
    roomId: { type: DataTypes.INTEGER, allowNull: false },

    borrowDate: { type: DataTypes.DATEONLY, allowNull: false },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },

    purpose: { type: DataTypes.TEXT, allowNull: false },

    status: {
      type: DataTypes.ENUM(
        "PENDING",
        "APPROVED",
        "REJECTED",
        "CANCELLED",
        "RETURNED" // ✅ tambahkan RETURNED
      ),
      defaultValue: "PENDING",
    },
  },
  {
    tableName: "room_borrowings",
    timestamps: true,
  }
);

module.exports = RoomBorrowing;
