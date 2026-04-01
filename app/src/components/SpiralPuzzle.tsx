import { useState, useEffect, useMemo } from "react"
import { useBroadcast } from "../hooks/useBroadcast"
import type { Handout } from "../types/campaign"

const CX = 300
const CY = 300

// Rune SVG paths — carved-stone aesthetic, centered at (0,0), ~24px extent
const RUNE_PATHS: Record<string, string> = {
  // Solution runes (water-themed)
  wave: "M-12,-4 q4,-6 8,0 q4,6 8,0 M-12,0 q4,-6 8,0 q4,6 8,0 M-12,4 q4,-6 8,0 q4,6 8,0",
  spiral: "M0,0 c2,-4 7,-6 10,-3 c4,3 3,10 -2,12 c-6,3 -14,0 -15,-7 c-1,-8 5,-16 14,-17",
  droplet: "M0,-12 c0,0 -8,9 -8,15 a8,8 0 0,0 16,0 c0,-6 -8,-15 -8,-15z",
  // Distractors
  flame: "M0,10 c-2,-3 -6,-7 -5,-12 c0,-3 2,-5 5,-1 c3,-4 5,-2 5,1 c1,5 -3,9 -5,12z",
  star: "M0,-11 l3,8 l8,1 l-6,5 l2,8 l-7,-5 l-7,5 l2,-8 l-6,-5 l8,-1z",
  mountain: "M-13,8 l6,-18 l3,8 l5,-14 l12,16",
  eye: "M-12,0 q6,-10 12,-10 q6,0 12,10 q-6,10 -12,10 q-6,0 -12,-10z M-3,0 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0",
  lightning: "M3,-12 l-6,9 h5 l-6,9",
  skull:
    "M-8,-2 c0,-6 4,-10 8,-10 c4,0 8,4 8,10 c0,4 -2,7 -4,8 l-1,4 h-6 l-1,-4 c-2,-1 -4,-4 -4,-8z M-3,-4 a2,2 0 1,0 .1,0z M4,-4 a2,2 0 1,0 .1,0z",
  moon: "M4,-9 a9,9 0 1,0 0,18 a6,6 0 1,1 0,-18z",
  sun: "M0,-4 a4,4 0 1,0 .1,0z M0,-10 v3 M0,7 v3 M-10,0 h3 M7,0 h3 M-7,-7 l2,2 M5,5 l2,2 M7,-7 l-2,2 M-5,5 l-2,2",
  shield: "M0,-10 l-9,4 v6 c0,6 4,9 9,12 c5,-3 9,-6 9,-12 v-6z",
}

// Ring configurations: [solution_rune, distractor, distractor, distractor]
const RING_RUNES = [
  ["wave", "flame", "star", "mountain"],
  ["spiral", "eye", "lightning", "skull"],
  ["droplet", "moon", "sun", "shield"],
]

// Ring geometry: inner radius, outer radius, mid radius (for rune placement)
const RINGS = [
  { ri: 210, ro: 260, rm: 235 },
  { ri: 145, ro: 195, rm: 170 },
  { ri: 80, ro: 130, rm: 105 },
]

function runePosition(ringIndex: number, posIndex: number) {
  const angle = (posIndex * 90 - 90) * (Math.PI / 180)
  const r = RINGS[ringIndex].rm
  return {
    x: CX + Math.cos(angle) * r,
    y: CY + Math.sin(angle) * r,
  }
}

function randomStart(): number[] {
  return [
    1 + Math.floor(Math.random() * 3),
    1 + Math.floor(Math.random() * 3),
    1 + Math.floor(Math.random() * 3),
  ]
}

