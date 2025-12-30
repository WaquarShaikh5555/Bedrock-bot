const bedrock = require('bedrock-protocol')

const OPTIONS = {
  host: 'brandsmp.progamer.me',
  port: 23737,
  username: 'BOT_NAME_HERE', // Replace with bot gamertag
  auth: 'microsoft',
  version: '1.21.130'
}

let client = null
let connecting = false
let spawned = false // Only true once bot has successfully spawned

function log(msg) {
  console.log(`[BOT] ${msg}`)
}

async function connect() {
  if (connecting) return
  connecting = true

  try {
    log('Attempting to connect...')
    client = bedrock.createClient(OPTIONS)

    client.on('spawn', () => {
      log('Connected and spawned')
      connecting = false
      spawned = true
    })

    client.on('disconnect', () => {
      log('Disconnected')
      spawned = false
      reconnect()
    })

    client.on('kick', (reason) => {
      log('Kicked: ' + JSON.stringify(reason))
      spawned = false
      reconnect()
    })

    client.on('error', (err) => {
      log('Error: ' + err.message)
      spawned = false
      reconnect()
    })

  } catch (e) {
    log('Connect failed: ' + e.message)
    spawned = false
    reconnect()
  }
}

function reconnect() {
  connecting = false
  try { if (client) client.close() } catch {}
  client = null
  setTimeout(connect, 5000)
}

// Watchdog triggers only after first spawn
setInterval(() => {
  if (spawned && (!client || !client.player || !client.player.entity)) {
    log('Watchdog triggered reconnect')
    reconnect()
  }
}, 5000)

// Never let process die
process.on('uncaughtException', err => {
  log('Uncaught Exception: ' + err.message)
  reconnect()
})

process.on('unhandledRejection', err => {
  log('Unhandled Rejection')
  reconnect()
})

// START
connect()
