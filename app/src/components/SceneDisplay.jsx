import { useEffect, useState } from "react"
import Particles from "./Particles"

const symbolSvgs = {
  shield: (color) => (
    <svg viewBox="0 0 120 140" className="w-full h-full">
      <defs>
        <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path d="M60,8 L110,30 L105,90 L60,130 L15,90 L10,30 Z" fill="none" stroke="url(#shieldGrad)" strokeWidth="2.5" />
      <path d="M60,22 L98,40 L94,85 L60,118 L26,85 L22,40 Z" fill={color} fillOpacity="0.06" />
      <line x1="60" y1="40" x2="60" y2="105" stroke={color} strokeOpacity="0.3" strokeWidth="1.5" />
      <line x1="30" y1="65" x2="90" y2="65" stroke={color} strokeOpacity="0.3" strokeWidth="1.5" />
    </svg>
  ),
  anchor: (color) => (
    <svg viewBox="0 0 120 140" className="w-full h-full">
      <defs>
        <linearGradient id="anchorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="25" r="12" fill="none" stroke="url(#anchorGrad)" strokeWidth="2.5" />
      <line x1="60" y1="37" x2="60" y2="120" stroke={color} strokeOpacity="0.5" strokeWidth="2.5" />
      <path d="M25,95 Q60,130 95,95" fill="none" stroke="url(#anchorGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="38" y1="65" x2="82" y2="65" stroke={color} strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  quill: (color) => (
    <svg viewBox="0 0 120 140" className="w-full h-full">
      <path d="M85,10 Q70,50 50,90 L45,130 L50,125 Q65,85 95,15 Z" fill={color} fillOpacity="0.1" stroke={color} strokeOpacity="0.5" strokeWidth="1.5" />
      <line x1="50" y1="90" x2="45" y2="130" stroke={color} strokeOpacity="0.7" strokeWidth="2" />
      <ellipse cx="42" cy="132" rx="3" ry="2" fill={color} fillOpacity="0.4" />
    </svg>
  ),
  flask: (color) => (
    <svg viewBox="0 0 120 140" className="w-full h-full">
      <path d="M48,10 L48,50 L20,110 Q18,125 35,128 L85,128 Q102,125 100,110 L72,50 L72,10 Z" fill={color} fillOpacity="0.06" stroke={color} strokeOpacity="0.5" strokeWidth="2" />
      <line x1="42" y1="10" x2="78" y2="10" stroke={color} strokeOpacity="0.6" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M28,95 Q60,85 92,95 L100,110 Q102,125 85,128 L35,128 Q18,125 20,110 Z" fill={color} fillOpacity="0.12" />
      <circle cx="45" cy="108" r="4" fill={color} fillOpacity="0.2" />
      <circle cx="70" cy="115" r="3" fill={color} fillOpacity="0.15" />
    </svg>
  ),
  mug: (color) => (
    <svg viewBox="0 0 120 140" className="w-full h-full">
      <rect x="25" y="40" width="60" height="80" rx="5" fill={color} fillOpacity="0.06" stroke={color} strokeOpacity="0.5" strokeWidth="2" />
      <path d="M85,55 Q105,55 105,75 Q105,95 85,95" fill="none" stroke={color} strokeOpacity="0.4" strokeWidth="2" />
      <path d="M35,38 Q40,20 50,30 Q55,15 65,28 Q72,18 78,38" fill="none" stroke={color} strokeOpacity="0.2" strokeWidth="1.5" />
    </svg>
  ),
  fish: (color) => (
    <svg viewBox="0 0 140 100" className="w-full h-full">
      <path d="M30,50 Q60,15 100,50 Q60,85 30,50 Z" fill={color} fillOpacity="0.08" stroke={color} strokeOpacity="0.5" strokeWidth="2" />
      <path d="M100,50 L125,30 L125,70 Z" fill={color} fillOpacity="0.1" stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
      <circle cx="55" cy="45" r="4" fill={color} fillOpacity="0.5" />
    </svg>
  ),
  spear: (color) => (
    <svg viewBox="0 0 60 140" className="w-full h-full">
      <line x1="30" y1="30" x2="30" y2="135" stroke={color} strokeOpacity="0.5" strokeWidth="2.5" />
      <path d="M30,5 L40,30 L30,25 L20,30 Z" fill={color} fillOpacity="0.3" stroke={color} strokeOpacity="0.6" strokeWidth="1.5" />
    </svg>
  ),
  wave: (color) => (
    <svg viewBox="0 0 140 100" className="w-full h-full">
      <path d="M10,50 Q35,20 60,50 Q85,80 110,50 Q120,35 130,50" fill="none" stroke={color} strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M10,70 Q35,40 60,70 Q85,100 110,70" fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  spiral: (color) => (
    <svg viewBox="0 0 120 120" className="w-full h-full">
      <path d="M60,60 m0,-40 a40,40 0 1,1 0,80 a30,30 0 1,0 0,-60 a20,20 0 1,1 0,40 a10,10 0 1,0 0,-20" fill="none" stroke={color} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
}

function LocationScene({ scene }) {
  const [entered, setEntered] = useState(false)
  useEffect(() => { const t = setTimeout(() => setEntered(true), 100); return () => clearTimeout(t) }, [])

  return (
    <>
      <Particles type={scene.particles} accentColor={scene.accentColor} />

      {/* Horizon glow */}
      <div className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 50% 100%, ${scene.accentColor}15, transparent 70%)`,
      }} />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
      }} />

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center h-full text-center px-8 transition-all duration-1000 ${
        entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}>
        <p className="text-sm tracking-[0.4em] uppercase mb-3 font-light"
          style={{ color: scene.accentColor, opacity: 0.7 }}>
          {scene.subtitle}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider mb-6"
          style={{
            color: scene.accentColor,
            textShadow: `0 0 60px ${scene.accentColor}30, 0 0 120px ${scene.accentColor}10`,
          }}>
          {scene.name}
        </h1>
        <div className="w-40 h-px mx-auto mb-6" style={{
          background: `linear-gradient(to right, transparent, ${scene.accentColor}50, transparent)`,
        }} />
        <p className={`text-parchment/50 text-lg md:text-xl max-w-xl leading-relaxed italic transition-all duration-1000 delay-500 ${
          entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}>
          {scene.description}
        </p>
      </div>
    </>
  )
}

function CharacterScene({ scene }) {
  const [entered, setEntered] = useState(false)
  useEffect(() => { const t = setTimeout(() => setEntered(true), 100); return () => clearTimeout(t) }, [])

  const SymbolComponent = symbolSvgs[scene.symbol]

  return (
    <>
      <Particles type="dust" accentColor={scene.accentColor} />

      {/* Radial glow behind symbol */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full" style={{
          background: `radial-gradient(circle, ${scene.accentColor}12, transparent 70%)`,
        }} />
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
      }} />

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center h-full text-center px-8 transition-all duration-1000 ${
        entered ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}>
        {/* Symbol */}
        {SymbolComponent && (
          <div className={`w-24 h-28 md:w-32 md:h-36 mb-8 transition-all duration-1200 delay-200 ${
            entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            {SymbolComponent(scene.accentColor)}
          </div>
        )}

        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider mb-3"
          style={{
            color: scene.accentColor,
            textShadow: `0 0 60px ${scene.accentColor}30`,
          }}>
          {scene.name}
        </h1>
        <p className="text-sm tracking-[0.4em] uppercase mb-6 font-light"
          style={{ color: scene.accentColor, opacity: 0.6 }}>
          {scene.title}
        </p>
        <div className="w-32 h-px mx-auto mb-6" style={{
          background: `linear-gradient(to right, transparent, ${scene.accentColor}50, transparent)`,
        }} />
        <p className={`text-parchment/50 text-lg md:text-xl max-w-lg leading-relaxed italic transition-all duration-1000 delay-500 ${
          entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}>
          {scene.description}
        </p>
      </div>
    </>
  )
}

function CombatScene({ scene }) {
  const [entered, setEntered] = useState(false)
  useEffect(() => { const t = setTimeout(() => setEntered(true), 100); return () => clearTimeout(t) }, [])

  return (
    <>
      {/* Danger pulse */}
      <div className="absolute inset-0 pointer-events-none" style={{
        animation: "dangerPulse 3s ease-in-out infinite",
      }}>
        <div className="absolute inset-0" style={{
          background: `radial-gradient(ellipse at 50% 50%, ${scene.accentColor}08, transparent 60%)`,
        }} />
      </div>

      <Particles type="sparks" accentColor={scene.accentColor} />

      {/* Edge glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        boxShadow: `inset 0 0 150px ${scene.accentColor}15`,
      }} />

      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
      }} />

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center justify-center h-full text-center px-8 transition-all duration-700 ${
        entered ? "opacity-100 scale-100" : "opacity-0 scale-105"
      }`}>
        {/* Crossed swords icon */}
        <div className={`mb-6 transition-all duration-800 delay-100 ${
          entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <line x1="10" y1="50" x2="50" y2="10" stroke={scene.accentColor} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
            <line x1="50" y1="50" x2="10" y2="10" stroke={scene.accentColor} strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.7" />
            <line x1="7" y1="47" x2="16" y2="53" stroke={scene.accentColor} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
            <line x1="53" y1="47" x2="44" y2="53" stroke={scene.accentColor} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.5" />
          </svg>
        </div>

        <p className="text-xs tracking-[0.5em] uppercase mb-2 font-semibold"
          style={{ color: scene.accentColor }}>
          Combat
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider mb-3"
          style={{
            color: scene.accentColor,
            textShadow: `0 0 60px ${scene.accentColor}40`,
          }}>
          {scene.name}
        </h1>
        <p className="text-sm tracking-[0.3em] uppercase mb-6 font-light"
          style={{ color: scene.accentColor, opacity: 0.5 }}>
          {scene.subtitle}
        </p>
        <div className="w-40 h-px mx-auto mb-6" style={{
          background: `linear-gradient(to right, transparent, ${scene.accentColor}60, transparent)`,
        }} />
        <p className={`text-parchment/50 text-lg max-w-lg leading-relaxed italic transition-all duration-1000 delay-400 ${
          entered ? "opacity-100" : "opacity-0"
        }`}>
          {scene.description}
        </p>
      </div>
    </>
  )
}

export default function SceneDisplay({ scene }) {
  const bgGradient = scene.gradient
    ? `linear-gradient(160deg, ${scene.gradient.join(", ")})`
    : "#000"

  return (
    <div className="h-screen w-screen relative overflow-hidden" style={{ background: bgGradient }}>
      {scene.displayType === "location" && <LocationScene scene={scene} />}
      {scene.displayType === "character" && <CharacterScene scene={scene} />}
      {scene.displayType === "combat" && <CombatScene scene={scene} />}
    </div>
  )
}
