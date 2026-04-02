import { useMemo } from "react"

interface ParticlesProps {
  type: string
  accentColor: string
}

const configs: Record<
  string,
  {
    count: number
    sizeRange: [number, number]
    speed: [number, number]
    opacity: number
    color: string
  }
> = {
  dust: { count: 25, sizeRange: [1, 3], speed: [10, 20], opacity: 0.15, color: "#e0d5c1" },
  sparks: { count: 15, sizeRange: [1, 3], speed: [4, 8], opacity: 0.4, color: "accent" },
  fog: { count: 8, sizeRange: [80, 200], speed: [25, 45], opacity: 0.04, color: "#aabbcc" },
  bioluminescence: {
    count: 35,
    sizeRange: [2, 5],
    speed: [6, 14],
    opacity: 0.5,
    color: "#1abc9c",
  },
  void: { count: 12, sizeRange: [2, 6], speed: [15, 30], opacity: 0.2, color: "#6a3fa5" },
}

export default function Particles({ type, accentColor }: ParticlesProps) {
  const cfg = configs[type] ?? configs.dust
  const resolvedColor = cfg.color === "accent" ? accentColor : cfg.color

  // Pre-compute particle data once so re-renders don't randomize positions
  const particles = useMemo(() => {
    return Array.from({ length: cfg.count }, () => {
      const size = cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0])
      const duration = cfg.speed[0] + Math.random() * (cfg.speed[1] - cfg.speed[0])
      return {
        size,
        duration,
        left: Math.random() * 100,
        top: Math.random() * 100,
        opacityMul: 0.3 + Math.random() * 0.7,
        delay: Math.random() * duration,
      }
    })
  }, [cfg.count, cfg.sizeRange, cfg.speed])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            backgroundColor: resolvedColor,
            opacity: cfg.opacity * p.opacityMul,
            animation: `idleFloat ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            filter:
              type === "bioluminescence" || type === "void"
                ? `blur(${p.size > 3 ? 2 : 0}px)`
                : type === "fog"
                  ? `blur(${p.size / 3}px)`
                  : "none",
            boxShadow:
              type === "bioluminescence"
                ? `0 0 ${p.size * 2}px ${resolvedColor}`
                : type === "sparks"
                  ? `0 0 ${p.size}px ${resolvedColor}`
                  : "none",
          }}
        />
      ))}
    </div>
  )
}
