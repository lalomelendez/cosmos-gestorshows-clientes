const express = require("express");
const cors = require("cors");
const path = require("path");
const osc = require("osc");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const showRoutes = require("./routes/showRoutes");
const photoRoutes = require("./routes/photoRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// OSC Configuration
const oscPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57149,
  remoteAddress: "127.0.0.1",
  remotePort: 57150,
});

// Open OSC port
oscPort.open();

oscPort.on("ready", () => {
  console.log("OSC Server is ready and listening on port 57149");
});

oscPort.on("message", (oscMessage) => {
  console.log("Received OSC message:", oscMessage);
});

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

    // Route to send OSC "play" message
    app.post("/api/osc/play", (req, res) => {
      oscPort.send({
        address: "/play",
        args: [{ type: "i", value: 1 }],
      });
      res.status(200).json({ message: "OSC /play message sent successfully" });
    });

    // Route to send user information as JSON over OSC
    app.post("/api/osc/send-users", (req, res) => {
      const { users } = req.body;

      users.forEach((user) => {
        oscPort.send({
          address: "/user",
          args: [
            { type: "s", value: user.name },
            { type: "s", value: user.email },
            { type: "s", value: user.energy },
            { type: "s", value: user.element },
            { type: "s", value: user.essence },
          ],
        });
      });

      res.status(200).json({ message: "User information sent via OSC" });
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
