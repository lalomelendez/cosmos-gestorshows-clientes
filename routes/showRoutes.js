// routes/showRoutes.js

const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");

// Rutas de shows
router.post("/", showController.createShow);
router.get("/", showController.getShows);
router.get("/:id", showController.getShowById);
router.patch("/:id", showController.updateShow);
router.delete("/:id", showController.deleteShow);

// Route for updating show status
router.patch("/:id/status", showController.updateShowStatus);

module.exports = router;
