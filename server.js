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

// Configuración de OSC
const oscPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57149,
  remoteAddress: "127.0.0.1",
  remotePort: 57150,
});

// Abre el puerto OSC
oscPort.open();

oscPort.on("ready", () => {
  console.log("OSC Server is ready and listening on port 57121");
});

oscPort.on("message", (oscMessage) => {
  console.log("Received OSC message:", oscMessage);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Habilitar CORS
app.use(cors({ origin: "*" }));

// Conectar a la base de datos
connectDB()
  .then(() => {
    // Middleware para analizar JSON
    app.use(express.json());

    // Middleware para servir archivos estáticos (CSS y JS)
    app.use(express.static(path.join(__dirname, "public")));

    // Configurar rutas de la API
    app.use("/api/users", userRoutes);
    app.use("/api/shows", showRoutes);
    app.use("/api/photos", photoRoutes);

    // Rutas de las páginas HTML
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

    // Ruta para enviar mensaje OSC de "play"
    app.post("/api/osc/play", (req, res) => {
      oscPort.send({
        address: "/play",
        args: [{ type: "i", value: 1 }],
      });
      res.status(200).json({ message: "Mensaje OSC /play enviado con éxito" });
    });

    // Ruta para enviar información de los usuarios en formato JSON por OSC
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

      res
        .status(200)
        .json({ message: "Información de usuarios enviada por OSC" });
    });

    // Manejo de errores 404
    app.use((req, res) => {
      res.status(404).json({ message: "Ruta no encontrada" });
    });

    // Middleware de manejo de errores
    app.use((err, req, res, next) => {
      console.error("Error del servidor:", err.stack);
      res.status(500).json({ message: "Error en el servidor" });
    });

    // Iniciar el servidor
    const server = app.listen(PORT, () => {
      console.log(`Servidor en ejecución en http://localhost:${PORT}`);
    });

    // Exportar la instancia de la app y el servidor para pruebas
    module.exports = { app, server };
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err.message);
    process.exit(1);
  });
