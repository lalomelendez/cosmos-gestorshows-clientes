const osc = require('osc'); // Ensure osc is required at the top of the file

const oscClient = new osc.UDPPort({
  remoteAddress: "127.0.0.1", // Dirección del servidor OSC de destino
  remotePort: 57121, // Puerto del servidor OSC
});
oscClient.open();

// Function to send a constant ping OSC message
const sendPing = () => {
  oscClient.send({ address: "/ping", args: [] }, (err) => {
    if (err) {
      console.error("Error sending ping:", err);
    }
  });
};

// Set interval to send ping every 5 seconds
setInterval(sendPing, 5000);

// Enviar señal de inicio de show (mensaje OSC /play, 1)
exports.sendPlaySignal = (req, res) => {
  oscClient.send({ address: "/play", args: 1 }, (err) => {
    if (err) {
      console.error("Error sending play signal:", err);
      return res.status(500).json({ message: "Error sending play signal" });
    }
    res.status(200).json({ message: "Señal de inicio enviada correctamente" });
  });
};

// Enviar detalles de los usuarios asignados en formato JSON
exports.sendUserDetails = (req, res) => {
  const { showId, users } = req.body;

  if (!showId || !users) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  oscClient.send({
    address: "/userDetails",
    args: [
      { type: "i", value: showId },
      { type: "s", value: JSON.stringify(users) }
    ]
  }, (err) => {
    if (err) {
      console.error("Error sending user details:", err);
      return res.status(500).json({ message: "Error sending user details" });
    }
    res.status(200).json({ message: "Detalles de usuarios enviados correctamente" });
  });
};