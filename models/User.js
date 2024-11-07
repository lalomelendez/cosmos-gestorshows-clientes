// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // No permitir correos duplicados
  },
  energy: {
    type: String,
    enum: ["lunar", "solar"], // Valores permitidos
    required: true,
  },
  element: {
    type: String,
    enum: ["agua", "fuego", "tierra", "aire"], // Valores permitidos
    required: true,
  },
  essence: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "en espera", // Estado por defecto
  },
  show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", default: null }, // Referencia al ID de un show
});

module.exports = mongoose.model("User", userSchema);
