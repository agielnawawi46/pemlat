const express = require("express");
const router = express.Router();
const tutorialController = require("../controllers/tutorialController");

router.get("/", tutorialController.getTutorials);
router.post("/", tutorialController.createTutorial);
router.delete("/:id", tutorialController.deleteTutorial);

module.exports = router;
