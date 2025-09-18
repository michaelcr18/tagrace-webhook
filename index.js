const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const VERIFICATION_TOKEN = "mbombela-2025"; // You can change this to anything
const SHEETDB_URL = "https://sheetdb.io/api/v1/fyyvku4q2tqb0"; // Replace with your real SheetDB URL

app.post("/smarttag", async (req, res) => {
  const token = req.headers["x-webhook-token"];
  if (token !== VERIFICATION_TOKEN) {
    return res.status(403).send("Invalid token");
  }

  const { tagId, location, battery, status } = req.body;
  if (!tagId || !location) {
    return res.status(400).send("Missing tagId or location");
  }

  try {
  console.log("Received check-in:", { tagId, location, battery, status });
  res.send("Check-in received (not logged)");
} catch (err) {
  res.status(500).send("Error logging check-in");
}
});

app.listen(3000, () => {
  console.log("Webhook running on port 3000");
});
