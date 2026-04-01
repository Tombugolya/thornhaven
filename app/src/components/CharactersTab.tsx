import { useState } from "react"
import { useCampaign } from "../hooks/useCampaign"
import CharacterCard from "./CharacterCard"
import ShowButton from "./ShowButton"
import type { NPC } from "../types/campaign"

const filters = [
  { id: "all", label: "All" },
  { id: "ally", label: "Allies" },
  { id: "villain", label: "Villains" },
  { id: "enemy", label: "Enemies" },
  { id: "flavor", label: "Flavor" },
]

export default function CharactersTab() {
  const { campaign } = useCampaign()
  const [filter, setFilter] = useState("all")
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null)

  const filtered = filter === "all" ? campaign.npcs : campaign.npcs.filter((n) => n.role === filter)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
              filter === f.id
                ? "bg-gold/15 text-gold border border-gold/30"
                : "bg-bg-surface/50 text-text-muted border border-transparent hover:bg-bg-surface hover:text-parchment-dim"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* NPC Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((npc) => (
          <button
            key={npc.id}
            onClick={() => setSelectedNpc(selectedNpc?.id === npc.id ? null : npc)}
            className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
              selectedNpc?.id === npc.id
                ? "bg-bg-elevated border-gold/40 ring-1 ring-gold/20"
                : "bg-bg-surface/60 border-bg-elevated/50 hover:bg-bg-surface hover:border-bg-hover"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                style={{
                  backgroundColor: npc.color + "22",
                  color: npc.color,
                  border: `2px solid ${npc.color}44`,
                }}
              >
                {npc.initials}
              </div>
              <div className="min-w-0">
                <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-parchment truncate">
                  {npc.name}
                </h3>
                <p className="text-xs text-text-muted">{npc.title}</p>
              </div>
              <ShowButton type="character" id={npc.id} label={npc.name} />
              <RoleBadge role={npc.role} />
            </div>
            <p className="text-xs text-parchment-dim mt-2 italic">{npc.vibe}</p>
          </button>
        ))}
      </div>

      {/* Selected NPC Detail */}
      {selectedNpc && <CharacterCard npc={selectedNpc} onClose={() => setSelectedNpc(null)} />}
    </div>
  )
}

function RoleBadge({ role }: { role: NPC["role"] }) {
  const styles: Record<string, string> = {
    ally: "bg-success/15 text-success-light",
    villain: "bg-purple-500/15 text-purple-400",
    enemy: "bg-danger/15 text-danger-light",
    flavor: "bg-gold/10 text-gold",
  }
  return (
    <span
      className={`ml-auto text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
        styles[role] || ""
      }`}
    >
      {role}
    </span>
  )
}
