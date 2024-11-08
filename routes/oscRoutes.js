// routes/oscRoutes.js
const express = require("express");
const router = express.Router();
const oscController = require("../controllers/oscController");

// Route for sending OSC play message
router.post("/play", (req, res) => {
  console.log("Received /play request"); // Debugging statement
  oscController.sendPlaySignal(req, res);
});

// Route for sending user details to OSC
router.post("/send-users", (req, res) => {
  console.log("Received /send-users request"); // Debugging statement
  oscController.sendUserDetails(req, res);
});

module.exports = router;
