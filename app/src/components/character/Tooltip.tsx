import { useState, useRef, useEffect, useCallback } from "react"

interface TooltipProps {
  text: string
  children: React.ReactNode
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLSpanElement>(null)

  const hide = useCallback(() => setVisible(false), [])

  // Close on outside click (for mobile tap-to-toggle)
  useEffect(() => {
    if (!visible) return undefined
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        e.target instanceof Node &&
        !containerRef.current.contains(e.target)
      ) {
        setVisible(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [visible])

  return (
    <span ref={containerRef} className="relative inline-flex items-center">
      {children}
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={hide}
        className="ml-1 text-gold/40 hover:text-gold/70 transition-colors cursor-help inline-flex items-center justify-center text-xs leading-none"
        aria-label={text}
      >
        <span className="select-none" style={{ fontSize: "0.8em" }}>
          &#9432;
        </span>
      </button>
      {visible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg text-xs text-parchment whitespace-normal max-w-52 text-center pointer-events-none"
          style={{
            backgroundColor: "rgba(20, 16, 12, 0.95)",
            border: "1px solid rgba(201, 162, 39, 0.3)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            animation: "loadFadeIn 0.15s ease-out",
          }}
        >
          {text}
          {/* Arrow */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
            style={{
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid rgba(201, 162, 39, 0.3)",
            }}
          />
        </div>
      )}
    </span>
  )
}
