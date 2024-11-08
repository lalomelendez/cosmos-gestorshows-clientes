const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const showRoutes = require("./routes/showRoutes");
const photoRoutes = require("./routes/photoRoutes");
const oscRoutes = require("./routes/oscRoutes"); // Import oscRoutes
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({ origin: "*" }));

// Connect to the database
connectDB()
  .then(() => {
    // Middleware to parse JSON
    app.use(express.json());

    // Serve static files (CSS and JS)
    app.use(express.static(path.join(__dirname, "public")));

    // Set up API routes
    app.use("/api/users", userRoutes);
    app.use("/api/shows", showRoutes);
    app.use("/api/photos", photoRoutes);
    app.use("/api/osc", oscRoutes); // Add the OSC routes

    // HTML Page Routes
    app.get("/create-user", (req, res) => {
      res.sendFile(path.join(__dirname, "public/html/createUser.html"));
    });

    app.get("/create-show", (req, res) => {
      res.sendFile(path.join(__dirname, "public/html/createShow.html"));
    });

    app.get("/assign-user-to-show", (req, res) => {
      res.sendFile(path.join(__dirname, "public/html/assignUserToShow.html"));
    });

    app.get("/capture-photo", (req, res) => {
      res.sendFile(path.join(__dirname, "public/html/capturePhoto.html"));
    });

    app.get("/show-playback", (req, res) => {
      res.sendFile(path.join(__dirname, "public/html/showPlayback.html"));
    });

    // Handle 404 errors
    app.use((req, res) => {
      res.status(404).json({ message: "Route not found" });
    });

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error("Server error:", err.stack);
      res.status(500).json({ message: "Server error" });
    });

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    // Export app and server instances for testing
    module.exports = { app, server };
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });
