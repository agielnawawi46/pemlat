const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BorrowingItem = sequelize.define("BorrowingItem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  borrowingId: { type: DataTypes.INTEGER, allowNull: false },
  equipmentId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: "borrowing_items",
  timestamps: true,
});

module.exports = BorrowingItem;