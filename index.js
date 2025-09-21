const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/smarttag", async (req, res) => {
  const payload = req.body;

  console.log("📦 Incoming payload:", payload);

  try {
    const sheetRes = await fetch("https://sheetdb.io/api/v1/fyyvku4q2tqb0", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: payload })
    });

    const sheetData = await sheetRes.json();
    console.log("✅ Forwarded to SheetDB:", sheetData);

    res.status(200).send("Check-in logged successfully");
  } catch (err) {
    console.error("❌ Error forwarding to SheetDB:", err);
    res.status(500).send("Error forwarding to SheetDB");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
});
