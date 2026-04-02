import { useState, useMemo, useEffect, useCallback } from "react"
import { BookOpen, Users, Swords, Search, Map, Home, Wifi, WifiOff, X, LogOut } from "lucide-react"
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth"
import { ref, get } from "firebase/database"
import type { LucideIcon } from "lucide-react"
import { auth, db } from "./firebase"
import { BroadcastProvider, useBroadcast } from "./hooks/useBroadcast"
import { CampaignProvider, useCampaign } from "./hooks/useCampaign"
import { usePersistedState } from "./hooks/usePersistedState"
import StoryTab from "./components/StoryTab"
import CharactersTab from "./components/CharactersTab"
import EncounterTracker from "./components/EncounterTracker"
import ClueTracker from "./components/ClueTracker"
import PlayerView from "./components/PlayerView"
import CampaignLanding from "./components/CampaignLanding"
import SessionPicker from "./components/SessionPicker"
import LoadingScreen from "./components/LoadingScreen"
import CharacterList from "./components/character/CharacterList"
import type { PlayerCharacter } from "./types/character"

// --- Hash routing ---
interface ParsedHash {
  route: string | null
  code: string | null
}

function parseHash(hash: string): ParsedHash {
  const match = hash.match(/^#\/(play|join|session)\/?(.*)?$/)
  if (!match) return { route: null, code: null }
  return { route: match[1], code: match[2] || null }
}

function useHashRoute() {
  const [parsed, setParsed] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setParsed(parseHash(window.location.hash))
    window.addEventListener("hashchange", onHashChange)
    return () => window.removeEventListener("hashchange", onHashChange)
  }, [])

  const navigate = useCallback((path: string) => {
    window.location.hash = path
  }, [])

  return { ...parsed, navigate }
}

const tabs: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "story", label: "Story", icon: BookOpen },
  { id: "characters", label: "Characters", icon: Users },
  { id: "encounters", label: "Encounters", icon: Swords },
  { id: "clues", label: "Clues", icon: Search },
]

// --- Player Join Screen ---
function PlayerJoin({
  onJoin,
  onBack,
  characterName,
}: {
  onJoin: (code: string) => void
  onBack: () => void
  characterName: string
}) {
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  const handleJoin = async () => {
    if (code.length < 4) return
    setChecking(true)
    setError(null)
    try {
      const snap = await get(ref(db, `rooms/${code}/meta`))
      if (!snap.exists()) {
        setError("Room not found. Check the code and try again.")
        setChecking(false)
        return
      }
      onJoin(code)
    } catch {
      setError("Could not connect. Try again.")
      setChecking(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-bg-deep flex items-center justify-center">
      <div className="text-center space-y-6 w-full max-w-xs px-6">
        <div className="space-y-2">
          <Map className="w-10 h-10 text-gold mx-auto" />
          <h1 className="font-[family-name:var(--font-display)] text-2xl text-gold">
            Join Session
          </h1>
          <p className="text-sm text-text-muted">
            Playing as <span className="text-gold font-medium">{characterName}</span>
          </p>
          <p className="text-sm text-text-muted">Enter the room code from your DM</p>
        </div>
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 5),
            )
            setError(null)
          }}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          className="w-full text-center text-2xl font-mono tracking-[0.3em] bg-bg-surface border border-gold/30 rounded-lg px-4 py-3 text-gold focus:outline-none focus:border-gold placeholder:text-text-muted/50"
          placeholder="XXXXX"
          maxLength={5}
          autoFocus
        />
        {error && <p className="text-danger text-xs">{error}</p>}
        <button
          onClick={handleJoin}
          disabled={code.length < 4 || checking}
          className="w-full px-6 py-2.5 rounded-lg bg-gold/15 text-gold border border-gold/25 hover:bg-gold/25 disabled:opacity-30 cursor-pointer transition-colors text-sm font-medium"
        >
          {checking ? "Checking..." : "Join"}
        </button>
        <button
          onClick={onBack}
          className="text-xs text-text-muted hover:text-parchment transition-colors cursor-pointer"
        >
          Back to characters
        </button>
      </div>
    </div>
  )
}

// --- Auth Gate ---
interface AuthGateProps {
  children: (ctx: { user: User; onSignOut: () => void }) => React.ReactNode
}

