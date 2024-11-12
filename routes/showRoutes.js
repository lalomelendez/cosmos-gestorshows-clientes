// routes/showRoutes.js

const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");

// Rutas de shows
router.post("/", showController.createShow);
router.get("/", showController.getShows);
// Ruta para obtener shows con estado 'creado'
router.get("/available", showController.getAvailableShows);
router.get("/:id", showController.getShowById);
router.patch("/:id", showController.updateShow);
router.delete("/:id", showController.deleteShow);

// Route for updating show status
router.patch("/:id/status", showController.updateShowStatus);
//nuevos cambios
// Route to remove a user from a show
router.patch("/:id/remove-user/:userId", showController.removeUserFromShow);

// Route to delete a show
router.delete("/:id", showController.deleteShowAndResetUsers);

module.exports = router;
