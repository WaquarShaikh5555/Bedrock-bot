const RakNet = require("raknet-native");
const fs = require("fs");
const express = require("express");

const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

let client = null;
let connectedOnce = false;
let reconnecting = false;

/* ===== KEEP RENDER ALIVE ===== */
const app = express();
app.get("/", (req, res) => res.send("Bot alive"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("[BOT] Keep-alive server running on port", PORT);
});
/* ============================ */

function connect() {
  if (reconnecting) return;

  reconnecting = true;
  console.log("[BOT] Attempting to connect...");

  client = new RakNet.Client();

  client.connect(
    config.server.host,
    config.server.port,
    () => {
      connectedOnce = true;
      reconnecting = false;
      console.log("[BOT] Connected and spawned");
    }
  );

  client.on("disconnect", () => {
    console.log("[BOT] Disconnected");

    // DO NOT reconnect during first Microsoft sign-in
    if (!connectedOnce) {
      console.log("[BOT] Waiting for first sign-in, no reconnect");
      return;
    }

    if (!reconnecting) {
      reconnecting = true;
      console.log("[BOT] Reconnecting in 8 seconds...");
      setTimeout(() => {
        reconnecting = false;
        connect();
      }, config.bot.reconnectDelay);
    }
  });

  client.on("error", err => {
    console.log("[BOT] Error:", err.message);
  });
}

connect();
