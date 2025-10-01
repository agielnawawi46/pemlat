const express = require("express");
const router = express.Router();
const borrowController = require("../controllers/borrowController");

router.post("/", borrowController.createBorrowRequest);
router.get("/", borrowController.getAllBorrowRequests);
router.get("/:id", borrowController.getBorrowRequestById);
router.put("/:id", borrowController.updateBorrowStatus);

module.exports = router;
