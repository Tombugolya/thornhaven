import { useEffect, useState } from "react"
import type { Handout, HandoutContent } from "../types/campaign"
import SpiralPuzzle from "./SpiralPuzzle"

interface PaperStyle {
  background: string
  color: string
  shadow: string
}

const paperStyles: Record<string, PaperStyle> = {
  parchment: {
    background: "#f4e8c1",
    color: "#2c1810",
    shadow: "rgba(139, 109, 56, 0.3)",
  },
  paper: {
    background: "#f0ede6",
    color: "#1a1a2e",
    shadow: "rgba(100, 100, 120, 0.3)",
  },
  rock: {
    background: "#8a8a80",
    color: "#1a1a18",
    shadow: "rgba(40, 40, 35, 0.4)",
  },
}

const handwritingStyles: Record<string, React.CSSProperties> = {
  shaky: {
    fontVariationSettings: "'wght' 500",
    letterSpacing: "0.02em",
    transform: "rotate(-0.5deg)",
  },
  neat: { fontVariationSettings: "'wght' 400", letterSpacing: "0.01em" },
  mixed: {},
  scrawled: { fontVariationSettings: "'wght' 700", letterSpacing: "-0.01em", fontStyle: "italic" },
  crude: {
    fontVariationSettings: "'wght' 600",
    letterSpacing: "0.03em",
    textTransform: "uppercase",
  },
}

