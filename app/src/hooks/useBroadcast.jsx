import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'

const BroadcastContext = createContext(null)

export function BroadcastProvider({ role, children }) {
  const wsRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [playerCount, setPlayerCount] = useState(0)
  const [lastMessage, setLastMessage] = useState(null)
  const reconnectTimer = useRef(null)

  const connect = useCallback(() => {
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const ws = new WebSocket(`${proto}://${window.location.host}/relay?role=${role}`)

    ws.onopen = () => {
      setConnected(true)
      console.log(`[Thornhaven] Connected as ${role}`)
    }

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'playerCount') {
          setPlayerCount(data.count)
        } else {
          setLastMessage(data)
        }
      } catch {}
    }

    ws.onclose = () => {
      setConnected(false)
      reconnectTimer.current = setTimeout(connect, 2000)
    }

    ws.onerror = () => ws.close()

    wsRef.current = ws
  }, [role])

  useEffect(() => {
    connect()
    return () => {
      clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === 1) {
      wsRef.current.send(JSON.stringify(data))
    }
  }, [])

  const showToPlayer = useCallback((type, id, extra = {}) => {
    send({ type, id, ...extra, timestamp: Date.now() })
  }, [send])

  const clearPlayer = useCallback(() => {
    send({ type: 'clear', timestamp: Date.now() })
  }, [send])

  return (
    <BroadcastContext.Provider value={{
      connected,
      playerCount,
      lastMessage,
      showToPlayer,
      clearPlayer,
      role,
    }}>
      {children}
    </BroadcastContext.Provider>
  )
}

export function useBroadcast() {
  return useContext(BroadcastContext)
}
