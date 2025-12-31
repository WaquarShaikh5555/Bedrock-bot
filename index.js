const bedrock = require('bedrock-protocol')
const express = require('express')

const app = express()
app.get('/', (_, res) => res.send('Bot alive'))
app.listen(process.env.PORT || 3000)

const OPTIONS = {
  host: 'brandsmp.progamer.me',
  port: 23737,
  username: 'Server',
  auth: 'microsoft',
  version: '1.21.130'
}

let client
let reconnecting = false

function connect() {
  if (reconnecting) return
  reconnecting = true

  console.log('[BOT] Connecting...')

  client = bedrock.createClient(OPTIONS)

  client.once('spawn', () => {
    console.log('[BOT] Spawned successfully')
    reconnecting = false
  })

  client.on('disconnect', () => retry())
  client.on('error', () => retry())
  client.on('kick', () => retry())
}

function retry() {
  if (reconnecting) return
  reconnecting = true

  console.log('[BOT] Reconnecting in 8 seconds...')
  try { client?.close() } catch {}

  setTimeout(() => {
    reconnecting = false
    connect()
  }, 8000)
}

connect()
