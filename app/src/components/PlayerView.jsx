import { useState, useEffect, useRef } from "react"
import { useBroadcast } from "../hooks/useBroadcast"
import { locationVisuals, characterVisuals, combatVisuals } from "../data/visuals"
import { battleMaps } from "../data/maps"
import SceneDisplay from "./SceneDisplay"
import BattleMap from "./BattleMap"

export default function PlayerView() {
  const { lastMessage, connected } = useBroadcast()
  const [scene, setScene] = useState(null)
  const [transitioning, setTransitioning] = useState(false)
  const [activeMap, setActiveMap] = useState(null)
  const [revealedTokens, setRevealedTokens] = useState(new Set())

  useEffect(() => {
    if (!lastMessage) return

    if (lastMessage.type === "clear") {
      setTransitioning(true)
      setTimeout(() => {
        setScene(null)
        setActiveMap(null)
        setRevealedTokens(new Set())
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
          setRevealedTokens(new Set())
          setTransitioning(false)
        }, 600)
      }
      return
    }

    // Token reveal — add a token to current map
    if (lastMessage.type === "reveal") {
      setRevealedTokens(prev => new Set([...prev, lastMessage.tokenId]))
      return
    }

    // Scene reveals (location, character, combat splash)
    let visual = null
    if (lastMessage.type === "location") {
      visual = locationVisuals[lastMessage.id]
      if (visual) visual = { ...visual, displayType: "location" }
    } else if (lastMessage.type === "character") {
      visual = characterVisuals[lastMessage.id]
      if (visual) visual = { ...visual, displayType: "character" }
    } else if (lastMessage.type === "combat") {
      visual = combatVisuals[lastMessage.id]
      if (visual) visual = { ...visual, displayType: "combat" }
    }

    if (visual) {
      setTransitioning(true)
      setTimeout(() => {
        setActiveMap(null)
        setRevealedTokens(new Set())
        setScene(visual)
        setTransitioning(false)
      }, 600)
    }
  }, [lastMessage])

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Connection indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs transition-opacity duration-1000 ${
          scene || activeMap ? 'opacity-0' : 'opacity-60'
        }`}>
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-success animate-pulse' : 'bg-danger'}`} />
          <span className="text-parchment/40">
            {connected ? "Connected" : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Transition overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 pointer-events-none transition-opacity duration-600 ${
          transitioning ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Content */}
      {activeMap ? (
        <BattleMap map={activeMap} revealedTokens={revealedTokens} />
      ) : scene ? (
        <SceneDisplay scene={scene} />
      ) : (
        <IdleScreen />
      )}
    </div>
  )
}

function IdleScreen() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at 50% 120%, #0d1b2a 0%, #070b14 50%, #020204 100%)",
      }} />
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
      <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
        background: "linear-gradient(to top, #0a1828 0%, transparent 100%)",
      }}>
        <div className="absolute inset-0 opacity-20" style={{
          background: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(74,111,165,0.1) 40px, rgba(74,111,165,0.1) 41px)",
          animation: "shimmerDrift 20s linear infinite",
        }} />
      </div>
      <div className="relative z-10 text-center px-8">
        <h1
          className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-bold tracking-wider mb-4"
          style={{
            color: "#c9a227",
            textShadow: "0 0 40px rgba(201,162,39,0.15), 0 0 80px rgba(201,162,39,0.05)",
            animation: "breathe 6s ease-in-out infinite",
          }}
        >
          The Silence of Thornhaven
        </h1>
        <div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-gold-dim to-transparent mb-4" />
        <p className="text-parchment/30 text-sm tracking-[0.3em] uppercase font-light">
          Awaiting the Dungeon Master
        </p>
      </div>
      <div className="absolute bottom-12 opacity-[0.03]">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <path
            d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0 M100,100 m-55,0 a55,55 0 1,0 110,0 a55,55 0 1,0 -110,0 M100,100 m-30,0 a30,30 0 1,1 60,0 a30,30 0 1,1 -60,0"
            fill="none" stroke="#c9a227" strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  )
}
