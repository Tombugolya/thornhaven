import { useState } from "react"
import { MonitorUp } from "lucide-react"
import { useBroadcast } from "../hooks/useBroadcast"

interface ShowButtonProps {
  type: string
  id: string
  label?: string
  buttonText?: string
}

export default function ShowButton({ type, id, label, buttonText }: ShowButtonProps) {
  const { showToPlayer, playerCount } = useBroadcast()
  const [flash, setFlash] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    showToPlayer(type, id)
    setFlash(true)
    setTimeout(() => setFlash(false), 800)
  }

  if (playerCount === 0) return null

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium
        transition-all duration-200 cursor-pointer shrink-0
        ${
          flash
            ? "bg-success/20 text-success-light border border-success/30"
            : "bg-gold/10 text-gold/70 border border-gold/15 hover:bg-gold/20 hover:text-gold"
        }
      `}
      title={`Show ${label || id} to player`}
    >
      <MonitorUp className="w-3 h-3" />
      {flash ? "Sent!" : buttonText || "Show"}
    </button>
  )
}
