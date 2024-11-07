// routes/photoRoutes.js

const express = require("express");
const router = express.Router();
const photoController = require("../controllers/photoController");

// Crear una nueva foto
router.post("/", photoController.capturePhoto);

// Obtener todas las fotos
router.get("/", photoController.getAllPhotos);

// Obtener una foto por ID
router.get("/:id", photoController.getPhotoById);

// Modificar una foto
router.patch("/:id", photoController.updatePhoto);

// Eliminar una foto
router.delete("/:id", photoController.deletePhoto);

module.exports = router;
