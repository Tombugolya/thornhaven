import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { WebSocketServer } from 'ws'

function wsRelayPlugin() {
  return {
    name: 'thornhaven-ws-relay',
    configureServer(server) {
      const wss = new WebSocketServer({ noServer: true })
      const clients = new Map() // ws -> role

      server.httpServer.on('upgrade', (req, socket, head) => {
        if (req.url?.startsWith('/relay')) {
          wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req)
          })
        }
      })

      wss.on('connection', (ws, req) => {
        const url = new URL(req.url, 'http://localhost')
        const role = url.searchParams.get('role') || 'player'
        clients.set(ws, role)
        console.log(`[Thornhaven] ${role} connected (${clients.size} total)`)

        // Tell DM how many players are connected
        broadcastPlayerCount()

        ws.on('message', (data) => {
          const msg = data.toString()
          // Relay to all other clients (bidirectional for token moves)
          for (const [client] of clients) {
            if (client !== ws && client.readyState === 1) {
              client.send(msg)
            }
          }
        })

        ws.on('close', () => {
          clients.delete(ws)
          console.log(`[Thornhaven] ${role} disconnected (${clients.size} total)`)
          broadcastPlayerCount()
        })
      })

      function broadcastPlayerCount() {
        const playerCount = [...clients.values()].filter(r => r === 'player').length
        const msg = JSON.stringify({ type: 'playerCount', count: playerCount })
        for (const [client, role] of clients) {
          if (role === 'dm' && client.readyState === 1) {
            client.send(msg)
          }
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), wsRelayPlugin()],
  server: {
    host: true,
    allowedHosts: ['.trycloudflare.com'],
  },
})
