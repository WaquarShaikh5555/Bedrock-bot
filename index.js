const { createClient } = require('bedrock-protocol');

// === CONFIG ===
const SERVER_IP = "brandsmp.progamer.me";  // replace with your PowerupStack server IP
const SERVER_PORT = 23737;
const BOT_NAME = "Server";

// Start bot function
function startBot() {
  const client = createClient({
    host: SERVER_IP,
    port: SERVER_PORT,
    username: BOT_NAME
  });

  // On disconnect, auto reconnect
  client.on('disconnect', () => {
    console.log("Disconnected! Reconnecting in 10 seconds...");
    setTimeout(startBot, 10000);
  });

  client.on('error', err => console.log("Error:", err));

  // Random movement every 5–10 min
  setInterval(() => {
    const dx = Math.floor(Math.random() * 3) - 1;
    const dz = Math.floor(Math.random() * 3) - 1;
    client.queue('move', { x: dx, y: 0, z: dz });
    console.log("Random movement sent");
  }, Math.floor(Math.random() * 300000) + 300000); // 5–10 min

  console.log("Bot connected and running...");
}

// Start the bot
startBot();
