// models/Show.js

const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // Duración en minutos
    required: true,
  },
  endTime: {
    type: Date, // Hora de fin calculada automáticamente
  },
  clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencia al modelo User
      required: false,
    },
  ],
  photos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo", // Referencia al modelo Photo
    },
  ],
  status: {
    type: String,
    enum: ["creado", "ha sido reproducido"],
    default: "creado",
  },
});

// Middleware para calcular `endTime` antes de guardar el show
showSchema.pre("save", function (next) {
  this.endTime = new Date(this.startTime.getTime() + this.duration * 60000);
  next();
});

module.exports = mongoose.model("Show", showSchema);
