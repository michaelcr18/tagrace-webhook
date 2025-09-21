<!DOCTYPE html>
<html>
<head>
  <title>TagRace GPS Check-In</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: sans-serif;
      text-align: center;
      padding: 2em;
      background: url('tagrace-bg.png') no-repeat center center fixed;
      background-size: cover;
      color: white;
    }
    input, button, label {
      font-size: 1em;
      padding: 0.6em 1em;
      margin-top: 1em;
      border: 2px solid white;
      border-radius: 6px;
      background-color: transparent;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    input[type="text"] {
      width: 80%;
      max-width: 300px;
      color: white;
      background-color: rgba(255,255,255,0.1);
    }
    input::placeholder {
      color: white;
      opacity: 1;
    }
    input[type="file"] {
      display: none;
    }
    label.custom-file-button:hover,
    button:hover {
      background-color: rgba(255, 255, 255, 0.1);
      box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
    }
    label.custom-file-button:active,
    button:active {
      transform: scale(0.98);
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.6);
    }
    #status {
      margin-top: 1.5em;
      font-size: 1em;
    }
    #description {
      font-size: 1em;
      margin-bottom: 1.5em;
      line-height: 1.5;
      background: rgba(0,0,0,0.5);
      padding: 1em;
      border-radius: 8px;
      display: inline-block;
    }
    #location-info {
      margin-top: 1em;
      font-size: 1em;
      background: rgba(0,0,0,0.5);
      padding: 1em;
      border-radius: 8px;
      display: inline-block;
    }
    @keyframes flashBolt {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(1.2); }
    }
    #status.flash {
      animation: flashBolt 1s infinite;
    }
    .checkin-button {
      background-color: #00ff66;
      color: black;
      border: none;
      padding: 0.8em 1.5em;
      font-size: 1.1em;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 0 15px rgba(0,255,100,0.8);
      animation: glowPulse 1.5s infinite;
    }
    @keyframes glowPulse {
      0% { box-shadow: 0 0 10px rgba(0,255,100,0.6); transform: scale(1); }
      50% { box-shadow: 0 0 25px rgba(0,255,100,1); transform: scale(1.05); }
      100% { box-shadow: 0 0 10px rgba(0,255,100,0.6); transform: scale(1); }
    }
  </style>
</head>
<body>
  <h1>TagRace GPS Check-In</h1>

  <p id="description">
    🌍 Suzie the Hippo is part of <strong>TagRace</strong>—a global adventure tracking real-world movement.<br>
    She is currently on a journey to <strong>Hope, Canada</strong>, carried by players, travelers, and dreamers.<br>
    You are now part of the journey! Every check-in helps trace her path across continents. After moving her along, leave her in a safe space for the next person to find.<br><br>
    🏁 <strong>Help her reach her final destination!</strong>
  </p>

  <input type="text" id="name" placeholder="Your name (optional)">
  <br>
  <label for="photo" class="custom-file-button">📸 Add Photo</label>
  <input type="file" id="photo" accept="image/*" capture="environment">
  <br>

  <button class="checkin-button" onclick="getLocation()">⚡ Click to update Suzie's location!</button>
  <div id="status" class="flash">⚡ Waiting for check-in…</div>

  <a href="map.html" target="_blank">
    <button>🗺️ View her Journey!</button>
  </a>

  <div id="location-info">📍 Loading last known location…</div>

  <p style="margin-top: 2em; font-size: 0.9em; color: white; opacity: 0.8;">
    📸 Follow <strong>#TagRaceZA</strong> on Instagram to see the global journey unfold.
  </p>

  <script>
    async function getLocation() {
      const status = document.getElementById("status");
      status.innerText = "📡 Uploading photo…";

      const photoInput = document.getElementById("photo");
      const file = photoInput.files[0];
      let photoUrl = "";

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("UPLOADCARE_STORE", "1");
        formData.append("UPLOADCARE_PUB_KEY", "b6fd2347b271da80d239");

        try {
          const res = await fetch("https://upload.uploadcare.com/base/", {
            method: "POST",
            body: formData
          });
          const data = await res.json();
          photoUrl = data.cdnUrl || "";
        } catch (err) {
          console.error("❌ Photo upload failed:", err);
        }
      }

      status.innerText = "📡 Getting location…";

      if (!navigator.geolocation) {
        status.innerText = "❌ Geolocation not supported.";
        return;
      }

      navigator.geolocation.getCurrentPosition(async position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const location = `${lat},${lon}`;
        const nameInput = document.getElementById("name").value.trim();
        const name = nameInput || "Anonymous";

        const payload = {
          tagId: "ZA-004",
          location,
          battery: "3.8V",
          status: "active",
          timestamp: new Date().toISOString(),
          name,
          photo: photoUrl
        };

        await sendPayload(payload);
      }, err => {
        status.innerText = "❌ Location error: " + err.message;
      });
    }

    async function sendPayload(payload) {
      const status = document.getElementById("status");
      status.innerText = "📡 Sending check-in…";

      try {
        const res = await fetch("https://tagrace-webhook.onrender.com/smarttag", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          status.innerText = "✅ Check-in successful!";
          status.classList.remove("flash");
        } else {
          const text = await res.text();
          status.innerText = `❌ Server error: ${text}`;
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        status.innerText = "❌ Network error: " + err.message;
      }
    }
  </script>
</body>
</html>
