const osc = require("osc");

const oscClient = new osc.UDPPort({
  localAddress: "127.0.0.1", // Adjusted to your requirements
  localPort: 57120,
  remoteAddress: "127.0.0.1", // TouchDesigner IP (localhost)
  remotePort: 7121, // TouchDesigner listening port
});

oscClient.open();

oscClient.on("ready", () => {
  console.log("OSC client is ready and sending to TouchDesigner on port 7121");
});

// Function to send play signal
exports.sendPlaySignal = (req, res) => {
  console.log("sendPlaySignal activated"); // Debug message
  console.log("Sending /play message with address /play and integer value 1"); // Detailed message

  oscClient.send(
    { address: "/play", args: [{ type: "i", value: 1 }] },
    (err) => {
      if (err) {
        console.error("Error sending /play:", err);
        return res.status(500).json({ message: "Error sending play signal" });
      }
      console.log("Play signal sent successfully"); // Confirmation message
      res.status(200).json({ message: "Play signal sent successfully" });
    }
  );
};

// Function to send user details in JSON format
exports.sendUserDetails = (req, res) => {
  console.log("sendUserDetails activated"); // Debug message
  const { showId, users } = req.body;
  if (!showId || !users) {
    console.error("Invalid input data for sendUserDetails");
    return res.status(400).json({ message: "Invalid input data" });
  }

  const userDetails = {
    showId: showId,
    users: users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      energy: user.energy,
      element: user.element,
      essence: user.essence,
    })),
  };

  console.log(
    "Sending /userDetails message:",
    JSON.stringify(userDetails, null, 2)
  ); // Detailed message with JSON format

  oscClient.send(
    {
      address: "/userDetails",
      args: [{ type: "s", value: JSON.stringify(userDetails) }],
    },
    (err) => {
      if (err) {
        console.error("Error sending /userDetails:", err);
        return res.status(500).json({ message: "Error sending user details" });
      }
      console.log("User details sent successfully"); // Confirmation message
      res.status(200).json({ message: "User details sent successfully" });
    }
  );
};
