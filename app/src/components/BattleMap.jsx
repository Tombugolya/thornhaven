import { useEffect, useState, useRef, useCallback } from "react"

function screenToSVG(svg, clientX, clientY) {
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  return pt.matrixTransform(svg.getScreenCTM().inverse())
}

function Token({ id, token, pos, revealed, delay = 0, draggable, onDragStart, onDrag, onDragEnd, draggingId }) {
  const [visible, setVisible] = useState(false)
  const isDragging = draggingId === id

  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => setVisible(true), delay)
      return () => clearTimeout(t)
    }
  }, [revealed, delay])

  if (!revealed) return null

  const x = pos?.x ?? token.x
  const y = pos?.y ?? token.y
  const r = 18
  const glowColor = token.ally ? token.color : "#ff4444"

  return (
    <g
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.3)",
        transformOrigin: `${x}px ${y}px`,
        transition: isDragging
          ? "none"
          : "opacity 0.8s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: draggable ? (isDragging ? "grabbing" : "grab") : "default",
        pointerEvents: draggable ? "auto" : "none",
      }}
      onPointerDown={(e) => {
        if (!draggable) return
        e.preventDefault()
        e.stopPropagation()
        e.currentTarget.setPointerCapture(e.pointerId)
        onDragStart?.(id, e)
      }}
      onPointerMove={(e) => {
        if (!isDragging) return
        e.preventDefault()
        onDrag?.(id, e)
      }}
      onPointerUp={(e) => {
        if (!isDragging) return
        e.currentTarget.releasePointerCapture(e.pointerId)
        onDragEnd?.(id, e)
      }}
    >
      {/* Drag ring */}
      {isDragging && (
        <circle cx={x} cy={y} r={r + 6} fill="none" stroke="#c9a227" strokeWidth="2" opacity="0.6">
          <animate attributeName="r" values={`${r + 4};${r + 8};${r + 4}`} dur="1s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Reveal glow */}
      {!token.ally && !isDragging && (
        <circle cx={x} cy={y} r={r + 12} fill={glowColor} opacity="0.15">
          <animate attributeName="r" values={`${r + 8};${r + 16};${r + 8}`} dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.08;0.15" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Token shadow */}
      <circle cx={x + 2} cy={y + 2} r={r} fill="black" opacity="0.4" />
      {/* Token body */}
      <circle cx={x} cy={y} r={r}
        fill={token.color} opacity={isDragging ? 1 : 0.9}
        stroke={isDragging ? "#c9a227" : token.ally ? token.color : "#ff6666"}
        strokeWidth={isDragging ? 3 : token.ally ? 1.5 : 2.5} />
      {/* Initials */}
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
        fill="white" fontSize="11" fontWeight="bold" fontFamily="Inter, sans-serif"
        style={{ pointerEvents: "none" }}>
        {token.initials}
      </text>
      {/* Label below */}
      <text x={x} y={y + r + 14} textAnchor="middle"
        fill={token.color} fontSize="9" fontFamily="Inter, sans-serif" opacity="0.8"
        style={{ pointerEvents: "none" }}>
        {token.label}
      </text>
    </g>
  )
}

function RenderFeatures({ features, mapWidth, mapHeight }) {
  return features.map((f, i) => {
    switch (f.type) {
      case "building":
        return (
          <g key={i}>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill={f.color || "#141420"} stroke="#222238" strokeWidth="1.5" />
            {f.label && (
              <text x={f.x + f.w / 2} y={f.y + f.h / 2} textAnchor="middle" dominantBaseline="middle"
                fill="#444466" fontSize="10" fontFamily="Inter, sans-serif">
                {f.label.split("\n").map((line, j) => (
                  <tspan key={j} x={f.x + f.w / 2} dy={j === 0 ? 0 : 13}>{line}</tspan>
                ))}
              </text>
            )}
          </g>
        )
      case "road":
        return (
          <g key={i}>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="#0c0c18" />
            <pattern id="cobble" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="transparent" />
              <rect x="1" y="1" width="8" height="8" rx="1" fill="#14141f" opacity="0.5" />
              <rect x="11" y="11" width="8" height="8" rx="1" fill="#14141f" opacity="0.3" />
            </pattern>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="url(#cobble)" />
          </g>
        )
      case "alley":
        return (
          <g key={i}>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="#080810" stroke="#1a1a2e" strokeWidth="1" strokeDasharray="4 2" />
            {f.label && (
              <text x={f.x + f.w / 2} y={f.y + f.h / 2} textAnchor="middle" dominantBaseline="middle"
                fill="#555577" fontSize="8" fontFamily="Inter, sans-serif" fontStyle="italic">
                {f.label}
              </text>
            )}
          </g>
        )
      case "lantern":
        return (
          <g key={i}>
            <defs>
              <radialGradient id={`lantern-${i}`}>
                <stop offset="0%" stopColor={f.color} stopOpacity="0.15" />
                <stop offset="60%" stopColor={f.color} stopOpacity="0.05" />
                <stop offset="100%" stopColor={f.color} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={f.x} cy={f.y} r={f.radius} fill={`url(#lantern-${i})`}>
              <animate attributeName="r" values={`${f.radius - 3};${f.radius + 3};${f.radius - 3}`} dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx={f.x} cy={f.y} r="3" fill={f.color} opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.5;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        )
      case "obstacle":
        return (
          <g key={i}>
            {f.shape === "circle" ? (
              <circle cx={f.x + f.w / 2} cy={f.y + f.h / 2} r={f.w / 2} fill="#1a1a28" stroke="#2a2a3e" strokeWidth="1" />
            ) : (
              <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="#1a1a28" stroke="#2a2a3e" strokeWidth="1" rx="2" />
            )}
            {f.label && (
              <text x={f.x + f.w / 2} y={f.y + f.h + 12} textAnchor="middle"
                fill="#555577" fontSize="7" fontFamily="Inter, sans-serif">
                {f.label}
              </text>
            )}
          </g>
        )
      case "wall":
        return <g key={i}><rect x={f.x} y={f.y} width={f.w} height={f.h} fill={f.color || "#1a1510"} stroke="#2a2520" strokeWidth="2" rx="3" /></g>
      case "furniture":
        return (
          <g key={i}>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill={f.color || "#2a1f15"} stroke="#3a2f20" strokeWidth="1.5" rx="3" />
            {f.label && (
              <text x={f.x + f.w / 2} y={f.y + f.h / 2} textAnchor="middle" dominantBaseline="middle"
                fill="#665540" fontSize="9" fontFamily="Inter, sans-serif">{f.label}</text>
            )}
          </g>
        )
      case "entrance":
        return (
          <g key={i}>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="transparent" stroke="#8a6e1a" strokeWidth="2" strokeDasharray="6 3" rx="4" />
            {f.label && (
              <text x={f.x + f.w / 2} y={f.y + f.h / 2} textAnchor="middle" dominantBaseline="middle"
                fill="#8a6e1a" fontSize="8" fontFamily="Inter, sans-serif">
                {f.label.split("\n").map((line, j) => (
                  <tspan key={j} x={f.x + f.w / 2} dy={j === 0 ? 0 : 11}>{line}</tspan>
                ))}
              </text>
            )}
          </g>
        )
      case "room":
        return (
          <g key={i}>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill={f.color || "#1a1210"} stroke={f.border || "#2a2520"} strokeWidth="2" rx="2" />
            {f.label && (
              <text x={f.x + f.w / 2} y={f.y + f.h / 2} textAnchor="middle" dominantBaseline="middle"
                fill={f.border || "#665540"} fontSize="9" fontFamily="Inter, sans-serif" fontStyle="italic">
                {f.label.split("\n").map((line, j) => (
                  <tspan key={j} x={f.x + f.w / 2} dy={j === 0 ? 0 : 13}>{line}</tspan>
                ))}
              </text>
            )}
          </g>
        )
      case "door":
        return (
          <g key={i}>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="#8a6e1a" opacity="0.6" rx="1" />
            {f.label && (
              <text x={f.x + f.w / 2 + 14} y={f.y + f.h / 2} textAnchor="start" dominantBaseline="middle"
                fill="#8a6e1a" fontSize="8" fontFamily="Inter, sans-serif">
                {f.label.split("\n").map((line, j) => (
                  <tspan key={j} x={f.x + f.w / 2 + 14} dy={j === 0 ? 0 : 11}>{line}</tspan>
                ))}
              </text>
            )}
          </g>
        )
      case "water":
        return (
          <g key={i}>
            <defs>
              <pattern id="waterPattern" width="60" height="20" patternUnits="userSpaceOnUse">
                <path d="M0,10 Q15,5 30,10 Q45,15 60,10" fill="none" stroke="#1a3050" strokeWidth="0.5" opacity="0.4">
                  <animate attributeName="d" values="M0,10 Q15,5 30,10 Q45,15 60,10;M0,10 Q15,15 30,10 Q45,5 60,10;M0,10 Q15,5 30,10 Q45,15 60,10" dur="6s" repeatCount="indefinite" />
                </path>
              </pattern>
            </defs>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill={f.color || "#0a1428"} opacity="0.7" rx="3" />
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="url(#waterPattern)" rx="3" />
            <line x1={f.x} y1={f.y} x2={f.x + f.w} y2={f.y} stroke="#1a4060" strokeWidth="2" opacity="0.4" />
            {f.label && (
              <text x={f.x + f.w / 2} y={f.y + 18} textAnchor="middle"
                fill="#3a6090" fontSize="9" fontFamily="Inter, sans-serif" fontStyle="italic" opacity="0.7">
                {f.label.split("\n").map((line, j) => (
                  <tspan key={j} x={f.x + f.w / 2} dy={j === 0 ? 0 : 13}>{line}</tspan>
                ))}
              </text>
            )}
          </g>
        )
      case "altar":
        return (
          <g key={i}>
            <rect x={f.x} y={f.y} width={f.w} height={f.h} fill={f.color || "#0e0e20"} stroke="#3a2a5a" strokeWidth="2" rx="3" />
            <path
              d={`M${f.x + f.w / 2},${f.y + f.h / 2} m0,-15 a15,15 0 1,1 0,30 a10,10 0 1,0 0,-20 a5,5 0 1,1 0,10`}
              fill="none" stroke="#6a3fa5" strokeWidth="1" opacity="0.4">
              <animate attributeName="opacity" values="0.4;0.2;0.4" dur="5s" repeatCount="indefinite" />
            </path>
            {f.label && (
              <text x={f.x + f.w / 2} y={f.y - 8} textAnchor="middle"
                fill="#6a3fa5" fontSize="9" fontFamily="Cinzel, Georgia, serif" fontWeight="600" opacity="0.7">
                {f.label.split("\n").map((line, j) => (
                  <tspan key={j} x={f.x + f.w / 2} dy={j === 0 ? 0 : 12}>{line}</tspan>
                ))}
              </text>
            )}
          </g>
        )
      case "cave":
        return (
          <g key={i}>
            <rect x="0" y="0" width="800" height="700" fill="#030308" />
            <polygon points={f.innerPoints} fill={f.color || "#0a0a18"} stroke="#181830" strokeWidth="2" />
          </g>
        )
      case "glow":
        return (
          <g key={i}>
            <defs>
              <radialGradient id={`glow-${i}`}>
                <stop offset="0%" stopColor={f.color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={f.color} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={f.x} cy={f.y} r={f.radius} fill={`url(#glow-${i})`}>
              <animate attributeName="opacity" values="1;0.5;1" dur="6s" repeatCount="indefinite" />
            </circle>
          </g>
        )
      case "shimmer":
        return (
          <g key={i}>
            <defs>
              <radialGradient id={`shimmer-${i}`}>
                <stop offset="0%" stopColor={f.color} stopOpacity="0.08" />
                <stop offset="100%" stopColor={f.color} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx={f.x} cy={f.y} r={f.radius} fill={`url(#shimmer-${i})`}>
              <animate attributeName="r" values={`${f.radius - 10};${f.radius + 10};${f.radius - 10}`} dur="8s" repeatCount="indefinite" />
            </circle>
          </g>
        )
      default:
        return null
    }
  })
}

/**
 * BattleMap — renders an atmospheric SVG map with draggable tokens.
 *
 * Props:
 *  - map: map data from maps.js
 *  - revealedTokens: Set of token IDs that are visible
 *  - tokenPositions: { [id]: { x, y } } overrides from remote moves
 *  - role: "dm" | "player" — determines which tokens are draggable
 *  - onTokenMove: (tokenId, x, y) => void — called during/after drag
 *  - fullscreen: boolean — true for player view (fills screen), false for DM embed
 */
export default function BattleMap({ map, revealedTokens, tokenPositions = {}, role = "player", onTokenMove, fullscreen = true }) {
  const [entered, setEntered] = useState(false)
  const [draggingId, setDraggingId] = useState(null)
  const [localPositions, setLocalPositions] = useState({})
  const svgRef = useRef(null)
  const throttleRef = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Merge positions: map defaults < remote overrides < local drag
  const getPos = useCallback((id, token) => {
    if (localPositions[id]) return localPositions[id]
    if (tokenPositions[id]) return tokenPositions[id]
    return { x: token.x, y: token.y }
  }, [localPositions, tokenPositions])

  const handleDragStart = useCallback((id, e) => {
    setDraggingId(id)
  }, [])

  const handleDrag = useCallback((id, e) => {
    if (!svgRef.current) return
    const pt = screenToSVG(svgRef.current, e.clientX, e.clientY)
    const newPos = { x: Math.round(pt.x), y: Math.round(pt.y) }
    setLocalPositions(prev => ({ ...prev, [id]: newPos }))

    // Throttle network sends to every 50ms
    const now = Date.now()
    if (now - throttleRef.current > 50) {
      throttleRef.current = now
      onTokenMove?.(id, newPos.x, newPos.y)
    }
  }, [onTokenMove])

  const handleDragEnd = useCallback((id) => {
    setDraggingId(null)
    const pos = localPositions[id]
    if (pos) {
      onTokenMove?.(id, pos.x, pos.y)
    }
  }, [localPositions, onTokenMove])

  const isDraggable = useCallback((id, token) => {
    if (role === "dm") return true // DM can drag everything
    if (role === "player" && id === "player") return true // Player drags their own token
    return false
  }, [role])

  const allTokens = Object.entries(map.tokens)

  const svgContent = (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${map.width} ${map.height}`}
      className={fullscreen ? "w-full h-full" : "w-full"}
      preserveAspectRatio="xMidYMid meet"
      style={{
        filter: fullscreen ? "drop-shadow(0 0 60px rgba(0,0,0,0.9))" : "none",
        borderRadius: fullscreen ? "0.75rem" : "0.5rem",
        touchAction: "none",
      }}
    >
      <rect width={map.width} height={map.height} fill={map.background.gradient[0]} rx="8" />
      <RenderFeatures features={map.features} mapWidth={map.width} mapHeight={map.height} />
      {allTokens.map(([id, token]) => (
        <Token
          key={id}
          id={id}
          token={token}
          pos={getPos(id, token)}
          revealed={token.autoReveal || revealedTokens.has(id) || role === "dm"}
          delay={token.autoReveal ? 800 : 200}
          draggable={isDraggable(id, token)}
          draggingId={draggingId}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
        />
      ))}
    </svg>
  )

  if (!fullscreen) {
    // DM embedded view — no overlays, just the map
    return (
      <div className={`transition-all duration-500 ${entered ? "opacity-100" : "opacity-0"}`}
        style={{ background: `linear-gradient(160deg, ${map.background.gradient.join(", ")})`, borderRadius: "0.5rem", padding: "4px" }}>
        {svgContent}
      </div>
    )
  }

  // Player fullscreen view
  return (
    <div className="h-screen w-screen relative overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${map.background.gradient.join(", ")})` }}>

      <div className={`absolute inset-0 flex items-center justify-center p-4 transition-all duration-1000 delay-300 ${
        entered ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}>
        {svgContent}
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)",
      }} />

      <div className={`absolute top-0 left-0 right-0 z-10 text-center pt-5 pb-8 pointer-events-none transition-all duration-1000 ${
        entered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`} style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
      }}>
        <h1 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold text-gold tracking-wider"
          style={{ textShadow: "0 0 30px rgba(201,162,39,0.3)" }}>
          {map.name}
        </h1>
        <p className="text-parchment/30 text-[10px] tracking-[0.3em] uppercase mt-1">
          {map.subtitle}
        </p>
      </div>

      <div className={`absolute bottom-0 left-0 right-0 z-10 flex gap-3 justify-center px-4 pt-8 pb-4 pointer-events-none transition-all duration-1000 delay-700 ${
        entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`} style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
      }}>
        {map.terrainNotes.map((tn, i) => (
          <div key={i} className="bg-black/40 border border-parchment/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
            <span className="text-parchment/60 text-xs font-medium">{tn.label}: </span>
            <span className="text-parchment/40 text-xs italic">{tn.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
