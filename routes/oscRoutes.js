const express = require("express");
const router = express.Router();
const oscController = require("../controllers/oscController");

// Ruta para enviar mensaje OSC de reproducción
router.post("/play", oscController.sendPlaySignal);

// Ruta para enviar datos de usuarios asignados
router.post("/send-users", oscController.sendUserDetails);

module.exports = router;
