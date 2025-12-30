const bedrock = require('bedrock-protocol')

const OPTIONS = {
  host: 'brandsmp.progamer.me', // your server
  port: 23737,
  username: 'Server', // bot gamertag
  auth: 'microsoft',
  version: '1.21.130'
}

let client = null
let connecting = false
let hasSpawned = false

function log(msg) {
  console.log(`[BOT] ${msg}`)
}

async function connect() {
  if (connecting) return
  connecting = true
  hasSpawned = false

  try {
    log('Attempting to connect...')
    client = bedrock.createClient(OPTIONS)

    client.on('spawn', () => {
      log('Connected and spawned')
      connecting = false
      hasSpawned = true
    })

    client.on('disconnect', () => {
      log('Disconnected')
      reconnect()
    })

    client.on('kick', (reason) => {
      log('Kicked: ' + JSON.stringify(reason))
      reconnect()
    })

    client.on('error', (err) => {
      log('Error: ' + err.message)
      reconnect()
    })

  } catch (e) {
    log('Connect failed: ' + e.message)
    reconnect()
  }
}

// FORCE reconnect no matter what
function reconnect() {
  connecting = false
  try {
    if (client) client.close()
  } catch {}
  client = null

  setTimeout(() => {
    connect()
  }, 5000)
}

// WATCHDOG — only triggers after first spawn
setInterval(() => {
  if (hasSpawned && (!client || !client.player || !client.player.entity)) {
    log('Watchdog triggered reconnect')
    reconnect()
  }
}, 5000)

// NEVER let process die
process.on('uncaughtException', err => {
  log('Uncaught Exception: ' + err.message)
  reconnect()
})

process.on('unhandledRejection', err => {
  log('Unhandled Rejection')
  reconnect
