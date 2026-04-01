interface ParticlesProps {
  type: string
  accentColor: string
}

export default function Particles({ type, accentColor }: ParticlesProps) {
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
    sparks: { count: 15, sizeRange: [1, 3], speed: [4, 8], opacity: 0.4, color: accentColor },
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
  const cfg = configs[type] || configs.dust

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: cfg.count }).map((_, i) => {
        const size = cfg.sizeRange[0] + Math.random() * (cfg.sizeRange[1] - cfg.sizeRange[0])
        const duration = cfg.speed[0] + Math.random() * (cfg.speed[1] - cfg.speed[0])
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: cfg.color,
              opacity: cfg.opacity * (0.3 + Math.random() * 0.7),
              animation: `idleFloat ${duration}s ease-in-out infinite`,
              animationDelay: `${Math.random() * duration}s`,
              filter:
                type === "bioluminescence" || type === "void"
                  ? `blur(${size > 3 ? 2 : 0}px)`
                  : type === "fog"
                    ? `blur(${size / 3}px)`
                    : "none",
              boxShadow:
                type === "bioluminescence"
                  ? `0 0 ${size * 2}px ${cfg.color}`
                  : type === "sparks"
                    ? `0 0 ${size}px ${cfg.color}`
                    : "none",
            }}
          />
        )
      })}
    </div>
  )
}
