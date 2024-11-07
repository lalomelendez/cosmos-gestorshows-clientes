// config/db.js

const mongoose = require("mongoose");
require("dotenv").config(); // Asegúrate de que dotenv esté instalado

// URL de conexión a MongoDB
const uri = "mongodb://localhost:27017/cosmos";

const connectDB = async () => {
  try {
    await mongoose.connect(uri); // Conexión sin opciones obsoletas
    console.log("MongoDB conectado exitosamente");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1); // Salir si hay un error
  }
};

module.exports = connectDB;
