const bedrock = require('bedrock-protocol');

const OPTIONS = {
  host: 'brandsmp.progamer.me', // your server
  port: 23737,
  username: 'Server', // bot gamertag
  auth: 'microsoft', // keep Microsoft account logged in
  version: '1.21.130'
};

let client = null;
let connecting = false;
let wasConnected = false; // smarter watchdog

function log(msg) {
  console.log(`[BOT] ${msg}`);
}

async function connect() {
  if (connecting) return;
  connecting = true;

  try {
    log('Attempting to connect...');
    client = bedrock.createClient(OPTIONS);

    client.on('spawn', () => {
      log('Connected and spawned');
      connecting = false;
      wasConnected = true;
    });

    client.on('disconnect', () => {
      log('Disconnected');
      reconnect();
    });

    client.on('kick', (reason) => {
      log('Kicked: ' + JSON.stringify(reason));
      reconnect();
    });

    client.on('error', (err) => {
      log('Error: ' + err.message);
      reconnect();
    });

  } catch (e) {
    log('Connect failed: ' + e.message);
    reconnect();
  }
}

// FORCE reconnect no matter what
function reconnect() {
  connecting = false;
  try { if (client) client.close(); } catch {}
  client = null;

  setTimeout(() => {
    connect();
  }, 5000); // reconnect after 5 seconds
}

// SMART WATCHDOG — only triggers if previously connected
setInterval(() => {
  if (client && client.player && client.player.entity) {
    wasConnected = true; // bot alive
  } else if (wasConnected) {
    log('Watchdog triggered reconnect');
    reconnect();
    wasConnected = false;
  }
}, 8000); // check every 8 seconds

// NEVER let process die
process.on('uncaughtException', err => {
  log('Uncaught Exception: ' + err.message);
  reconnect();
});

process.on('unhandledRejection', err => {
  log('Unhandled Rejection');
  reconnect();
});

// START
connect();
