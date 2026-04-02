import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  onValue,
  onChildAdded,
  onDisconnect,
  off,
  query,
  orderByChild,
  startAfter,
} from "firebase/database"
import { db } from "../firebase"
import type {
  BroadcastContextValue,
  BroadcastRole,
  BroadcastMessage,
  SessionState,
  PlayerInfo,
} from "../types/broadcast"

const BroadcastContext = createContext<BroadcastContextValue | null>(null)

const ALPHABET = "ABCDEFGHJKMNPQRTUVWXY2346789"

function generateRoomCode(len = 5) {
  return Array.from(
    { length: len },
    () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
  ).join("")
}

function generatePlayerId() {
  return "p-" + Math.random().toString(36).slice(2, 10)
}

// Derive state updates from a message type
function getStateUpdates(
  type: string,
  id: string | null,
  extra: Record<string, unknown>,
): Record<string, unknown> | null {
  switch (type) {
    case "location":
    case "character":
    case "combat":
      return { currentDisplay: { type, id }, currentMap: null }
    case "handout":
      return {
        currentDisplay: { type, id },
        currentMap: null,
        [`revealedHandouts/${id}`]: true,
      }
    case "map":
      return {
        currentDisplay: null,
        currentMap: id,
        revealedTokens: null,
        tokenPositions: null,
        tokenConditions: null,
        activeTurnToken: null,
      }
    case "reveal":
      return { [`revealedTokens/${extra.tokenId}`]: true }
    case "move":
      return { [`tokenPositions/${extra.tokenId}`]: { x: extra.x, y: extra.y } }
    case "kill":
      return { [`killedTokens/${extra.tokenId}`]: true }
    case "revive":
      return { [`killedTokens/${extra.tokenId}`]: null }
    case "conditions":
      return { [`tokenConditions/${extra.tokenId}`]: extra.conditions || null }
    case "activeTurn":
      return { activeTurnToken: extra.tokenId || null }
    case "mood":
      return { mood: extra.mood }
    case "clear":
      return { currentDisplay: null, currentMap: null }
    case "battleWon":
      return {
        [`completedEncounters/${extra.encounterName || id}`]: true,
        revealedTokens: null,
        killedTokens: null,
        tokenPositions: null,
        tokenConditions: null,
        activeTurnToken: null,
      }
    default:
      return null
  }
}

interface BroadcastProviderProps {
  role: BroadcastRole
  roomCode?: string
  playerName?: string
  dmUid?: string
  campaignId?: string
  children: ReactNode
}

