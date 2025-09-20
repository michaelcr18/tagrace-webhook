const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/smarttag", async (req, res) => {
  console.log("📥 Received check-in:", req.body); // Log incoming data

  const payload = {
    tagId: req.body.tagId,
    location: req.body.location,
    battery: req.body.battery,
    status: req.body.status,
    timestamp: new Date().toISOString(),
    name: req.body.name || "Anonymous",
    photo: req.body.photo || "" // ✅ NEW: Include photo field
  };

  try {
    const response = await fetch("https://sheetdb.io/api/v1/fyyvku4q2tqb0", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [payload] }) // ✅ Wrap in { data: [...] } for SheetDB
    });

    const result = await response.json();
    console.log("📤 SheetDB response:", result); // Log outgoing result

    res.status(200).send("✅ Logged to SheetDB");
  } catch (err) {
    console.error("❌ Error forwarding to SheetDB:", err);
    res.status(500).send("Failed to log");
  }
});

app.get("/", (req, res) => {
  res.send("TagRace webhook is live.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
