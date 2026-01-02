const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Borrowing = sequelize.define("Borrowing", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  borrowDate: { type: DataTypes.DATE, allowNull: false },
  returnDate: { type: DataTypes.DATE },
  status: {
    type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "RETURNED"),
    defaultValue: "PENDING",
  },
  note: { type: DataTypes.TEXT },
  adminNote: { type: DataTypes.TEXT },
}, {
  tableName: "borrowings",
  timestamps: true,
});

module.exports = Borrowing;