// routes/showRoutes.js
const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");
const User = require("../models/User");
const Show = require("../models/Show");

// Show routes
router.post("/", showController.createShow);
router.get("/", showController.getShows);
router.get("/available", showController.getAvailableShows);
router.get("/:id", showController.getShowById);
router.patch("/:id", showController.updateShow);
router.patch("/:id/status", showController.updateShowStatus);
router.patch("/:id/remove-user/:userId", showController.removeUserFromShow);

// Delete show - use only one delete route
router.delete("/:id", showController.deleteShowAndResetUsers);

// Debug routes
router.get("/debug/users", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

router.get("/debug/:id", async (req, res) => {
  const show = await Show.findById(req.params.id);
  res.json({ show });
});

module.exports = router;