export function BroadcastProvider({
  role,
  roomCode: roomCodeProp,
  playerName,
  dmUid,
  campaignId,
  children,
}: BroadcastProviderProps) {
  const [connected, setConnected] = useState(false)
  const [players, setPlayers] = useState<Record<string, PlayerInfo>>({})
  const [lastMessage, setLastMessage] = useState<BroadcastMessage | null>(null)
  const [sessionState, setSessionState] = useState<SessionState | null>(null)
  const [roomCode] = useState(() => roomCodeProp || generateRoomCode())
  const isRealSession = Boolean(roomCodeProp) // Only true when an explicit room code was provided
  const playerIdRef = useRef(generatePlayerId())
  const lastActiveRef = useRef(0)
  const mountTimeRef = useRef(Date.now())

  const playerCount = Object.keys(players).length

  // --- Session meta writes (DM only) ---
  const writeSessionMeta = useCallback(() => {
    if (role !== "dm" || !roomCode || !dmUid) return
    const now = Date.now()
    const meta = { campaignId, dmUid, createdAt: now, lastActive: now }
    set(ref(db, `rooms/${roomCode}/meta`), meta)
    set(ref(db, `dmSessions/${dmUid}/${roomCode}`), meta)
  }, [role, roomCode, dmUid, campaignId])

  const updateLastActive = useCallback(() => {
    if (role !== "dm" || !roomCode || !dmUid) return
    const now = Date.now()
    if (now - lastActiveRef.current < 60000) return // throttle to once/min
    lastActiveRef.current = now
    update(ref(db, `rooms/${roomCode}/meta`), { lastActive: now })
    update(ref(db, `dmSessions/${dmUid}/${roomCode}`), { lastActive: now })
  }, [role, roomCode, dmUid])

  // --- Main effect ---
  useEffect(() => {
    if (!roomCode || !isRealSession) return

    const messagesRef = ref(db, `rooms/${roomCode}/messages`)
    const presenceRef = ref(db, `rooms/${roomCode}/presence`)
    const stateRef = ref(db, `rooms/${roomCode}/state`)
    const cleanups: (() => void)[] = []

    if (role === "dm") {
      // Write session meta (only for new sessions — check if meta exists first)
      get(ref(db, `rooms/${roomCode}/meta`)).then((snap) => {
        if (!snap.exists()) {
          writeSessionMeta()
        } else {
          // Update lastActive on resume
          update(ref(db, `rooms/${roomCode}/meta`), { lastActive: Date.now() })
          if (dmUid) update(ref(db, `dmSessions/${dmUid}/${roomCode}`), { lastActive: Date.now() })
        }
      })

      // Listen for new messages from players (moves, puzzleSolved)
      const msgQuery = query(
        messagesRef,
        orderByChild("timestamp"),
        startAfter(mountTimeRef.current),
      )
      onChildAdded(msgQuery, (snap) => {
        const data = snap.val() as Record<string, unknown> & { from?: string; type?: string }
        if (!data || data.from === "dm") return
        setLastMessage(data as unknown as BroadcastMessage)
        // Relay player moves to all via state update
        if (data.type === "move") {
          const stateUpdates = getStateUpdates("move", null, data as Record<string, unknown>)
          if (stateUpdates) update(stateRef, stateUpdates)
          push(messagesRef, { ...data, from: "dm", relayed: true, timestamp: Date.now() })
        }
      })
      cleanups.push(() => off(msgQuery))

      // Listen for presence (player names + count)
      onValue(presenceRef, (snap) => {
        const data = snap.val() as Record<string, PlayerInfo> | null
        setPlayers(data || {})
      })
      cleanups.push(() => off(presenceRef))

      // Prune old messages every 5 minutes
      const pruneInterval = setInterval(() => {
        get(messagesRef).then((snap) => {
          if (!snap.exists()) return
          const cutoff = Date.now() - 300000
          snap.forEach((child) => {
            const msg = child.val() as { timestamp: number }
            if (msg.timestamp < cutoff) {
              remove(child.ref)
            }
          })
        })
      }, 300000)
      cleanups.push(() => clearInterval(pruneInterval))

      setConnected(true)
    } else {
      // Player
      const playerId = playerIdRef.current
      const myPresenceRef = ref(db, `rooms/${roomCode}/presence/${playerId}`)

      // Register presence with name
      set(myPresenceRef, {
        name: playerName || "Adventurer",
        joinedAt: Date.now(),
        _owner: playerId,
      })
      onDisconnect(myPresenceRef).remove()
      cleanups.push(() => remove(myPresenceRef))

      // Load current state for recovery
      get(stateRef).then((snap) => {
        const state = snap.val() as SessionState | null
        if (state) {
          setSessionState(state)
          // Set initial display so PlayerView can recover
          if (state.currentDisplay) {
            setLastMessage({
              ...state.currentDisplay,
              _ts: Date.now(),
            } as unknown as BroadcastMessage)
          } else if (state.currentMap) {
            setLastMessage({
              type: "map",
              id: state.currentMap,
              _ts: Date.now(),
            } as unknown as BroadcastMessage)
          }
          if (state.mood) {
            // Queue mood after a tick so PlayerView processes display first
            setTimeout(() => {
              setLastMessage((prev) => {
                // Only set mood if we haven't gotten a real message yet
                return (prev as unknown as Record<string, unknown>)?._recovered
                  ? ({
                      type: "mood",
                      mood: state.mood!,
                      _ts: Date.now(),
                    } as unknown as BroadcastMessage)
                  : prev
              })
            }, 50)
          }
        }
      })

      // Listen for new messages
      const msgQuery = query(
        messagesRef,
        orderByChild("timestamp"),
        startAfter(mountTimeRef.current),
      )
      onChildAdded(msgQuery, (snap) => {
        const data = snap.val() as (Record<string, unknown> & { from?: string }) | null
        if (!data || data.from === playerId) return
        setLastMessage(data as unknown as BroadcastMessage)
      })
      cleanups.push(() => off(msgQuery))

      setConnected(true)
    }

    return () => cleanups.forEach((fn) => fn())
  }, [role, roomCode, playerName, writeSessionMeta])

  // --- Send message ---
  const send = useCallback(
    (data: Record<string, unknown>) => {
      if (!roomCode) return
      const messagesRef = ref(db, `rooms/${roomCode}/messages`)
      const stateRef = ref(db, `rooms/${roomCode}/state`)

      if (role === "dm") {
        // Push message to queue
        push(messagesRef, data)
        // Persist state
        const stateUpdates = getStateUpdates(data.type as string, data.id as string | null, data)
        if (stateUpdates) update(stateRef, stateUpdates)
        // Throttled lastActive
        updateLastActive()
      } else {
        // Player pushes to same queue
        push(messagesRef, data)
      }
    },
    [role, roomCode, updateLastActive],
  )

  const showToPlayer = useCallback(
    (type: string, id: string | null, extra: Record<string, unknown> = {}) => {
      const from = role === "dm" ? "dm" : playerIdRef.current
      send({ type, id, ...extra, timestamp: Date.now(), from })
    },
    [send, role],
  )

  const clearPlayer = useCallback(() => {
    const from = role === "dm" ? "dm" : playerIdRef.current
    send({ type: "clear", timestamp: Date.now(), from })
  }, [send, role])

  return (
    <BroadcastContext.Provider
      value={{
        connected,
        playerCount,
        players,
        lastMessage,
        sessionState,
        showToPlayer,
        clearPlayer,
        role,
        roomCode,
      }}
    >
      {children}
    </BroadcastContext.Provider>
  )
}

export function useBroadcast() {
  return useContext(BroadcastContext) as BroadcastContextValue
}
