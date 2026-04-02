import { useState, useEffect } from "react"
import { Plus, Trash2, Shield, Heart, Zap, LogOut } from "lucide-react"
import { ref, onValue, off, remove, set, push } from "firebase/database"
import { db } from "../../firebase"
import type { PlayerCharacter } from "../../types/character"
import CharacterWizard from "./CharacterWizard"
import Particles from "../Particles"

interface CharacterListProps {
  userId: string
  userName: string
  onSelectCharacter: (character: PlayerCharacter) => void
  onSignOut: () => void
}

export default function CharacterList({
  userId,
  userName,
  onSelectCharacter,
  onSignOut,
}: CharacterListProps) {
  const [characters, setCharacters] = useState<PlayerCharacter[]>([])
  const [showWizard, setShowWizard] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    const charsRef = ref(db, `players/${userId}/characters`)
    onValue(charsRef, (snap) => {
      const data = snap.val() as Record<string, PlayerCharacter> | null
      setCharacters(data ? Object.values(data) : [])
    })
    return () => off(charsRef)
  }, [userId])

  const handleCreateCharacter = async (character: PlayerCharacter) => {
    const charRef = push(ref(db, `players/${userId}/characters`))
    const charWithId = { ...character, id: charRef.key!, playerId: userId }
    await set(charRef, charWithId)
    setShowWizard(false)
  }

  const handleDelete = async (charId: string) => {
    const charsRef = ref(db, `players/${userId}/characters`)
    const snap = await new Promise<Record<string, PlayerCharacter> | null>((resolve) => {
      onValue(charsRef, (s) => resolve(s.val() as Record<string, PlayerCharacter> | null), {
        onlyOnce: true,
      })
    })
    if (snap) {
      const key = Object.entries(snap).find(([, c]) => c.id === charId)?.[0]
      if (key) {
        await remove(ref(db, `players/${userId}/characters/${key}`))
      }
    }
    setConfirmDelete(null)
  }

  if (showWizard) {
    return (
      <CharacterWizard onComplete={handleCreateCharacter} onCancel={() => setShowWizard(false)} />
    )
  }

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center relative overflow-hidden">
      <Particles type="dust" accentColor="#c9a227" />

      {/* Sign out — top right */}
      <button
        onClick={onSignOut}
        className="absolute top-5 right-5 z-20 p-2 rounded-lg text-text-muted hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer"
        title="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </button>

      <div className="relative z-10 w-full max-w-lg px-6 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1
            className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold tracking-wider"
            style={{
              color: "#c9a227",
              textShadow: "0 0 40px rgba(201,162,39,0.15)",
            }}
          >
            Thornhaven
          </h1>
          <p className="text-text-muted text-sm tracking-widest uppercase">Choose Your Hero</p>
          <div className="w-24 h-px bg-gold/40 mx-auto" />
          <p className="text-xs text-text-muted">
            Welcome back, <span className="text-parchment">{userName}</span>
          </p>
        </div>

        {/* Create new */}
        <button
          onClick={() => setShowWizard(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gold/15 border border-gold/30 text-gold font-medium text-sm hover:bg-gold/25 transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(201,162,39,0.1)]"
        >
          <Plus className="w-4 h-4" />
          Create New Character
        </button>

        {/* Character list */}
        {characters.length > 0 ? (
          <div className="space-y-3">
            {characters.map((char) => (
              <div
                key={char.id}
                onClick={() => onSelectCharacter(char)}
                className="relative flex items-center gap-4 p-4 rounded-xl bg-bg-surface/60 border border-bg-elevated/50 hover:border-gold/40 hover:bg-bg-surface/80 transition-all cursor-pointer group backdrop-blur-sm hover:shadow-[0_0_20px_rgba(201,162,39,0.08)]"
              >
                {/* Initial badge */}
                <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <span className="font-[family-name:var(--font-display)] text-gold text-lg">
                    {char.name.charAt(0)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-[family-name:var(--font-display)] text-gold text-sm font-semibold truncate">
                      {char.name}
                    </h3>
                    <span className="text-[10px] text-text-muted bg-bg-elevated/50 px-1.5 py-0.5 rounded">
                      Lvl {char.level}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted">
                    {char.raceName} {char.className}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-text-muted">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-danger" />
                      {char.maxHp}
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-info" />
                      {char.ac}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-warning" />
                      {char.speed} ft
                    </span>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirmDelete === char.id) {
                      handleDelete(char.id)
                    } else {
                      setConfirmDelete(char.id)
                      setTimeout(() => setConfirmDelete(null), 3000)
                    }
                  }}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    confirmDelete === char.id
                      ? "text-danger bg-danger/10"
                      : "text-text-muted/0 group-hover:text-text-muted hover:text-danger hover:bg-danger/10"
                  }`}
                  title={confirmDelete === char.id ? "Click again to confirm" : "Delete character"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="text-4xl">&#x2694;&#xFE0F;</div>
            <p className="text-parchment-dim text-sm font-[family-name:var(--font-display)]">
              No adventurers yet
            </p>
            <p className="text-text-muted text-xs max-w-xs mx-auto">
              Every great story starts with a hero. Create your first character to begin your
              journey.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
