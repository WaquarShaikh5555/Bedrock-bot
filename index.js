const express = require("express");
const { statusBedrock } = require("minecraft-server-util");

const app = express();
const PORT = process.env.PORT || 3000;

// YOUR SERVER
const HOST = "brandsmp.progamer.me";
const PORT_MC = 23737;

// keep render alive
app.get("/", (req, res) => {
  res.send("Bot is alive");
});

app.listen(PORT, () => {
  console.log("Web alive on port", PORT);
});

// ping mc server every 30 sec
async function ping() {
  try {
    const res = await statusBedrock(HOST, PORT_MC);
    console.log(
      `ONLINE ${res.players.online}/${res.players.max}`
    );
  } catch (e) {
    console.log("MC server offline");
  }
}

setInterval(ping, 30000);
ping();
