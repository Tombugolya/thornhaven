import { useState, useEffect } from "react"
import { Plus, Trash2, Shield, Heart, Zap, User } from "lucide-react"
import { ref, onValue, off, remove, set, push } from "firebase/database"
import { db } from "../../firebase"
import type { PlayerCharacter } from "../../types/character"
import CharacterWizard from "./CharacterWizard"

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
    const charToDelete = characters.find((c) => c.id === charId)
    if (!charToDelete) return
    // Find the Firebase key for this character
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
    <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <User className="w-10 h-10 text-gold mx-auto" />
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-gold">
            Your Characters
          </h1>
          <p className="text-sm text-text-muted">
            Welcome, {userName}. Choose a character or create a new one.
          </p>
        </div>

        {/* Create new */}
        <button
          onClick={() => setShowWizard(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gold/15 border border-gold/30 text-gold font-medium text-sm hover:bg-gold/25 transition-colors cursor-pointer"
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
                className="relative flex items-center gap-4 p-4 rounded-xl bg-bg-surface/60 border border-bg-elevated/50 hover:border-gold/30 hover:bg-bg-surface/80 transition-all cursor-pointer group"
              >
                {/* Class icon area */}
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
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-text-muted">
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

                {/* Delete button */}
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
          <div className="text-center py-12 space-y-3">
            <p className="text-text-muted text-sm">No characters yet.</p>
            <p className="text-text-muted text-xs">Create your first adventurer above!</p>
          </div>
        )}

        {/* Sign out */}
        <div className="text-center">
          <button
            onClick={onSignOut}
            className="text-xs text-text-muted hover:text-parchment transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}
