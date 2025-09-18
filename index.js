const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Replace with your actual SheetDB endpoint
const SHEETDB_URL = "https://sheetdb.io/api/v1/fyyvku4q2tqb0";

// Your webhook verification token
const VERIFICATION_TOKEN = "mbombela-2025";

app.post("/smarttag", async (req, res) => {
  const { tagId, location, battery, status } = req.body;
  const token = req.headers["x-webhook-token"];

  if (token !== VERIFICATION_TOKEN) {
    return res.status(403).send("Invalid token");
  }

  if (!tagId || !location) {
    return res.status(400).send("Missing tagId or location");
  }

  try {
    console.log("Received check-in:", tagId, location, battery, status);

    await axios.post(SHEETDB_URL, {
  data: [
    {
      tagId,
      location,
      battery,
      status,
      timestamp: new Date().toISOString()
    }
  ]
});


    res.send("Check-in logged to SheetDB");
  } catch (err) {
    console.error("Error logging to SheetDB:", err.response?.data || err.message);
    res.status(500).send("Error logging check-in");
  }
});

app.listen(3000, () => {
  console.log("Webhook running on port 3000");
});
