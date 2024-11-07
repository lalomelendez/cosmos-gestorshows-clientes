// models/Photo.js

const mongoose = require("mongoose");

const photoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true, // URL o ruta de la foto almacenada
  },
  show: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show", // Referencia al show en el que fue tomada la foto
    required: true,
  },
  clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencia a los clientes que aparecen en la foto
    },
  ],
  takenAt: {
    type: Date,
    default: Date.now, // Fecha y hora en que se tomó la foto
  },
});

module.exports = mongoose.model("Photo", photoSchema);
