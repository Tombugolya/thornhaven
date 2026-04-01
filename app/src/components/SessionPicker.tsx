import { useState, useEffect } from "react"
import { Plus, Trash2, Users, ArrowLeft, Clock } from "lucide-react"
import { ref, onValue, off, remove } from "firebase/database"
import { db } from "../firebase"

interface SessionData {
  campaignId: string
  createdAt: number
  lastActive?: number
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

interface SessionCardProps {
  roomCode: string
  session: SessionData
  onSelect: (roomCode: string) => void
  onDelete: (roomCode: string) => void
}

function SessionCard({ roomCode, session, onSelect, onDelete }: SessionCardProps) {
  const [playerCount, setPlayerCount] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const presenceRef = ref(db, `rooms/${roomCode}/presence`)
    onValue(presenceRef, (snap) => {
      const data = snap.val()
      setPlayerCount(data ? Object.keys(data).length : 0)
    })
    return () => off(presenceRef)
  }, [roomCode])

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirmDelete) {
      onDelete(roomCode)
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div
      onClick={() => onSelect(roomCode)}
      className="relative flex items-center justify-between p-4 rounded-lg bg-bg-surface/60 border border-bg-elevated/50 hover:border-gold/30 hover:bg-bg-surface/80 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="font-mono text-lg font-bold text-gold tracking-widest">{roomCode}</div>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo(session.lastActive || session.createdAt)}
          </span>
          {playerCount > 0 && (
            <span className="flex items-center gap-1 text-success-light">
              <Users className="w-3 h-3" />
              {playerCount}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={handleDelete}
        className={`p-1.5 rounded transition-colors cursor-pointer ${
          confirmDelete
            ? "text-danger bg-danger/10"
            : "text-text-muted/0 group-hover:text-text-muted hover:text-danger hover:bg-danger/10"
        }`}
        title={confirmDelete ? "Click again to confirm" : "Delete session"}
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

interface SessionPickerProps {
  campaignId: string
  dmUid: string
  onSelectSession: (roomCode: string | null) => void
  onBack: () => void
}

export default function SessionPicker({
  campaignId,
  dmUid,
  onSelectSession,
  onBack,
}: SessionPickerProps) {
  const [sessions, setSessions] = useState<Record<string, SessionData>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sessionsRef = ref(db, `dmSessions/${dmUid}`)
    onValue(sessionsRef, (snap) => {
      const data = (snap.val() || {}) as Record<string, SessionData>
      // Filter to current campaign
      const filtered: Record<string, SessionData> = {}
      for (const [code, session] of Object.entries(data)) {
        if (session.campaignId === campaignId) {
          filtered[code] = session
        }
      }
      setSessions(filtered)
      setLoading(false)
    })
    return () => off(sessionsRef)
  }, [dmUid, campaignId])

  const handleDelete = async (roomCode: string) => {
    await Promise.all([
      remove(ref(db, `dmSessions/${dmUid}/${roomCode}`)),
      remove(ref(db, `rooms/${roomCode}`)),
    ])
  }

  // Sort sessions by lastActive, most recent first
  const sorted = Object.entries(sessions).sort(
    ([, a], [, b]) => (b.lastActive || b.createdAt) - (a.lastActive || a.createdAt),
  )

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg text-text-muted hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl text-gold">Sessions</h2>
            <p className="text-xs text-text-muted">Resume a session or start a new one</p>
          </div>
        </div>

        {/* New session button */}
        <button
          onClick={() => onSelectSession(null)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gold/15 border border-gold/30 text-gold font-medium text-sm hover:bg-gold/25 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Session
        </button>

        {/* Session list */}
        {loading ? (
          <div className="text-center text-text-muted text-sm py-8">Loading sessions...</div>
        ) : sorted.length > 0 ? (
          <div className="space-y-2">
            {sorted.map(([code, session]) => (
              <SessionCard
                key={code}
                roomCode={code}
                session={session}
                onSelect={onSelectSession}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-text-muted text-sm py-8">
            No sessions yet. Start a new one above.
          </p>
        )}
      </div>
    </div>
  )
}
