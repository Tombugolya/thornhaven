import { useState } from "react"
import {
  X,
  Shield,
  Heart,
  Footprints,
  Swords,
  MessageCircle,
  Brain,
  Sparkles,
  Eye,
  Target,
} from "lucide-react"
import type { NPC, NPCStats } from "../types/campaign"
import type { LucideIcon } from "lucide-react"

const abilityNames = ["STR", "DEX", "CON", "INT", "WIS", "CHA"]
const abilityKeys = ["str", "dex", "con", "int", "wis", "cha"] as const

function StatBlock({ stats }: { stats: NPCStats }) {
  return (
    <div className="space-y-4">
      {/* Core Stats */}
      <div className="flex gap-4 flex-wrap">
        <CoreStat icon={Shield} label="AC" value={stats.ac} sub={stats.acNote} color="text-info" />
        <CoreStat
          icon={Heart}
          label="HP"
          value={`${stats.hp}/${stats.maxHp}`}
          color="text-success-light"
        />
        <CoreStat icon={Footprints} label="Speed" value={stats.speed} color="text-gold" />
      </div>

      {/* Ability Scores */}
      <div className="grid grid-cols-6 gap-2">
        {abilityKeys.map((key, i) => (
          <div
            key={key}
            className="bg-bg-base rounded-lg p-2 text-center border border-bg-elevated/50"
          >
            <div className="text-[10px] text-text-muted uppercase tracking-wider">
              {abilityNames[i]}
            </div>
            <div className="text-lg font-bold text-parchment">{stats[key].score}</div>
            <div className="text-xs text-gold-dim">{stats[key].mod}</div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="space-y-1 text-sm">
        {stats.saves && stats.saves !== "—" && (
          <DetailRow label="Saving Throws" value={stats.saves} />
        )}
        {stats.skills && stats.skills !== "—" && <DetailRow label="Skills" value={stats.skills} />}
        <DetailRow label="Passive Perception" value={stats.passivePerception} />
        <DetailRow label="Languages" value={stats.languages} />
        {stats.cr && stats.cr !== "—" && <DetailRow label="CR" value={stats.cr} />}
      </div>
    </div>
  )
}

function CoreStat({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  sub?: string
  color: string
}) {
  return (
    <div className="flex items-center gap-2 bg-bg-base rounded-lg px-3 py-2 border border-bg-elevated/50">
      <Icon className={`w-4 h-4 ${color}`} />
      <div>
        <div className="text-[10px] text-text-muted uppercase">{label}</div>
        <div className={`text-sm font-bold ${color}`}>{value}</div>
        {sub && <div className="text-[10px] text-text-muted">{sub}</div>}
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex gap-2">
      <span className="text-text-muted shrink-0">{label}:</span>
      <span className="text-parchment/80">{value}</span>
    </div>
  )
}

function SectionHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0">
      <Icon className="w-4 h-4 text-gold" />
      <h4 className="font-[family-name:var(--font-display)] text-sm font-semibold text-gold tracking-wide">
        {title}
      </h4>
    </div>
  )
}

export default function CharacterCard({ npc, onClose }: { npc: NPC; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState("overview")

  const sections = [
    { id: "overview", label: "Overview" },
    ...(npc.stats ? [{ id: "stats", label: "Stats" }] : []),
    ...(npc.attacks?.length ? [{ id: "combat", label: "Combat" }] : []),
    ...(npc.spells?.length ? [{ id: "spells", label: "Spells" }] : []),
    { id: "dialogue", label: "Dialogue" },
    { id: "knowledge", label: "Knowledge" },
  ]

  return (
    <div className="bg-bg-surface border border-gold-dim/20 rounded-2xl overflow-hidden animate-in">
      {/* Card Header */}
      <div
        className="px-6 py-4 flex items-center gap-4 border-b border-gold-dim/15"
        style={{
          background: `linear-gradient(135deg, ${npc.color}11, transparent)`,
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
          style={{
            backgroundColor: npc.color + "22",
            color: npc.color,
            border: `2px solid ${npc.color}55`,
          }}
        >
          {npc.initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-parchment">
            {npc.name}
          </h3>
          <p className="text-sm text-text-muted">{npc.title}</p>
          <p className="text-xs text-parchment-dim italic mt-0.5">"{npc.vibe}"</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-bg-hover transition-colors cursor-pointer text-text-muted hover:text-parchment"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 px-4 pt-3 pb-0 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeSection === s.id
                ? "bg-bg-card text-gold border-t border-x border-gold-dim/20"
                : "text-text-muted hover:text-parchment-dim hover:bg-bg-card/50"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="bg-bg-card/50 px-6 py-5 min-h-[200px]">
        {activeSection === "overview" && (
          <div className="space-y-4">
            <div>
              <SectionHeader icon={Brain} title="Personality" />
              <p className="text-sm text-parchment/80 leading-relaxed">{npc.personality}</p>
            </div>
            <div>
              <SectionHeader icon={MessageCircle} title="Voice" />
              <p className="text-sm text-parchment/80 leading-relaxed">{npc.voice}</p>
            </div>
            {npc.secret && (
              <div className="bg-bg-readaloud/80 border border-danger/20 rounded-lg p-3 mt-3">
                <div className="flex items-center gap-2 mb-1">
                  <Eye className="w-3.5 h-3.5 text-danger-light" />
                  <span className="text-xs font-semibold text-danger-light uppercase tracking-wider">
                    Secret
                  </span>
                </div>
                <p className="text-sm text-parchment/70">{npc.secret}</p>
              </div>
            )}
          </div>
        )}

        {activeSection === "stats" && npc.stats && (
          <div>
            <StatBlock stats={npc.stats} />
            {(npc.abilities?.length ?? 0) > 0 && (
              <>
                <SectionHeader icon={Sparkles} title="Abilities" />
                <div className="space-y-2">
                  {npc.abilities!.map((a, i) => (
                    <div
                      key={i}
                      className="bg-bg-base/50 rounded-lg p-3 border border-bg-elevated/30"
                    >
                      <div className="text-sm font-semibold text-gold-light">{a.name}</div>
                      <p className="text-xs text-parchment/70 mt-1">{a.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeSection === "combat" && (
          <div>
            <SectionHeader icon={Swords} title="Attacks" />
            <div className="space-y-2">
              {npc.attacks!.map((a, i) => (
                <div key={i} className="bg-bg-base/50 rounded-lg p-3 border border-bg-elevated/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-parchment">{a.name}</span>
                    {a.type !== "—" && (
                      <span className="text-[10px] text-text-muted uppercase">{a.type}</span>
                    )}
                  </div>
                  {a.toHit !== "—" && (
                    <div className="flex gap-4 mt-1 text-xs text-parchment/70">
                      <span>
                        <span className="text-text-muted">Hit: </span>
                        <span className="text-gold">{a.toHit}</span>
                      </span>
                      <span>
                        <span className="text-text-muted">Reach: </span>
                        {a.reach}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-parchment/70 mt-1">
                    <span className="text-text-muted">Damage: </span>
                    <span className="text-danger-light">{a.damage}</span>
                  </div>
                </div>
              ))}
            </div>

            {npc.combatTactics && (
              <>
                <SectionHeader icon={Target} title="Tactics" />
                <p className="text-sm text-parchment/80 leading-relaxed bg-bg-base/30 rounded-lg p-3 border border-bg-elevated/20">
                  {npc.combatTactics}
                </p>
              </>
            )}
          </div>
        )}

        {activeSection === "spells" && npc.spells && (
          <div>
            <SectionHeader icon={Sparkles} title="Spell List" />
            <div className="space-y-2">
              {npc.spells.map((s, i) => (
                <div key={i} className="bg-bg-base/50 rounded-lg p-3 border border-bg-elevated/30">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-purple-500/15 text-purple-400 px-2 py-0.5 rounded-full uppercase">
                      {s.level}
                    </span>
                    <span className="text-sm font-semibold text-parchment">{s.name}</span>
                  </div>
                  <p className="text-xs text-parchment/70 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "dialogue" && (
          <div>
            <SectionHeader icon={MessageCircle} title="Key Lines" />
            <div className="space-y-2">
              {npc.dialogueLines.map((d, i) => (
                <div key={i} className="bg-bg-base/50 rounded-lg p-3 border border-bg-elevated/30">
                  <div className="text-[10px] text-gold-dim uppercase tracking-wider mb-1">
                    {d.context}
                  </div>
                  <p className="text-sm text-parchment/90 italic leading-relaxed">{d.line}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "knowledge" && (
          <div>
            <SectionHeader icon={Eye} title="What They Know" />
            <ul className="space-y-1.5">
              {npc.knows.map((k, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-parchment/80">
                  <span className="text-gold mt-1 shrink-0">•</span>
                  {k}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
