const osc = require('osc');

// Create an OSC UDP port to listen for incoming messages
const oscServer = new osc.UDPPort({
  localAddress: "127.0.0.1", // Local address to listen on
  localPort: 57120, // Changed port to avoid conflict
});

// Open the OSC UDP port
oscServer.open();

// Log received messages to the console
oscServer.on("message", (oscMessage) => {
  console.log("Received OSC message:", oscMessage);
});