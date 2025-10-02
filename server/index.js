import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const OWM = "https://api.openweathermap.org/data/2.5";
const KEY = process.env.OWM_API_KEY;

if (!KEY) {
  console.warn("Missing OWM_API_KEY in .env");
}

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    endpoints: ["/api/weather?city=London", "/api/forecast?city=London"],
  });
});

app.get("/api/weather", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "city is required" });
    const r = await fetch(
      `${OWM}/weather?q=${encodeURIComponent(city)}&appid=${KEY}&units=metric`
    );
    if (!r.ok) return res.status(r.status).json({ error: "City not found" });
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/forecast", async (req, res) => {
  try {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "city is required" });
    const r = await fetch(
      `${OWM}/forecast?q=${encodeURIComponent(city)}&appid=${KEY}&units=metric`
    );
    if (!r.ok) return res.status(r.status).json({ error: "City not found" });
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/reverse-geocode", async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon)
      return res.status(400).json({ error: "lat and lon are required" });
    const r = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${KEY}`
    );
    if (!r.ok)
      return res.status(r.status).json({ error: "Location not found" });
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5174;
app.listen(PORT, () =>
  console.log(`Proxy listening on http://localhost:${PORT}`)
);
