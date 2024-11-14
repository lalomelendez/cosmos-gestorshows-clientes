const osc = require("osc");

const oscClient = new osc.UDPPort({
  localAddress: "127.0.0.1",
  localPort: 57120,
  remoteAddress: "127.0.0.1", // IP address of TouchDesigner
  remotePort: 7121,
});

oscClient.open();

oscClient.on("ready", () => {
  console.log("OSC client is ready and sending to TouchDesigner on port 7121");

  // Send /ping message every 5 seconds
  setInterval(() => {
    //console.log("Sending /ping message");
    oscClient.send({ address: "/ping", args: [] }, (err) => {
      if (err) console.error("Error sending /ping:", err);
      //else console.log("/ping message sent");
    });
  }, 5000);
});

// Function to send play signal
const sendPlaySignal = (req, res) => {
  console.log("Sending /play OSC message");
  oscClient.send(
    { address: "/play", args: [{ type: "i", value: 1 }] },
    (err) => {
      if (err) {
        console.error("Error sending /play:", err);
        return res.status(500).json({ message: "Error sending play signal" });
      }
      console.log("Play signal sent successfully");
      res.status(200).json({ message: "Play signal sent successfully" });
    }
  );
};

// Function to send user details
const sendUserDetails = (req, res) => {
  const { showId, users } = req.body;
  if (!showId || !users) {
    console.error("Invalid input data");
    return res.status(400).json({ message: "Invalid input data" });
  }

  const userDetails = {
    showId,
    users: users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      energy: user.energy,
      element: user.element,
      essence: user.essence,
    })),
  };

  console.log("Sending /userDetails OSC message:", JSON.stringify(userDetails));

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
      console.log("User details sent successfully");
      res.status(200).json({ message: "User details sent successfully" });
    }
  );
};

// Export all functions
module.exports = {
  sendPlaySignal,
  sendUserDetails,
};
