const express = require("express");
const router = express.Router();
const oscController = require("../controllers/oscController");

// Route for sending play signal
router.post("/play", oscController.sendPlaySignal);

// Route for sending user details
router.post("/send-users", oscController.sendUserDetails);

module.exports = router;
