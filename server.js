const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const showRoutes = require("./routes/showRoutes");
const photoRoutes = require("./routes/photoRoutes");
const oscRoutes = require("./routes/oscRoutes"); // Correctly import oscRoutes

const User = require("./models/User");
const osc = require("osc");
require("dotenv").config();
require("./controllers/oscController");

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
    app.use("/api/osc", oscRoutes); // Use oscRoutes here

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

    // New route for editShow
    app.get("/edit-show", (req, res) => {
      res.sendFile(path.join(__dirname, "public/html/editShow.html"));
    });

    // OSC Listener for receiving messages on port 8150
    const oscServer = new osc.UDPPort({
      localAddress: "0.0.0.0",
      localPort: 8150,
    });

    oscServer.open();

    oscServer.on("message", async (oscMessage) => {
      console.log("Received OSC message:", oscMessage);

      // Check if the message address is /cosmos
      if (oscMessage.address === "/cosmos") {
        try {
          const userData = JSON.parse(oscMessage.args[0]);
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(userData.email)) {
            console.log("Invalid email format:", userData.email);
            return;
          }

          const user = new User({
            name: userData.name,
            email: userData.email,
            energy: userData.energy,
            element: userData.element,
            essence: userData.essence,
          });
          await user.save();
          console.log("User created successfully:", user);
        } catch (error) {
          console.error(
            "Error processing OSC message or creating user:",
            error
          );
        }
      }
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
      console.log(
        "OSC listener ready on port 8150 for Android tablet messages."
      );
    });

    module.exports = { app, server };
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });
