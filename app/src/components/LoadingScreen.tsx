// Pre-computed ember particle data (avoids Math.random in render)
const LOADING_EMBERS = Array.from({ length: 12 }, () => ({
  width: 2 + Math.random() * 3,
  height: 2 + Math.random() * 3,
  left: `${20 + Math.random() * 60}%`,
  bottom: `${10 + Math.random() * 40}%`,
  duration: `${2 + Math.random() * 3}s`,
  delay: `${Math.random() * 3}s`,
}))

export default function LoadingScreen({ message = "Consulting the ancient tomes" }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-bg-deep flex items-center justify-center overflow-hidden">
      {LOADING_EMBERS.map((ember, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: ember.width,
            height: ember.height,
            left: ember.left,
            bottom: ember.bottom,
            background: "radial-gradient(circle, #c9a227, #8a6e1a00)",
            animation: `loadEmber ${ember.duration} ease-out infinite`,
            animationDelay: ember.delay,
          }}
        />
      ))}

      <div
        className="relative flex flex-col items-center gap-8"
        style={{ animation: "loadFadeIn 0.6s ease-out" }}
      >
        {/* Rune circle */}
        <div className="relative w-28 h-28">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            style={{ animation: "runeRotate 12s linear infinite" }}
          >
            <circle cx="50" cy="50" r="46" fill="none" stroke="#c9a227" strokeWidth="0.5" opacity="0.3" />
            <circle cx="50" cy="50" r="46" fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.6" strokeDasharray="8 12 4 16 6 14" />
            {[0, 60, 120, 180, 240, 300].map((angle) => (
              <text
                key={angle}
                x={50 + 46 * Math.cos(((angle - 90) * Math.PI) / 180)}
                y={50 + 46 * Math.sin(((angle - 90) * Math.PI) / 180)}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#c9a227"
                fontSize="6"
                opacity="0.7"
                style={{ fontFamily: "serif" }}
              >
                {["\u16A0", "\u16B1", "\u16C1", "\u16D2", "\u16A8", "\u16B9"][angle / 60]}
              </text>
            ))}
          </svg>

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            style={{ animation: "runeRotateReverse 8s linear infinite" }}
          >
            <circle cx="50" cy="50" r="32" fill="none" stroke="#c9a227" strokeWidth="0.5" opacity="0.2" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="#c9a227" strokeWidth="0.8" opacity="0.5" strokeDasharray="4 8 6 10" />
          </svg>

          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            style={{ animation: "runePulse 3s ease-in-out infinite" }}
          >
            <polygon points="50,26 66,50 50,74 34,50" fill="none" stroke="#c9a227" strokeWidth="1" />
            <polygon points="50,30 62,50 50,70 38,50" fill="none" stroke="#c9a227" strokeWidth="0.5" opacity="0.4" />
            <line x1="50" y1="26" x2="50" y2="74" stroke="#c9a227" strokeWidth="0.3" opacity="0.3" />
            <line x1="34" y1="50" x2="66" y2="50" stroke="#c9a227" strokeWidth="0.3" opacity="0.3" />
            <circle cx="50" cy="50" r="2" fill="#c9a227" opacity="0.8" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2 className="font-[family-name:var(--font-display)] text-gold text-lg tracking-widest uppercase">
            Thornhaven
          </h2>
          <div className="flex items-center justify-center gap-1.5">
            {message.split(" ").map((word, i) => (
              <span
                key={i}
                className="text-text-muted text-xs tracking-wider"
                style={{ animation: `loadFadeIn 0.4s ease-out ${0.3 + i * 0.1}s both` }}
              >
                {word}
              </span>
            ))}
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block w-1 h-1 rounded-full bg-gold"
                style={{ animation: `loadingDot 1.4s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
