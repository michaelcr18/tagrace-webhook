const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const SHEETDB_URL = "https://sheetdb.io/api/v1/fyyvku4q2tqb0";
const VERIFICATION_TOKEN = "your-token-here"; // Replace with your actual token

app.post("/smarttag", async (req, res) => {
  const token = req.headers["x-webhook-token"];
  if (token !== VERIFICATION_TOKEN) {
    return res.status(403).send("Invalid token");
  }

  const { tagId, location, battery, status } = req.body;
  if (!tagId || !location || !battery || !status) {
    return res.status(400).send("Missing fields");
  }

  try {
    await axios.post(SHEETDB_URL, {
      data: [{ TagID: tagId, Location: location, Battery: battery, Status: status }]
    });
    res.status(200).send("Check-in logged");
  } catch (err) {
    res.status(500).send("SheetDB error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("SmartTag webhook running");
});
