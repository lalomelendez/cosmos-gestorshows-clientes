// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Importa el controlador de usuario

// Crear un nuevo usuario
router.post("/", userController.createUser);

// Obtener todos los usuarios en espera
router.get("/waiting", userController.getUsersByStatus); // Asegúrate de tener esta función en userController

// Obtener todos los usuarios
router.get("/", userController.getUsers); // Asegúrate de que esta función esté definida en userController

// Obtener un usuario por ID
router.get("/:id", userController.getUserById);

// Actualizar el estado de un usuario
router.patch("/:id/status", userController.updateUserStatus);

// Eliminar un usuario
router.delete("/:id", userController.deleteUser);

// Asignar un usuario a un show, verificando si hay capacidad
router.patch("/:id/show", userController.assignUserToShow);

module.exports = router; // Exporta el router
