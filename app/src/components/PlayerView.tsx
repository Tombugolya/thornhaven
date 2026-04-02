import { useState, useEffect, useRef, useMemo } from "react"
import { useBroadcast } from "../hooks/useBroadcast"
import { useCampaign } from "../hooks/useCampaign"
import SceneDisplay from "./SceneDisplay"
import BattleMap from "./BattleMap"
import HandoutDisplay from "./HandoutDisplay"
import Particles from "./Particles"
import type { BattleMap as BattleMapData, Handout, Mood } from "../types/campaign"

interface FloatingNumberEntry {
  id: number
  tokenId: string
  value: number
}

interface SceneData {
  displayType: "location" | "character" | "combat"
  name: string
  subtitle?: string
  title?: string
  description: string
  gradient?: string[]
  accentColor: string
  particles?: string
  symbol?: string
}

interface DeathSaveState {
  roll: number | null
  rolling: boolean
  success: boolean | null
  successes: number
  failures: number
}

let floatingIdCounter = 0

export default function PlayerView() {
  const { campaign } = useCampaign()
  const { lastMessage, connected, showToPlayer, sessionState } = useBroadcast()
  const {
    location: locationVisuals,
    character: characterVisuals,
    combat: combatVisuals,
  } = campaign.visuals
  const moods = campaign.moods
  const battleMaps = campaign.battleMaps
  const [scene, setScene] = useState<SceneData | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const [activeMap, setActiveMap] = useState<BattleMapData | null>(null)
  const [activeHandout, setActiveHandout] = useState<Handout | null>(null)
  const [mood, setMood] = useState("default")
  const [campaignActive, setCampaignActive] = useState(false)
  const [victory, setVictory] = useState<string | null>(null)
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumberEntry[]>([])
  const [dyingTokens, setDyingTokens] = useState<Set<string>>(new Set())
  const [deathSave, setDeathSave] = useState<DeathSaveState | null>(null)

  // Check if the player's PC is at 0 HP via encounter state
  const pcDown = useMemo(() => {
    const enc = sessionState?.encounter
    if (!enc) return false
    const pc = enc.combatants.find((c) => c.isPC && c.hp <= 0 && c.deathSaves !== undefined)
    return !!pc
  }, [sessionState?.encounter])

  // Derive current death save tallies from encounter state (source of truth)
  const pcDeathSaves = useMemo(() => {
    const enc = sessionState?.encounter
    if (!enc) return null
    const pc = enc.combatants.find((c) => c.isPC && c.deathSaves !== undefined)
    return pc?.deathSaves ?? null
  }, [sessionState?.encounter])

  // Sync death save display state with encounter state
  useEffect(() => {
    if (pcDown && pcDeathSaves) {
      setDeathSave((prev) => ({
        roll: prev?.roll ?? null,
        rolling: prev?.rolling ?? false,
        success: prev?.success ?? null,
        successes: pcDeathSaves.successes,
        failures: pcDeathSaves.failures,
      }))
    } else if (!pcDown) {
      // PC stabilized or not down -- check if we need to show stabilized message briefly
      if (deathSave && deathSave.successes >= 3) {
        // Let stabilized message show for a moment then clear
        const timer = setTimeout(() => setDeathSave(null), 3000)
        return () => clearTimeout(timer)
      }
      if (deathSave && deathSave.failures < 3) {
        setDeathSave(null)
      }
    }
  }, [pcDown, pcDeathSaves])

  // Derive combat state from live sessionState (Firebase is source of truth)
  const revealedTokens = useMemo(
    () =>
      sessionState?.revealedTokens
        ? new Set(Object.keys(sessionState.revealedTokens))
        : new Set<string>(),
    [sessionState?.revealedTokens],
  )
  const tokenPositions = sessionState?.tokenPositions ?? {}
  const killedTokens = useMemo(
    () =>
      sessionState?.killedTokens
        ? new Set(Object.keys(sessionState.killedTokens))
        : new Set<string>(),
    [sessionState?.killedTokens],
  )
  const tokenConditions = sessionState?.tokenConditions ?? {}
  const activeTurnToken = sessionState?.activeTurnToken ?? null

  // Recover display state from sessionState on mount
  const recoveredRef = useRef(false)
  useEffect(() => {
    if (!sessionState || recoveredRef.current) return
    recoveredRef.current = true

    if (sessionState.mood) setMood(sessionState.mood)
    setCampaignActive(true)

    // Recover current display
    if (sessionState.currentMap) {
      const map = battleMaps[sessionState.currentMap]
      if (map) setActiveMap(map)
    } else if (sessionState.currentDisplay) {
      const { type, id } = sessionState.currentDisplay
      if (type === "handout") {
        const handout = campaign.handouts?.[id]
        if (handout) setActiveHandout(handout)
      } else {
        const displayType: SceneData["displayType"] =
          type === "location" ? "location" : type === "character" ? "character" : "combat"
        const visuals =
          type === "location"
            ? locationVisuals
            : type === "character"
              ? characterVisuals
              : combatVisuals
        const visual = visuals[id]
        if (visual) setScene({ ...visual, displayType })
      }
    }
  }, [sessionState])

  useEffect(() => {
    if (!lastMessage) return

    // Any DM message means the campaign is active
    setCampaignActive(true)

    if (lastMessage.type === "selectCampaign") {
      return
    }

    if (lastMessage.type === "mood") {
      setMood(lastMessage.mood)
      return
    }

    if (lastMessage.type === "clear") {
      setTransitioning(true)
      setTimeout(() => {
        setScene(null)
        setActiveMap(null)
        setActiveHandout(null)
        setVictory(null)
        setFloatingNumbers([])
        setDyingTokens(new Set())
        setTransitioning(false)
      }, 600)
      return
    }

    // Map reveal — show battle map
    if (lastMessage.type === "map") {
      const map = battleMaps[lastMessage.id]
      if (map) {
        setTransitioning(true)
        setTimeout(() => {
          setScene(null)
          setActiveMap(map)
          setActiveHandout(null)
          setVictory(null)
          setFloatingNumbers([])
          setDyingTokens(new Set())
          setTransitioning(false)
        }, 600)
      }
      return
    }

    // Token kill — play death animation (permanent dead state comes from sessionState)
    if (lastMessage.type === "kill") {
      const tokenId = lastMessage.tokenId
      setDyingTokens((prev) => new Set([...prev, tokenId]))
      setTimeout(() => {
        setDyingTokens((prev) => {
          const next = new Set(prev)
          next.delete(tokenId)
          return next
        })
      }, 1200)
      return
    }

    // Battle won!
    if (lastMessage.type === "battleWon") {
      setVictory(lastMessage.encounterName || "Battle")
      return
    }

    // Death save roll from DM
    if (lastMessage.type === "deathSave") {
      // Show rolling animation then result
      setDeathSave({
        roll: null,
        rolling: true,
        success: null,
        successes: lastMessage.successes,
        failures: lastMessage.failures,
      })
      // After brief spin, reveal the roll
      setTimeout(() => {
        setDeathSave({
          roll: lastMessage.roll,
          rolling: false,
          success: lastMessage.success,
          successes: lastMessage.successes,
          failures: lastMessage.failures,
        })
      }, 1200)
      return
    }

    // Floating damage number
    if (lastMessage.type === "damage") {
      const entry = {
        id: ++floatingIdCounter,
        tokenId: lastMessage.tokenId,
        value: lastMessage.value,
      }
      setFloatingNumbers((prev) => [...prev, entry])
      // Auto-remove after 2s
      setTimeout(() => {
        setFloatingNumbers((prev) => prev.filter((n) => n.id !== entry.id))
      }, 2000)
      return
    }

    // Handout reveal
    if (lastMessage.type === "handout") {
      const handout = campaign.handouts?.[lastMessage.id]
      if (handout) {
        setTransitioning(true)
        setTimeout(() => {
          setScene(null)
          setActiveMap(null)
          setActiveHandout(handout)
          setVictory(null)
          setTransitioning(false)
        }, 600)
      }
      return
    }

    // Scene reveals (location, character, combat splash)
    let sceneData: SceneData | null = null
    if (lastMessage.type === "location") {
      const v = locationVisuals[lastMessage.id]
      if (v) sceneData = { ...v, displayType: "location" as const }
    } else if (lastMessage.type === "character") {
      const v = characterVisuals[lastMessage.id]
      if (v) sceneData = { ...v, displayType: "character" as const }
    } else if (lastMessage.type === "combat") {
      const v = combatVisuals[lastMessage.id]
      if (v) sceneData = { ...v, displayType: "combat" as const }
    }

    if (sceneData) {
      setTransitioning(true)
      setTimeout(() => {
        setActiveMap(null)
        setActiveHandout(null)
        setVictory(null)
        setScene(sceneData)
        setTransitioning(false)
      }, 600)
    }
  }, [lastMessage])

  // Build visible tokens: all revealed (dead tokens stay visible with skull)
  const visibleTokens = revealedTokens

  // Derive proneTokens from tokenConditions
  const proneTokens = useMemo(
    () =>
      new Set(
        Object.entries(tokenConditions)
          .filter(([, conds]) => conds.includes("prone"))
          .map(([id]) => id),
      ),
    [tokenConditions],
  )

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Connection indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-opacity duration-1000 ${
            scene || activeMap ? "opacity-0" : "opacity-60"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${connected ? "bg-success animate-pulse" : "bg-danger"}`}
          />
          <span className="text-parchment/40">{connected ? "Connected" : "Connecting..."}</span>
        </div>
      </div>

      {/* Transition overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 pointer-events-none transition-opacity duration-600 ${
          transitioning ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Death save overlay */}
      {deathSave && <DeathSaveOverlay state={deathSave} />}

      {/* Victory overlay */}
      {victory && <VictoryScreen />}

      {/* Content — idle screen needs campaign title */}
      {activeMap ? (
        <BattleMap
          map={activeMap}
          revealedTokens={visibleTokens}
          tokenPositions={tokenPositions}
          role="player"
          fullscreen
          onTokenMove={(tokenId, x, y) => {
            showToPlayer("move", null, { tokenId, x, y })
          }}
          proneTokens={proneTokens}
          activeTurnToken={activeTurnToken}
          dyingTokens={dyingTokens}
          deadTokens={killedTokens}
          floatingNumbers={floatingNumbers}
          tokenConditions={tokenConditions}
        />
      ) : activeHandout ? (
        <HandoutDisplay handout={activeHandout} />
      ) : scene ? (
        <SceneDisplay scene={scene} />
      ) : (
        <IdleScreen
          title={campaignActive ? campaign.title : "Awaiting Adventure"}
          subtitle={campaignActive ? campaign.subtitle : null}
          campaignId={campaignActive ? campaign.id : null}
          mood={moods?.[mood] || moods?.default}
        />
      )}
    </div>
  )
}

function VictoryScreen() {
  const [phase, setPhase] = useState(0) // 0=flash, 1=text, 2=particles

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 1000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  // Generate golden particles once
  const particles = useState(() =>
    Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 30,
      y: 50 + (Math.random() - 0.5) * 20,
      size: 2 + Math.random() * 4,
      angle: Math.random() * 360,
      distance: 20 + Math.random() * 40,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 0.8,
    })),
  )[0]

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Initial flash */}
      <div
        className="absolute inset-0 bg-gold/20 transition-opacity"
        style={{
          opacity: phase === 0 ? 1 : 0,
          transitionDuration: "800ms",
        }}
      />

      {/* Radial burst */}
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transitionDuration: "1200ms",
          background:
            "radial-gradient(circle at 50% 50%, rgba(201,162,39,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Golden particles flying outward */}
      {phase >= 2 &&
        particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={
              {
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                backgroundColor: "#c9a227",
                boxShadow: `0 0 ${p.size * 2}px #c9a227`,
                animation: `victoryParticle ${p.duration}s ease-out ${p.delay}s forwards`,
                "--vp-angle": `${p.angle}deg`,
                "--vp-distance": `${p.distance}vh`,
              } as React.CSSProperties
            }
          />
        ))}

      {/* Victory text */}
      <div
        className="relative text-center transition-all"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? "scale(1) translateY(0)" : "scale(0.5) translateY(20px)",
          transitionDuration: "1000ms",
          transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        {/* Glow behind text */}
        <div className="absolute inset-0 -m-20 blur-3xl bg-gold/10 rounded-full" />

        <div className="relative">
          {/* Decorative line above */}
          <div
            className="w-24 h-px mx-auto mb-4 transition-all"
            style={{
              background: "linear-gradient(to right, transparent, #c9a227, transparent)",
              opacity: phase >= 2 ? 1 : 0,
              transitionDuration: "800ms",
              transitionDelay: "400ms",
              transform: phase >= 2 ? "scaleX(1)" : "scaleX(0)",
            }}
          />

          <h1
            className="font-[family-name:var(--font-display)] text-6xl md:text-8xl font-bold tracking-[0.15em]"
            style={{
              color: "#c9a227",
              textShadow:
                "0 0 40px rgba(201,162,39,0.4), 0 0 80px rgba(201,162,39,0.15), 0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            VICTORY
          </h1>

          {/* Decorative line below */}
          <div
            className="w-40 h-px mx-auto mt-4 transition-all"
            style={{
              background: "linear-gradient(to right, transparent, #c9a227, transparent)",
              opacity: phase >= 2 ? 1 : 0,
              transitionDuration: "800ms",
              transitionDelay: "600ms",
              transform: phase >= 2 ? "scaleX(1)" : "scaleX(0)",
            }}
          />

          <p
            className="text-parchment/40 text-sm tracking-[0.4em] uppercase mt-6 transition-all"
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transitionDuration: "800ms",
              transitionDelay: "800ms",
            }}
          >
            The battle is won
          </p>
        </div>
      </div>
    </div>
  )
}