function AuthGate({ children }: AuthGateProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        setCheckingAuth(true)
        const snap = await get(ref(db, `allowedDMs/${u.uid}`))
        setAuthorized(snap.exists())
        setCheckingAuth(false)
      } else {
        setAuthorized(false)
      }
      setLoading(false)
    })
  }, [])

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch (err) {
      console.error("Sign-in failed:", err)
    }
  }

  const handleSignOut = () => signOut(auth)

  if (loading || checkingAuth) {
    return <LoadingScreen />
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-bg-deep flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <Map className="w-10 h-10 text-gold mx-auto" />
            <h1 className="font-[family-name:var(--font-display)] text-2xl text-gold">
              Thornhaven
            </h1>
            <p className="text-sm text-text-muted">Sign in to access the DM Companion</p>
          </div>
          <button
            onClick={handleSignIn}
            className="px-6 py-3 rounded-lg bg-gold/15 text-gold border border-gold/25 hover:bg-gold/25 cursor-pointer transition-colors flex items-center gap-2 mx-auto"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="fixed inset-0 bg-bg-deep flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-[family-name:var(--font-display)] text-xl text-gold">
            Access Denied
          </h1>
          <p className="text-sm text-text-muted max-w-xs">
            Your account ({user.email}) is not authorized as a DM.
          </p>
          <p className="text-xs text-text-muted font-mono bg-bg-surface/60 rounded px-3 py-2 border border-bg-elevated/50">
            UID: {user.uid}
          </p>
          <p className="text-xs text-text-muted">Share this UID with an admin to get access.</p>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-lg text-xs text-text-muted hover:text-parchment border border-bg-elevated/50 hover:bg-bg-surface/60 cursor-pointer transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return children({ user, onSignOut: handleSignOut })
}

// --- DM App ---
interface DmAppProps {
  user: User
  onSignOut: () => void
  sessionRoomCode: string | null
  navigate: (path: string) => void
}