function Decoration({ type, paperBg }: { type: string; paperBg: string }) {
  if (type === "torn-edge") {
    return (
      <div
        className="absolute top-0 left-0 right-0 h-4 pointer-events-none"
        style={{
          background: paperBg,
          clipPath:
            "polygon(0% 0%, 3% 60%, 7% 20%, 12% 70%, 18% 30%, 22% 80%, 28% 10%, 33% 60%, 38% 25%, 44% 75%, 50% 15%, 55% 65%, 60% 30%, 66% 70%, 72% 20%, 78% 80%, 83% 35%, 88% 65%, 93% 15%, 97% 55%, 100% 0%)",
          transform: "translateY(-10px)",
        }}
      />
    )
  }
  if (type === "ink-stain") {
    return (
      <div
        className="absolute bottom-16 right-8 w-32 h-24 pointer-events-none opacity-15"
        style={{
          background: "radial-gradient(ellipse at 40% 50%, #1a1a2e, transparent 70%)",
          borderRadius: "50% 40% 55% 45%",
        }}
      />
    )
  }
  if (type === "pin-holes") {
    return (
      <>
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.15)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.3)",
          }}
        />
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.4)",
          }}
        />
      </>
    )
  }
  if (type === "coffee-ring") {
    return (
      <div
        className="absolute bottom-12 right-12 w-20 h-20 rounded-full pointer-events-none opacity-15"
        style={{
          border: "3px solid #6b4226",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, transparent 55%, rgba(107,66,38,0.1) 60%, transparent 70%)",
        }}
      />
    )
  }
  if (type === "crumpled") {
    return (
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
          linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.08) 45%, transparent 50%),
          linear-gradient(-30deg, transparent 35%, rgba(0,0,0,0.06) 40%, transparent 45%),
          linear-gradient(60deg, transparent 50%, rgba(255,255,255,0.05) 55%, transparent 60%)
        `,
        }}
      />
    )
  }
  if (type === "smudge") {
    return (
      <div
        className="absolute bottom-20 right-6 w-24 h-16 pointer-events-none opacity-10"
        style={{
          background:
            "linear-gradient(135deg, transparent 30%, rgba(0,0,0,0.15) 50%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(4px)",
        }}
      />
    )
  }
  return null
}

function ContentBlock({
  block,
  handwriting,
  paperColor,
}: {
  block: HandoutContent
  handwriting: string
  paperColor: string
}) {
  const baseStyle: React.CSSProperties = {
    fontFamily: "var(--font-handwriting)",
    color: paperColor,
    ...handwritingStyles[handwriting],
  }

  if (block.hand === "secondary") {
    baseStyle.fontVariationSettings = "'wght' 400"
    baseStyle.fontStyle = "italic"
    baseStyle.opacity = 0.7
  }

  if (block.style === "spacer") {
    return <div className="h-4" />
  }
  if (block.style === "large") {
    return (
      <p className="text-2xl md:text-3xl font-bold text-center my-2" style={baseStyle}>
        {block.text}
      </p>
    )
  }
  if (block.style === "heading") {
    return (
      <h3 className="text-xl md:text-2xl font-semibold text-center mb-2" style={baseStyle}>
        {block.text}
      </h3>
    )
  }
  if (block.style === "subheading") {
    return (
      <h4 className="text-lg font-medium text-center mb-1 opacity-80" style={baseStyle}>
        {block.text}
      </h4>
    )
  }
  if (block.style === "list") {
    return (
      <p className="text-lg md:text-xl pl-4 my-1" style={baseStyle}>
        {block.text}
      </p>
    )
  }
  if (block.style === "annotation") {
    return (
      <p
        className="text-sm italic text-center opacity-50 my-2"
        style={{
          ...baseStyle,
          fontFamily: "var(--font-body)",
          fontStyle: "italic",
        }}
      >
        {block.text}
      </p>
    )
  }
  if (block.style === "signature") {
    return (
      <p className="text-xl text-right mt-4 mr-8 italic" style={baseStyle}>
        {block.text}
      </p>
    )
  }
  // normal
  return (
    <p className="text-lg md:text-xl leading-relaxed my-1" style={baseStyle}>
      {block.text}
    </p>
  )
}

export default function HandoutDisplay({
  handout,
}: {
  handout: Handout & { solvedInscription?: string }
}) {
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100)
    return () => clearTimeout(t)
  }, [])

  const paper = paperStyles[handout.paperType] || paperStyles.parchment

  // Puzzle handout — render interactive puzzle
  if (handout.isPuzzle) {
    return <SpiralPuzzle handout={handout} />
  }

  // Map handout — render image directly without paper wrapper
  if (handout.isMap) {
    return (
      <div
        className="h-screen w-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: "rgba(0,0,0,0.92)" }}
      >
        <img
          src="/cave-map.png"
          alt="Hand-drawn cave map with entrance, passage, fork, and altar chamber circled in red with 'DO NOT' written urgently"
          className={`max-h-[92vh] max-w-[92vw] object-contain rounded transition-all duration-1000 ${
            entered ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{
            transitionDelay: "100ms",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        />
      </div>
    )
  }

  return (
    <div
      className="h-screen w-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "rgba(0,0,0,0.92)" }}
    >
      {/* Paper element */}
      <div
        className={`relative max-w-xl w-[90vw] max-h-[80vh] overflow-y-auto rounded-sm transition-all duration-1000 ${
          entered ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          transitionDelay: "100ms",
          background: paper.background,
          boxShadow: `0 20px 60px ${paper.shadow}, 0 0 0 1px rgba(0,0,0,0.1)`,
          padding: "2.5rem 2rem",
        }}
      >
        {/* Decorations */}
        {handout.decorations?.map((d) => (
          <Decoration key={d} type={d} paperBg={paper.background} />
        ))}

        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Title */}
          <div className="text-center mb-6">
            <p
              className="text-xs uppercase tracking-[0.3em] mb-2 opacity-40"
              style={{
                fontFamily: "var(--font-body)",
                color: paper.color,
              }}
            >
              {handout.paperType === "rock" ? "Scratched on Stone" : "Handout"}
            </p>
            <h2
              className="text-sm font-medium tracking-wider opacity-50"
              style={{
                fontFamily: "var(--font-body)",
                color: paper.color,
              }}
            >
              {handout.title}
            </h2>
            <div
              className="w-16 h-px mx-auto mt-3"
              style={{
                background: `linear-gradient(to right, transparent, ${paper.color}30, transparent)`,
              }}
            />
          </div>

          {/* Text content */}
          <div className="space-y-0">
            {handout.content.map((block, i) => (
              <ContentBlock
                key={i}
                block={block}
                handwriting={handout.handwriting}
                paperColor={paper.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
