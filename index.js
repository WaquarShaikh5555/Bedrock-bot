const express = require("express");
const ping = require("bedrock-ping");
const config = require("./config.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot alive");
});

app.listen(PORT, () => {
  console.log("[WEB] Alive on port", PORT);
});

async function pingServer() {
  try {
    const res = await ping({
      host: config.host,
      port: config.port
    });

    console.log(
      `[PING] Online | Players: ${res.playersOnline}/${res.playersMax}`
    );
  } catch (err) {
    console.log("[PING] Server offline or unreachable");
  }
}

setInterval(pingServer, config.pingInterval);
pingServer();