function DeathSaveOverlay({ state }: { state: DeathSaveState }) {
  const [displayNumber, setDisplayNumber] = useState(0)
  const stabilized = state.successes >= 3
  const fallen = state.failures >= 3

  // Rolling number animation
  useEffect(() => {
    if (!state.rolling) return
    const interval = setInterval(() => {
      setDisplayNumber(Math.floor(Math.random() * 20) + 1)
    }, 60)
    return () => clearInterval(interval)
  }, [state.rolling])

  // When roll lands, set final number
  useEffect(() => {
    if (state.roll !== null) {
      setDisplayNumber(state.roll)
    }
  }, [state.roll])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay with vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.92) 70%, rgba(0,0,0,0.98) 100%)",
        }}
      />

      {/* Pulsing danger border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "inset 0 0 120px rgba(192,57,43,0.2), inset 0 0 40px rgba(192,57,43,0.1)",
          animation: "deathSavePulse 3s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Title */}
        <div className="text-center">
          <h2
            className="font-[family-name:var(--font-display)] text-2xl md:text-4xl font-bold tracking-[0.2em] uppercase"
            style={{
              color: fallen ? "#c0392b" : stabilized ? "#2ecc71" : "#c0392b",
              textShadow: fallen
                ? "0 0 30px rgba(192,57,43,0.4)"
                : stabilized
                  ? "0 0 30px rgba(46,204,113,0.4)"
                  : "0 0 30px rgba(192,57,43,0.3)",
            }}
          >
            {fallen ? "Fallen..." : stabilized ? "Stabilized!" : "Death Saving Throw"}
          </h2>
          <div
            className="w-32 h-px mx-auto mt-3"
            style={{
              background: fallen
                ? "linear-gradient(to right, transparent, #c0392b60, transparent)"
                : stabilized
                  ? "linear-gradient(to right, transparent, #2ecc7160, transparent)"
                  : "linear-gradient(to right, transparent, #c0392b40, transparent)",
            }}
          />
        </div>

        {/* D20 Roll Display */}
        {(state.rolling || state.roll !== null) && !stabilized && !fallen && (
          <div className="flex flex-col items-center gap-3">
            <div
              className={`w-28 h-28 md:w-36 md:h-36 flex items-center justify-center rounded-2xl border-2 ${
                state.rolling
                  ? "border-gold/40"
                  : state.success
                    ? "border-success/60 shadow-[0_0_40px_rgba(46,204,113,0.3)]"
                    : "border-danger/60 shadow-[0_0_40px_rgba(192,57,43,0.3)]"
              }`}
              style={{
                background: state.rolling
                  ? "rgba(201,162,39,0.08)"
                  : state.success
                    ? "rgba(46,204,113,0.08)"
                    : "rgba(192,57,43,0.08)",
                animation: state.rolling ? "deathSaveRollSpin 0.1s linear infinite" : "none",
              }}
            >
              <span
                className={`font-[family-name:var(--font-display)] text-5xl md:text-7xl font-bold transition-all duration-300 ${
                  state.rolling
                    ? "text-gold/60"
                    : state.success
                      ? "text-success-light"
                      : "text-danger-light"
                }`}
                style={{
                  textShadow: state.rolling
                    ? "none"
                    : state.success
                      ? "0 0 20px rgba(46,204,113,0.5)"
                      : "0 0 20px rgba(192,57,43,0.5)",
                }}
              >
                {displayNumber || "?"}
              </span>
            </div>
            {!state.rolling && state.roll !== null && (
              <span
                className={`text-sm font-semibold tracking-wider uppercase ${
                  state.roll === 20
                    ? "text-gold"
                    : state.success
                      ? "text-success-light"
                      : "text-danger-light"
                }`}
                style={{ animation: "deathSaveFadeIn 0.5s ease-out" }}
              >
                {state.roll === 20
                  ? "Natural 20!"
                  : state.roll === 1
                    ? "Natural 1..."
                    : state.success
                      ? "Success"
                      : "Failure"}
              </span>
            )}
          </div>
        )}

        {/* Death Save Circles */}
        {!stabilized && !fallen && (
          <div className="flex items-center gap-8">
            {/* Successes */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-success-light uppercase tracking-[0.2em] font-medium">
                Saves
              </span>
              <div className="flex items-center gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`s-${i}`}
                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-500 ${
                      i < state.successes
                        ? "bg-success border-success-light shadow-[0_0_10px_rgba(46,204,113,0.5)]"
                        : "bg-transparent border-success/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-parchment/10" />

            {/* Failures */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] text-danger-light uppercase tracking-[0.2em] font-medium">
                Fails
              </span>
              <div className="flex items-center gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`f-${i}`}
                    className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-500 ${
                      i < state.failures
                        ? "bg-danger border-danger-light shadow-[0_0_10px_rgba(192,57,43,0.5)]"
                        : "bg-transparent border-danger/20"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stabilized / Fallen final state */}
        {stabilized && (
          <div
            className="flex flex-col items-center gap-3"
            style={{ animation: "deathSaveFadeIn 1s ease-out" }}
          >
            <div
              className="w-20 h-20 rounded-full border-2 border-success/40 flex items-center justify-center"
              style={{
                background: "rgba(46,204,113,0.1)",
                boxShadow: "0 0 40px rgba(46,204,113,0.2)",
              }}
            >
              <span className="text-4xl">&#x2764;</span>
            </div>
            <p className="text-parchment/40 text-xs tracking-[0.3em] uppercase">
              You cling to life
            </p>
          </div>
        )}

        {fallen && (
          <div
            className="flex flex-col items-center gap-3"
            style={{ animation: "deathSaveFadeIn 1s ease-out" }}
          >
            <div
              className="w-20 h-20 rounded-full border-2 border-danger/40 flex items-center justify-center"
              style={{
                background: "rgba(192,57,43,0.1)",
                boxShadow: "0 0 40px rgba(192,57,43,0.2)",
              }}
            >
              <span className="text-4xl">&#x1F480;</span>
            </div>
            <p className="text-parchment/40 text-xs tracking-[0.3em] uppercase">
              The light fades
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface IdleScreenProps {
  title: string
  subtitle: string | null
  campaignId: string | null
  mood: Mood | undefined
}

function IdleScreen({ title, subtitle, campaignId, mood }: IdleScreenProps) {
  const [prevMood, setPrevMood] = useState(mood)
  const [fading, setFading] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (mood && mood.id !== prevMood?.id) {
      setFading(true)
      const t = setTimeout(() => {
        setPrevMood(mood)
        setFading(false)
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [mood])

  const gradient = mood?.gradient || ["#0d1b2a", "#070b14", "#020204"]
  const prevGradient = prevMood?.gradient || ["#0d1b2a", "#070b14", "#020204"]
  const accentColor = mood?.accentColor || "#c9a227"
  const isThornhaven = campaignId === "thornhaven"

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Previous mood gradient (base layer) */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 120%, ${prevGradient[0]} 0%, ${prevGradient[1]} 50%, ${prevGradient[2]} 100%)`,
        }}
      />
      {/* Current mood gradient (fades in over 2s) */}
      <div
        className="absolute inset-0 transition-opacity duration-2000"
        style={{
          background: `radial-gradient(ellipse at 50% 120%, ${gradient[0]} 0%, ${gradient[1]} 50%, ${gradient[2]} 100%)`,
          opacity: fading ? 0 : 1,
          transitionDuration: "2000ms",
        }}
      />

      {/* Particles — mood-specific or default floating dots */}
      {mood?.particles ? (
        <Particles
          key={mood.id}
          type={mood.particles}
          accentColor={mood.particleColor || accentColor}
        />
      ) : (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-parchment/10"
              style={{
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `idleFloat ${8 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Bottom gradient wash */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: `linear-gradient(to top, ${gradient[2]} 0%, transparent 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(74,111,165,0.1) 40px, rgba(74,111,165,0.1) 41px)",
            animation: "shimmerDrift 20s linear infinite",
          }}
        />
      </div>

      {isThornhaven ? (
        /* --- Thornhaven campaign idle --- */
        <div
          className={`relative z-10 flex flex-col items-center px-8 transition-all duration-1500 ${
            entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDuration: "1500ms" }}
        >
          {/* Large emblem */}
          <div
            className={`mb-8 transition-all ${entered ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
            style={{ transitionDuration: "2000ms", transitionDelay: "300ms" }}
          >
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              style={{ animation: "breathe 8s ease-in-out infinite" }}
            >
              {/* Outer ring */}
              <circle
                cx="80"
                cy="80"
                r="72"
                fill="none"
                stroke={accentColor}
                strokeWidth="1"
                opacity="0.3"
              />
              <circle
                cx="80"
                cy="80"
                r="66"
                fill="none"
                stroke={accentColor}
                strokeWidth="0.5"
                opacity="0.15"
              />
              {/* Inner ring */}
              <circle
                cx="80"
                cy="80"
                r="44"
                fill="none"
                stroke={accentColor}
                strokeWidth="0.5"
                opacity="0.2"
              />

              {/* Compass points */}
              {[0, 90, 180, 270].map((angle) => {
                const rad = (angle * Math.PI) / 180
                return (
                  <line
                    key={angle}
                    x1={80 + Math.cos(rad) * 36}
                    y1={80 + Math.sin(rad) * 36}
                    x2={80 + Math.cos(rad) * 68}
                    y2={80 + Math.sin(rad) * 68}
                    stroke={accentColor}
                    strokeWidth="1"
                    opacity="0.25"
                  />
                )
              })}
              {[45, 135, 225, 315].map((angle) => {
                const rad = (angle * Math.PI) / 180
                return (
                  <line
                    key={angle}
                    x1={80 + Math.cos(rad) * 48}
                    y1={80 + Math.sin(rad) * 48}
                    x2={80 + Math.cos(rad) * 64}
                    y2={80 + Math.sin(rad) * 64}
                    stroke={accentColor}
                    strokeWidth="0.5"
                    opacity="0.15"
                  />
                )
              })}

              {/* Central spiral */}
              <path
                d={`M 80 80 c 2,-10 12,-17 22,-14 c 12,3 17,17 12,29 c -6,15 -24,20 -36,12 c -17,-9 -22,-32 -10,-46 c 12,-19 38,-24 55,-10`}
                fill="none"
                stroke={accentColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.5"
              />

              {/* Waves */}
              <path
                d="M 40,120 q 10,-8 20,0 q 10,8 20,0 q 10,-8 20,0 q 10,8 20,0"
                fill="none"
                stroke={accentColor}
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.2"
              />
              <path
                d="M 48,128 q 8,-6 16,0 q 8,6 16,0 q 8,-6 16,0 q 8,6 16,0"
                fill="none"
                stroke={accentColor}
                strokeWidth="0.5"
                strokeLinecap="round"
                opacity="0.12"
              />
            </svg>
          </div>

          {/* Title */}
          <h1
            className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-bold tracking-wider mb-3 text-center transition-colors"
            style={{
              color: accentColor,
              textShadow: `0 0 60px ${accentColor}30, 0 0 120px ${accentColor}10, 0 4px 30px rgba(0,0,0,0.5)`,
              animation: "breathe 6s ease-in-out infinite",
              transitionDuration: "2000ms",
            }}
          >
            {title}
          </h1>

          {/* Decorative divider */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-16 h-px"
              style={{ background: `linear-gradient(to right, transparent, ${accentColor}40)` }}
            />
            <svg width="12" height="12" viewBox="0 0 12 12" style={{ opacity: 0.4 }}>
              <path d="M6,1 L11,6 L6,11 L1,6 Z" fill="none" stroke={accentColor} strokeWidth="1" />
            </svg>
            <div
              className="w-16 h-px"
              style={{ background: `linear-gradient(to left, transparent, ${accentColor}40)` }}
            />
          </div>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-parchment/25 text-sm tracking-[0.3em] uppercase font-light mb-6">
              {subtitle}
            </p>
          )}

          <p className="text-parchment/20 text-xs tracking-[0.4em] uppercase">
            Awaiting the Dungeon Master
          </p>
        </div>
      ) : (
        /* --- Generic idle (no campaign selected) --- */
        <div
          className={`relative z-10 text-center px-8 transition-all duration-1000 ${
            entered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="mb-6 opacity-[0.06]">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#c9a227" strokeWidth="1" />
              <circle cx="60" cy="60" r="35" fill="none" stroke="#c9a227" strokeWidth="0.5" />
              <circle cx="60" cy="60" r="20" fill="none" stroke="#c9a227" strokeWidth="0.5" />
            </svg>
          </div>
          <h1
            className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-bold tracking-wider mb-4"
            style={{
              color: "#c9a22740",
              textShadow: "0 0 40px rgba(201,162,39,0.05)",
              animation: "breathe 6s ease-in-out infinite",
            }}
          >
            {title}
          </h1>
          <div className="w-24 h-px mx-auto bg-gradient-to-r from-transparent via-gold-dim/20 to-transparent mb-4" />
          <p className="text-parchment/15 text-xs tracking-[0.4em] uppercase font-light">
            Awaiting the Dungeon Master
          </p>
        </div>
      )}
    </div>
  )
}
