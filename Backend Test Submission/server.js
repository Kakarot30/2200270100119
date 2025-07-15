// server.js
// Express backend for URL Shortener Microservice

const express = require("express");
const bodyParser = require("body-parser");
const { Log } = require("../Logging Middleware/loggingMiddleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// In-memory store for URLs and stats (for demo; use DB in production)
const urlStore = {};
const statsStore = {};

// Helper: Generate unique shortcode
function generateShortcode(length = 6) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  do {
    code = Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  } while (urlStore[code]);
  return code;
}

// POST /shorturls - Create Short URL
app.post("/shorturls", async (req, res) => {
  await Log("backend", "info", "route", "POST /shorturls called");
  const { url, validity = 30, shortcode } = req.body;

  // Input validation
  if (!url || typeof url !== "string") {
    await Log("backend", "error", "handler", "Invalid or missing URL");
    return res.status(400).json({ error: "Invalid or missing URL" });
  }
  let code = shortcode;
  if (code) {
    if (!/^[a-zA-Z0-9]{4,}$/.test(code) || urlStore[code]) {
      await Log(
        "backend",
        "error",
        "handler",
        "Invalid or duplicate shortcode"
      );
      return res.status(400).json({ error: "Invalid or duplicate shortcode" });
    }
  } else {
    code = generateShortcode();
  }

  const now = new Date();
  const expiry = new Date(now.getTime() + validity * 60000);
  urlStore[code] = { url, expiry, created: now };
  statsStore[code] = statsStore[code] || { clicks: 0, clicksData: [] };

  await Log("backend", "info", "route", `Short URL created: ${code}`);
  res.status(201).json({
    shortLink: `${req.protocol}://${req.get("host")}/${code}`,
    expiry: expiry.toISOString(),
  });
});

// GET /shorturls/:shortcode - Get stats
app.get("/shorturls/:shortcode", async (req, res) => {
  await Log("backend", "info", "route", "GET /shorturls/:shortcode called");
  const { shortcode } = req.params;
  const urlData = urlStore[shortcode];
  if (!urlData) {
    await Log("backend", "error", "handler", "Shortcode not found");
    return res.status(404).json({ error: "Shortcode not found" });
  }
  const stats = statsStore[shortcode] || { clicks: 0, clicksData: [] };
  res.json({
    url: urlData.url,
    created: urlData.created,
    expiry: urlData.expiry,
    totalClicks: stats.clicks,
    clicks: stats.clicksData,
  });
});

// Redirect handler
app.get("/:shortcode", async (req, res) => {
  const { shortcode } = req.params;
  const urlData = urlStore[shortcode];
  if (!urlData) {
    await Log(
      "backend",
      "error",
      "handler",
      "Shortcode not found for redirect"
    );
    return res.status(404).json({ error: "Shortcode not found" });
  }
  if (new Date() > urlData.expiry) {
    await Log("backend", "warn", "handler", "Shortcode expired");
    return res.status(410).json({ error: "Shortcode expired" });
  }
  // Log click
  statsStore[shortcode].clicks++;
  statsStore[shortcode].clicksData.push({
    timestamp: new Date(),
    referrer: req.get("referer") || "",
    ip: req.ip,
  });
  await Log("backend", "info", "route", `Redirected to ${urlData.url}`);
  res.redirect(urlData.url);
});

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "URL Shortener Service is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
