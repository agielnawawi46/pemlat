const express = require("express");
const router = express.Router();
const buildingController = require("../controllers/buildingController");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", buildingController.getAllBuildings);
router.get("/:id", buildingController.getBuildingById);

// ✅ BENAR — multer aktif
router.post("/", upload.single("image"), buildingController.createBuilding);
router.put("/:id", upload.single("image"), buildingController.updateBuilding);

router.delete("/:id", buildingController.deleteBuilding);

module.exports = router;
