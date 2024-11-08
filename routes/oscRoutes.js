const express = require("express");
const router = express.Router();
const oscController = require("../controllers/oscController");

// Ruta para enviar mensaje OSC de reproducción
router.post("/play", (req, res) => {
  console.log("Received /play request"); // Debugging statement
  oscController.sendPlaySignal(req, res);
});

// Ruta para enviar datos de usuarios asignados
router.post("/send-users", (req, res) => {
  console.log("Received /send-users request"); // Debugging statement
  oscController.sendUserDetails(req, res);
});

module.exports = router;