function DmApp({ user, onSignOut, sessionRoomCode, navigate }: DmAppProps) {
  const { campaign } = useCampaign()
  const [view, setView] = useState<"landing" | "sessions" | "session">(() => {
    if (sessionRoomCode) return "session"
    return "landing"
  })
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = usePersistedState(`dm:${campaign.id}:activeTab`, "story")
  const { connected, playerCount, players, clearPlayer, showToPlayer, lastMessage, roomCode } =
    useBroadcast()
  const [activeMood, setActiveMood] = useState("default")
  const [puzzleToast, setPuzzleToast] = useState(false)
  const moodEntries = campaign.moods ? Object.values(campaign.moods) : []

  useEffect(() => {
    if (lastMessage?.type === "puzzleSolved") {
      setPuzzleToast(true)
      const t = setTimeout(() => setPuzzleToast(false), 5000)
      return () => clearTimeout(t)
    }
  }, [lastMessage])

  const playerUrl = useMemo(() => {
    const loc = window.location
    return `${loc.protocol}//${loc.host}${loc.pathname}#/play/${roomCode}`
  }, [roomCode])

  const playerNames = Object.values(players)
    .map((p) => p.name)
    .filter(Boolean)

  const enterCampaign = (campaignId: string) => {
    setSelectedCampaignId(campaignId)
    setView("sessions")
  }

  const selectSession = (existingRoomCode: string | null) => {
    if (existingRoomCode) {
      navigate(`#/session/${existingRoomCode}`)
    } else {
      // New session — navigate, the BroadcastProvider will generate a room code
      // We need to generate one here so we can navigate to it
      const ALPHABET = "ABCDEFGHJKMNPQRTUVWXY2346789"
      const newCode = Array.from(
        { length: 5 },
        () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)],
      ).join("")
      navigate(`#/session/${newCode}`)
    }
    // Page will re-render with new hash → new BroadcastProvider with roomCode
  }

  const goToLanding = () => {
    navigate("")
    setView("landing")
    setSelectedCampaignId(null)
  }

  // Landing view
  if (view === "landing") {
    return <CampaignLanding onEnterCampaign={enterCampaign} onSignOut={onSignOut} />
  }

  // Session picker view
  if (view === "sessions" && selectedCampaignId) {
    return (
      <SessionPicker
        campaignId={selectedCampaignId}
        dmUid={user.uid}
        onSelectSession={selectSession}
        onBack={goToLanding}
      />
    )
  }

  // Active session view
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-bg-base border-b border-gold-dim/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goToLanding}
              className="p-1.5 rounded-lg text-text-muted hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer"
              title="Back to campaigns"
            >
              <Home className="w-5 h-5" />
            </button>
            <Map className="w-7 h-7 text-gold" />
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-gold tracking-wide">
                {campaign.title}
              </h1>
              <p className="text-xs text-text-muted tracking-wider uppercase">
                DM Companion — {campaign.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Room code */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 cursor-pointer"
              onClick={() => navigator.clipboard.writeText(roomCode)}
              title="Click to copy room code"
            >
              <span className="text-xs text-text-muted">Room:</span>
              <span className="font-mono text-sm font-bold text-gold tracking-widest">
                {roomCode}
              </span>
            </div>

            {playerCount > 0 && (
              <div
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-bg-surface/60 border border-bg-elevated/50"
                title="Mood"
              >
                {moodEntries.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      showToPlayer("mood", null, { mood: m.id })
                      setActiveMood(m.id)
                    }}
                    className="w-5 h-5 rounded-full cursor-pointer transition-all duration-200 shrink-0"
                    style={{
                      background: m.gradient[0],
                      border: `2px solid ${m.accentColor}`,
                      boxShadow:
                        activeMood === m.id
                          ? `0 0 0 2px ${m.accentColor}60, 0 0 8px ${m.accentColor}40`
                          : "none",
                      opacity: activeMood === m.id ? 1 : 0.6,
                    }}
                    title={m.name}
                  />
                ))}
              </div>
            )}
            <button
              onClick={clearPlayer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-bg-surface/60 border border-bg-elevated/50 text-text-muted hover:text-parchment hover:bg-bg-surface transition-colors cursor-pointer"
              title="Clear player screen"
            >
              <X className="w-3 h-3" />
              Clear Screen
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface/60 border border-bg-elevated/50">
              {connected ? (
                <Wifi className="w-3.5 h-3.5 text-success-light" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-danger" />
              )}
              <span className="text-xs text-text-muted">
                {playerCount > 0 ? (
                  <span className="text-success-light" title={playerNames.join(", ")}>
                    {playerNames.length > 0
                      ? playerNames.join(", ")
                      : `${playerCount} player${playerCount > 1 ? "s" : ""}`}
                  </span>
                ) : (
                  "No players"
                )}
              </span>
            </div>
            <a
              href={playerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 transition-colors"
              title="Open player view in new tab"
            >
              Player View
            </a>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-text-muted hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer"
              title={`Sign out (${user.email})`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Tab Bar */}
      <nav className="bg-bg-base/80 backdrop-blur-sm border-b border-gold-dim/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer
                  ${
                    isActive
                      ? "border-gold text-gold bg-gold/5"
                      : "border-transparent text-text-muted hover:text-parchment hover:border-gold-dim/40 hover:bg-white/[0.02]"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 bg-bg-deep">
        <div className="max-w-7xl mx-auto p-6">
          {activeTab === "story" && <StoryTab />}
          {activeTab === "characters" && <CharactersTab />}
          {activeTab === "encounters" && <EncounterTracker />}
          {activeTab === "clues" && <ClueTracker />}
        </div>
      </main>

      {puzzleToast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-medium"
          style={{
            background: "linear-gradient(135deg, #1a2e28, #16213e)",
            border: "1px solid rgba(39, 174, 96, 0.25)",
            color: "#2ecc71",
            boxShadow: "0 4px 20px rgba(39, 174, 96, 0.15)",
            animation: "inscriptionFade 0.4s ease-out",
          }}
        >
          The sealed door has been opened
        </div>
      )}
    </div>
  )
}

