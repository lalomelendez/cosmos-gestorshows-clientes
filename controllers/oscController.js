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
    oscClient.send({ address: "/ping", args: [] }, (err) => {
      if (err) console.error("Error sending /ping:", err);
    });
  }, 5000);
});

// Equivalence tables for encoding
const equivalenceTables = {
  energy: {
    lunar: 1,
    solar: 0,
  },
  element: {
    agua: 0,
    fuego: 1,
    tierra: 2,
    aire: 3,
  },
  essence: {
    jaguar: 0,
    dalia: 1,
    colibri: 2,
    ajolote: 3,
    estrella: 4,
    agave: 5,
    aguila: 6,
    coyote: 7,
    flecha: 8,
    ceiba: 9,
    pluma: 10,
    medusa: 11,
  },
};

// Function to send play signal with language
const sendPlaySignal = (req, res) => {
  const { language } = req.body;

  // Validate language
  if (!language || !["en", "es"].includes(language)) {
    return res.status(400).json({
      message: 'Invalid language. Must be "en" or "es"',
    });
  }

  console.log(`Sending /play OSC message with language: ${language}`);

  oscClient.send(
    {
      address: "/play",
      args: [
        { type: "i", value: 1 },
        { type: "s", value: language },
      ],
    },
    (err) => {
      if (err) {
        console.error("Error sending /play:", err);
        return res.status(500).json({ message: "Error sending play signal" });
      }
      console.log("Play signal sent successfully");
      res.status(200).json({
        message: "Play signal sent successfully",
        language: language,
      });
    }
  );
};

// Function to send user details as an encoded array
const sendUserDetails = (req, res) => {
  const { showId, users } = req.body;
  if (!showId || !users) {
    console.error("Invalid input data");
    return res.status(400).json({ message: "Invalid input data" });
  }

  // Encode user details into an array of integers
  const encodedData = [users.length]; // Start with the number of users
  users.forEach((user) => {
    const energyValue = equivalenceTables.energy[user.energy] ?? -1;
    const elementValue = equivalenceTables.element[user.element] ?? -1;
    const essenceValue = equivalenceTables.essence[user.essence] ?? -1;

    if (energyValue === -1 || elementValue === -1 || essenceValue === -1) {
      console.error("Error encoding user details due to invalid value");
      return res.status(400).json({ message: "Error encoding user details" });
    }

    encodedData.push(energyValue, elementValue, essenceValue);
  });

  console.log(
    "Sending /userDetails OSC message with encoded data:",
    encodedData
  );

  oscClient.send(
    {
      address: "/userDetails",
      args: encodedData.map((value) => ({ type: "i", value })),
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