export default function SpiralPuzzle({
  handout,
}: {
  handout: Handout & { solvedInscription?: string }
}) {
  const { showToPlayer } = useBroadcast()
  const [rotations, setRotations] = useState(randomStart)
  const [solved, setSolved] = useState(false)
  const [solvePhase, setSolvePhase] = useState(0)

  const particles = useMemo(
    () =>
      Array.from({ length: 45 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        duration: 10 + Math.random() * 15,
        delay: Math.random() * 12,
      })),
    [],
  )

  // Solve detection
  useEffect(() => {
    if (!solved && rotations.every((r) => r === 0)) {
      setSolved(true)
      setSolvePhase(1)
      showToPlayer("puzzleSolved", null)
      const t = setTimeout(() => setSolvePhase(2), 1500)
      return () => clearTimeout(t)
    }
  }, [rotations, solved, showToPlayer])

  const clickRing = (index: number) => {
    if (solved) return
    setRotations((prev) => {
      const next = [...prev]
      next[index] = (next[index] + 1) % 4
      return next
    })
  }

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 60%, #0e1318 0%, #080c10 50%, #050608 100%)",
      }}
    >
      {/* Ambient cave particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: "#3a8a7a",
              opacity: 0.15,
              animation: `idleFloat ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Instruction text */}
      {!solved && (
        <p
          className="relative z-10 text-sm tracking-[0.25em] uppercase mb-6 select-none"
          style={{ color: "#5a8a80", fontFamily: "var(--font-display)" }}
        >
          Align the runes at the keystone
        </p>
      )}

      {/* SVG Puzzle */}
      <svg
        viewBox="0 0 600 600"
        className="relative z-10 w-full max-w-[min(600px,85vmin)] h-auto select-none"
      >
        <defs>
          <filter id="runeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feFlood floodColor="#4aeadc" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Stone door background */}
        <circle cx={CX} cy={CY} r="275" fill="#15150f" stroke="#2a2a22" strokeWidth="3" />
        <circle cx={CX} cy={CY} r="272" fill="none" stroke="#1e1e16" strokeWidth="1" />

        {/* Keystone marker — chevron at 12 o'clock */}
        <path
          d={`M${CX - 15},30 L${CX},15 L${CX + 15},30`}
          stroke="#4a8a7a"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={solved ? 1 : 0.6}
        />
        <circle cx={CX} cy={10} r="2" fill="#4a8a7a" opacity={solved ? 0.8 : 0.35} />

        {/* Rings */}
        {RINGS.map((ring, ri) => {
          return (
            <g
              key={ri}
              onClick={() => clickRing(ri)}
              style={{
                transform: `rotate(${rotations[ri] * 90}deg)`,
                transformOrigin: `${CX}px ${CY}px`,
                transition: "transform 400ms cubic-bezier(0.5, 0, 0.3, 1)",
                cursor: solved ? "default" : "pointer",
              }}
            >
              {/* Ring body */}
              <circle
                cx={CX}
                cy={CY}
                r={ring.rm}
                fill="none"
                stroke={solvePhase >= 1 ? "#1a2420" : "#1e1e16"}
                strokeWidth={ring.ro - ring.ri}
                style={{ transition: "stroke 800ms" }}
              />

              {/* Ring edges */}
              <circle cx={CX} cy={CY} r={ring.ro} fill="none" stroke="#2a2a22" strokeWidth="1.5" />
              <circle cx={CX} cy={CY} r={ring.ri} fill="none" stroke="#2a2a22" strokeWidth="1.5" />

              {/* Runes */}
              {RING_RUNES[ri].map((runeKey, pi) => {
                const pos = runePosition(ri, pi)
                const isSolution = pi === 0
                const glowing = isSolution && solved
                return (
                  <path
                    key={pi}
                    d={RUNE_PATHS[runeKey]}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    fill="none"
                    stroke={glowing ? "#4aeadc" : "#9a9a8a"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={glowing ? "url(#runeGlow)" : undefined}
                    style={{ transition: "stroke 0.4s" }}
                  />
                )
              })}
            </g>
          )
        })}

        {/* Center stone */}
        <circle cx={CX} cy={CY} r="55" fill="#15150f" stroke="#2a2a22" strokeWidth="2" />
        <circle cx={CX} cy={CY} r="30" fill="none" stroke="#22221a" strokeWidth="1" />
        <path
          d={`M${CX},${CY} c2,-4 7,-6 10,-3 c4,3 3,10 -2,12 c-6,3 -14,0 -15,-7 c-1,-8 5,-16 14,-17`}
          fill="none"
          stroke="#2a2a22"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Solve pulse rings */}
        {solvePhase >= 1 &&
          RINGS.map((ring, ri) => (
            <circle
              key={`pulse-${ri}`}
              cx={CX}
              cy={CY}
              r={ring.rm}
              fill="none"
              stroke="#4aeadc"
              strokeWidth="2"
              opacity="0.4"
              style={{ animation: "breathe 1.5s ease-in-out" }}
            />
          ))}
      </svg>

      {/* Inscription (after solve) */}
      {solvePhase >= 2 && (
        <div
          className="relative z-10 mt-8 max-w-lg px-6 text-center"
          style={{ animation: "inscriptionFade 2s ease-out forwards" }}
        >
          <div
            className="w-16 h-px mx-auto mb-4"
            style={{ background: "linear-gradient(to right, transparent, #4a8a7a60, transparent)" }}
          />
          <p
            className="text-lg leading-relaxed tracking-wide"
            style={{
              fontFamily: "var(--font-display)",
              color: "#7abab0",
              textShadow: "0 0 20px rgba(74,138,122,0.3)",
            }}
          >
            {handout.solvedInscription}
          </p>
          <div
            className="w-16 h-px mx-auto mt-4"
            style={{ background: "linear-gradient(to right, transparent, #4a8a7a60, transparent)" }}
          />
        </div>
      )}
    </div>
  )
}