// --- Player Auth Gate ---
function PlayerGate({
  children,
}: {
  children: (ctx: {
    user: User
    character: PlayerCharacter
    onSignOut: () => void
    onBackToCharacters: () => void
  }) => React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [character, setCharacter] = useState<PlayerCharacter | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || (isSignUp && !displayName)) return
    setSubmitting(true)
    setAuthError(null)
    try {
      if (isSignUp) {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(cred.user, { displayName })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed"
      if (msg.includes("email-already-in-use"))
        setAuthError("Email already in use. Try signing in.")
      else if (msg.includes("wrong-password") || msg.includes("invalid-credential"))
        setAuthError("Wrong email or password.")
      else if (msg.includes("user-not-found")) setAuthError("No account found. Try signing up.")
      else if (msg.includes("weak-password"))
        setAuthError("Password must be at least 6 characters.")
      else setAuthError(msg)
      setSubmitting(false)
    }
  }

  const handleSignOut = () => {
    signOut(auth)
    setCharacter(null)
  }

  if (loading) {
    return <LoadingScreen message="Preparing your adventure" />
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-bg-deep flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-xs px-6 space-y-5">
          <div className="text-center space-y-2">
            <Map className="w-10 h-10 text-gold mx-auto" />
            <h1 className="font-[family-name:var(--font-display)] text-2xl text-gold">
              Thornhaven
            </h1>
            <p className="text-sm text-text-muted">
              {isSignUp ? "Create your account" : "Sign in to play"}
            </p>
          </div>

          <div className="space-y-3">
            {isSignUp && (
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full text-sm bg-bg-surface border border-gold/30 rounded-lg px-4 py-2.5 text-parchment focus:outline-none focus:border-gold placeholder:text-text-muted/50"
                placeholder="Display name"
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-sm bg-bg-surface border border-gold/30 rounded-lg px-4 py-2.5 text-parchment focus:outline-none focus:border-gold placeholder:text-text-muted/50"
              placeholder="Email"
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-sm bg-bg-surface border border-gold/30 rounded-lg px-4 py-2.5 text-parchment focus:outline-none focus:border-gold placeholder:text-text-muted/50"
              placeholder="Password"
            />
          </div>

          {authError && <p className="text-danger text-xs text-center">{authError}</p>}

          <button
            type="submit"
            disabled={submitting || !email || !password || (isSignUp && !displayName)}
            className="w-full px-6 py-2.5 rounded-lg bg-gold/15 text-gold border border-gold/25 hover:bg-gold/25 disabled:opacity-30 cursor-pointer transition-colors text-sm font-medium"
          >
            {submitting ? "..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>

          <p className="text-center text-xs text-text-muted">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setAuthError(null)
              }}
              className="text-gold hover:text-gold-light cursor-pointer"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    )
  }

  if (!character) {
    return (
      <CharacterList
        userId={user.uid}
        userName={user.displayName ?? "Adventurer"}
        onSelectCharacter={setCharacter}
        onSignOut={handleSignOut}
      />
    )
  }

  return children({
    user,
    character,
    onSignOut: handleSignOut,
    onBackToCharacters: () => setCharacter(null),
  })
}

// --- Root App ---
export default function App() {
  const { route, code, navigate } = useHashRoute()

  // Player join screen — now requires auth + character selection
  if (route === "join" || (route === "play" && !code)) {
    return (
      <PlayerGate>
        {({ character, onBackToCharacters }) => (
          <PlayerJoin
            onJoin={(roomCode) => {
              navigate(`#/play/${roomCode}`)
            }}
            onBack={onBackToCharacters}
            characterName={character.name}
          />
        )}
      </PlayerGate>
    )
  }

  // Player mode
  if (route === "play" && code) {
    return (
      <PlayerGate>
        {({ character }) => (
          <BroadcastProvider
            role="player"
            roomCode={code}
            playerName={character.name}
            playerCharacter={character}
          >
            <CampaignProvider>
              <PlayerView />
            </CampaignProvider>
          </BroadcastProvider>
        )}
      </PlayerGate>
    )
  }

  // DM mode
  return (
    <AuthGate>
      {({ user, onSignOut }: { user: User; onSignOut: () => void }) => {
        // DM with active session
        if (route === "session" && code) {
          return (
            <BroadcastProvider
              key={`session-${code}`}
              role="dm"
              roomCode={code}
              dmUid={user.uid}
              campaignId={(() => {
                try {
                  return localStorage.getItem("dm:campaignId") || "thornhaven"
                } catch {
                  return "thornhaven"
                }
              })()}
            >
              <CampaignProvider>
                <DmApp
                  user={user}
                  onSignOut={onSignOut}
                  sessionRoomCode={code}
                  navigate={navigate}
                />
              </CampaignProvider>
            </BroadcastProvider>
          )
        }

        // DM landing / session picker
        return (
          <BroadcastProvider key="landing" role="dm" dmUid={user.uid} campaignId="thornhaven">
            <CampaignProvider>
              <DmApp user={user} onSignOut={onSignOut} sessionRoomCode={null} navigate={navigate} />
            </CampaignProvider>
          </BroadcastProvider>
        )
      }}
    </AuthGate>
  )
}
