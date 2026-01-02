const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const upload = require("../middlewares/uploadMiddleware");

// ✅ GET semua kategori
router.get("/", categoryController.getAllCategories);

// ✅ GET kategori by ID
router.get("/:id", categoryController.getCategoryById);

// ✅ POST kategori baru
router.post("/", upload.single("image"), categoryController.createCategory);

// ✅ UPDATE kategori
router.put("/:id", upload.single("image"), categoryController.updateCategory);

// ✅ DELETE kategori
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
