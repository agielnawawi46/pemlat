const sequelize = require("../config/db");

const User = require("./user");
const Category = require("./category");
const Equipment = require("./equipment");
const Borrowing = require("./borrowing");
const BorrowingItem = require("./borrowingItem");
const Building = require("./building");
const Room = require("./room");
const RoomBorrowing = require("./roomBorrowing"); // ✅ WAJIB

/* =====================
   RELATIONS
===================== */

// =====================
// USER
// =====================
User.hasMany(Borrowing, { foreignKey: "userId" });
Borrowing.belongsTo(User, { foreignKey: "userId" });

User.hasMany(RoomBorrowing, { foreignKey: "userId" });
RoomBorrowing.belongsTo(User, { foreignKey: "userId" });

// =====================
// BORROWING ALAT
// =====================
Borrowing.hasMany(BorrowingItem, {
  as: "items",
  foreignKey: "borrowingId",
});
BorrowingItem.belongsTo(Borrowing, {
  foreignKey: "borrowingId",
});

Equipment.hasMany(BorrowingItem, { foreignKey: "equipmentId" });
BorrowingItem.belongsTo(Equipment, { foreignKey: "equipmentId" });

// =====================
// CATEGORY → EQUIPMENT
// =====================
Category.hasMany(Equipment, {
  as: "Equipments",
  foreignKey: "categoryId",
});
Equipment.belongsTo(Category, {
  as: "Category",
  foreignKey: "categoryId",
});

// =====================
// BUILDING → ROOM
// =====================
Building.hasMany(Room, {
  foreignKey: "buildingId",
  as: "rooms",
});
Room.belongsTo(Building, {
  foreignKey: "buildingId",
  as: "building",
});

// =====================
// ROOM → ROOM BORROWING
// =====================
Room.hasMany(RoomBorrowing, { foreignKey: "roomId" });
RoomBorrowing.belongsTo(Room, { foreignKey: "roomId" });

module.exports = {
  sequelize,
  User,
  Category,
  Equipment,
  Borrowing,
  BorrowingItem,
  Building,
  Room,
  RoomBorrowing, // ✅ JANGAN LUPA
};
