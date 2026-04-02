import { useState, useCallback, useEffect, useMemo } from "react"
import {
  Swords,
  Heart,
  Shield,
  Plus,
  Minus,
  RotateCcw,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Skull,
  Users,
  Zap,
  Map,
  Eye,
  PersonStanding,
  Brain,
  CircleSlash,
  Ghost,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useCampaign } from "../hooks/useCampaign"
import { useBroadcast } from "../hooks/useBroadcast"
import { usePersistedState } from "../hooks/usePersistedState"
import ShowButton from "./ShowButton"
import BattleMap from "./BattleMap"
import type { Encounter } from "../types/campaign"

interface ConditionDef {
  key: string
  label: string
  tooltip: string
  icon: LucideIcon
  color: string
}

interface Combatant {
  id: string
  name: string
  npcId?: string
  hp: number
  maxHp: number
  ac: number
  notes: string
  isAlly: boolean
  isPC?: boolean
  initiative: number | null
  conditions: string[]
}

const CONDITIONS: ConditionDef[] = [
  {
    key: "prone",
    label: "Prone",
    tooltip: "Prone -- disadvantage on attacks, attackers within 5ft have advantage",
    icon: PersonStanding,
    color: "#ff9944",
  },
  {
    key: "concentrating",
    label: "Conc",
    tooltip: "Concentrating -- maintaining a spell",
    icon: Brain,
    color: "#44aaff",
  },
  {
    key: "stunned",
    label: "Stun",
    tooltip: "Stunned -- incapacitated, auto-fail STR/DEX saves, attacks have advantage",
    icon: CircleSlash,
    color: "#ffcc00",
  },
  {
    key: "frightened",
    label: "Frght",
    tooltip: "Frightened -- disadvantage on checks/attacks while source is in sight",
    icon: Ghost,
    color: "#cc66ff",
  },
]

function HPBar({ current, max }: { current: number; max: number }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100))
  let color = "bg-success"
  if (pct <= 25) color = "bg-danger"
  else if (pct <= 50) color = "bg-warning"

  return (
    <div className="w-full h-2 bg-bg-base rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300 rounded-full`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function ConditionToggles({
  conditions = [],
  onToggle,
}: {
  conditions?: string[]
  onToggle: (key: string) => void
}) {
  return (
    <div className="flex items-center gap-1 mt-2">
      {CONDITIONS.map(({ key, label, tooltip, icon: Icon, color }) => {
        const active = conditions.includes(key)
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={`
              inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium
              transition-all duration-200 cursor-pointer border
              ${active ? "opacity-100" : "opacity-40 hover:opacity-70"}
            `}
            style={{
              backgroundColor: active ? `${color}22` : "transparent",
              borderColor: active ? `${color}55` : `${color}20`,
              color: color,
            }}
            title={tooltip}
          >
            <Icon className="w-2.5 h-2.5" />
            {active && <span>{label}</span>}
          </button>
        )
      })}
    </div>
  )
}

interface CombatantRowProps {
  combatant: Combatant
  onHpChange: (delta: number) => void
  onInitiativeChange: (val: number) => void
  onConditionToggle: (condition: string) => void
  isActiveTurn: boolean
  isRevealed?: boolean
  onRevealToggle?: () => void
  hasToken?: boolean
}

function CombatantRow({
  combatant,
  onHpChange,
  onInitiativeChange,
  onConditionToggle,
  isActiveTurn,
  isRevealed,
  onRevealToggle,
  hasToken,
}: CombatantRowProps) {
  const [damageInput, setDamageInput] = useState("")
  const isDead = combatant.hp <= 0

  const applyDamage = () => {
    const val = parseInt(damageInput)
    if (!isNaN(val)) {
      onHpChange(-val)
      setDamageInput("")
    }
  }

  const applyHeal = () => {
    const val = parseInt(damageInput)
    if (!isNaN(val)) {
      onHpChange(val)
      setDamageInput("")
    }
  }

  return (
    <div
      className={`bg-bg-surface/60 border rounded-xl p-4 transition-all duration-200 ${
        isDead
          ? "border-danger/30 opacity-50"
          : isActiveTurn
            ? "border-gold/40 shadow-[inset_4px_0_0_#c9a227] scale-[1.01]"
            : combatant.isPC
              ? "border-gold/25"
              : combatant.isAlly
                ? "border-success/20"
                : "border-bg-elevated/50"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        {/* Initiative input */}
        <input
          type="number"
          value={combatant.initiative ?? ""}
          onChange={(e) => onInitiativeChange(parseInt(e.target.value) || 0)}
          className={`w-10 h-10 rounded-lg border text-center text-sm font-bold focus:outline-none transition-all ${
            isActiveTurn
              ? "bg-gold/20 border-gold/50 text-gold shadow-[0_0_12px_rgba(201,162,39,0.3)]"
              : "bg-bg-base border-bg-elevated/50 text-gold focus:border-gold/40"
          }`}
          placeholder="#"
        />

        {/* Name & Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                isDead ? "text-text-muted line-through" : "text-parchment"
              }`}
            >
              {combatant.name}
            </span>
            {isDead && <Skull className="w-3.5 h-3.5 text-danger" />}
            {combatant.isPC && (
              <span className="text-[10px] bg-gold/15 text-gold px-1.5 py-0.5 rounded-full">
                PC
              </span>
            )}
            {combatant.isAlly && !combatant.isPC && (
              <span className="text-[10px] bg-success/15 text-success-light px-1.5 py-0.5 rounded-full">
                Ally
              </span>
            )}
            {hasToken && onRevealToggle && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRevealToggle()
                }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-all cursor-pointer shrink-0 ${
                  isRevealed
                    ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                    : "bg-purple-500/10 text-purple-400/70 border border-purple-500/15 hover:bg-purple-500/20"
                }`}
                title={isRevealed ? "Revealed to player" : "Reveal on player map"}
              >
                <Eye className="w-3 h-3" />
                {isRevealed ? "Shown" : "Reveal"}
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> AC {combatant.ac}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" /> {combatant.hp}/{combatant.maxHp}
            </span>
          </div>
        </div>

        {/* Quick HP Buttons */}
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={damageInput}
            onChange={(e) => setDamageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyDamage()}
            className="w-14 h-8 rounded-lg bg-bg-base border border-bg-elevated/50 text-center text-xs text-parchment focus:outline-none focus:border-gold/40"
            placeholder="dmg"
          />
          <button
            onClick={applyDamage}
            className="p-1.5 rounded-lg bg-danger/15 text-danger-light hover:bg-danger/25 transition-colors cursor-pointer"
            title="Damage"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={applyHeal}
            className="p-1.5 rounded-lg bg-success/15 text-success-light hover:bg-success/25 transition-colors cursor-pointer"
            title="Heal"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* HP Bar */}
      <HPBar current={combatant.hp} max={combatant.maxHp} />

      {/* Condition Toggles */}
      <ConditionToggles
        conditions={combatant.conditions}
        onToggle={(condition) => onConditionToggle(condition)}
      />

      {/* Notes */}
      {combatant.notes && (
        <p className="text-xs text-parchment-dim mt-2 italic">{combatant.notes}</p>
      )}
    </div>
  )
}

function EncounterPanel({ encounter, campaignId }: { encounter: Encounter; campaignId: string }) {
  const [open, setOpen] = useState(false)
  const { showToPlayer, playerCount, lastMessage, sessionState } = useBroadcast()
  const { campaign } = useCampaign()
  const mapExists = !!campaign.battleMaps[encounter.id]

  const map = campaign.battleMaps[encounter.id]

  const defaultCombatants = (): Combatant[] => {
    const list: Combatant[] = [
      ...encounter.enemies.map((e) => ({
        ...e,
        isAlly: false,
        initiative: null,
        conditions: [] as string[],
      })),
      ...encounter.allies.map((a) => ({
        ...a,
        isAlly: true,
        initiative: null,
        conditions: [] as string[],
      })),
    ]
    // Auto-add PC if the map has a player token
    if (map?.tokens?.player) {
      list.unshift({
        id: "player",
        name: "Player",
        isAlly: true,
        isPC: true,
        hp: 25,
        maxHp: 25,
        ac: 15,
        initiative: null,
        conditions: [],
        notes: "",
      })
    }
    return list
  }

  const [combatants, setCombatants] = usePersistedState<Combatant[]>(
    `dm:${campaignId}:encounter:${encounter.id}:combatants`,
    defaultCombatants(),
  )

  // Migrate: inject PC if persisted state predates the PC addition
  useEffect(() => {
    if (map?.tokens?.player) {
      setCombatants((prev) => {
        if (prev.find((c) => c.id === "player")) return prev
        return [
          {
            id: "player",
            name: "Player",
            isAlly: true,
            isPC: true,
            hp: 25,
            maxHp: 25,
            ac: 15,
            initiative: null,
            conditions: [],
            notes: "",
          },
          ...prev,
        ]
      })
    }
  }, [map])
  const [round, setRound] = usePersistedState(`dm:${campaignId}:encounter:${encounter.id}:round`, 1)
  const [activeTurnId, setActiveTurnId] = usePersistedState<string | null>(
    `dm:${campaignId}:encounter:${encounter.id}:activeTurn`,
    null,
  )
  const [revealedTokenIds, setRevealedTokenIds] = usePersistedState<string[]>(
    `dm:${campaignId}:encounter:${encounter.id}:revealed`,
    [],
  )
  const [mapShowing, setMapShowing] = usePersistedState<boolean>(
    `dm:${campaignId}:encounter:${encounter.id}:mapShowing`,
    false,
  )
  const [tokenPositions, setTokenPositions] = useState<Record<string, { x: number; y: number }>>({})

  // Listen for player moves
  useEffect(() => {
    if (lastMessage?.type === "move") {
      setTokenPositions((prev) => ({
        ...prev,
        [lastMessage.tokenId]: { x: lastMessage.x, y: lastMessage.y },
      }))
    }
  }, [lastMessage])

  // DM recovery on mount — recover tokenPositions from sessionState
  useEffect(() => {
    if (sessionState?.tokenPositions && mapShowing) {
      setTokenPositions(sessionState.tokenPositions as Record<string, { x: number; y: number }>)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // only on mount

  // Map combatant IDs → map token IDs. Enemies match directly; allies use npcId.
  const toTokenId = useCallback(
    (combatantId: string) => {
      if (!map) return combatantId
      if (map.tokens[combatantId]) return combatantId // direct match (enemies)
      const combatant = combatants.find((c) => c.id === combatantId)
      if (combatant?.npcId && map.tokens[combatant.npcId]) return combatant.npcId
      return combatantId
    },
    [map, combatants],
  )

  const resetEncounter = useCallback(() => {
    setCombatants(defaultCombatants())
    setRound(1)
    setActiveTurnId(null)
    setRevealedTokenIds([])
    setMapShowing(false)
    setTokenPositions({})
  }, [encounter, setCombatants, setRound, setActiveTurnId, setRevealedTokenIds, setMapShowing])

  const updateHp = useCallback(
    (id: string, delta: number) => {
      const combatant = combatants.find((c) => c.id === id)
      if (!combatant) return
      const oldHp = combatant.hp
      const newHp = Math.max(0, Math.min(combatant.maxHp, oldHp + delta))

      setCombatants((prev) => prev.map((c) => (c.id === id ? { ...c, hp: newHp } : c)))

      if (playerCount > 0 && mapExists) {
        const tokenId = toTokenId(id)
        showToPlayer("damage", null, { tokenId, value: delta })

        if (oldHp > 0 && newHp <= 0) {
          showToPlayer("kill", null, { tokenId })
          const allEnemiesDead = combatants
            .filter((c) => !c.isAlly && !c.isPC)
            .every((c) => (c.id === id ? true : c.hp <= 0))
          if (allEnemiesDead) {
            setTimeout(() => {
              showToPlayer("battleWon", null, { encounterName: encounter.name })
            }, 800)
          }
        }
        if (oldHp <= 0 && newHp > 0) {
          showToPlayer("revive", null, { tokenId })
        }
      }
    },
    [combatants, setCombatants, playerCount, mapExists, showToPlayer, toTokenId, encounter.name],
  )

  const updateInitiative = useCallback(
    (id: string, val: number) => {
      setCombatants((prev) => prev.map((c) => (c.id === id ? { ...c, initiative: val } : c)))
    },
    [setCombatants],
  )

  const toggleCondition = useCallback(
    (id: string, condition: string) => {
      // Compute new conditions before state update so broadcast is reliable
      const combatant = combatants.find((c) => c.id === id)
      const conditions = combatant?.conditions || []
      const has = conditions.includes(condition)
      const newConditions = has
        ? conditions.filter((x) => x !== condition)
        : [...conditions, condition]

      setCombatants((prev) =>
        prev.map((c) => (c.id === id ? { ...c, conditions: newConditions } : c)),
      )

      if (playerCount > 0 && mapExists) {
        showToPlayer("conditions", null, { tokenId: toTokenId(id), conditions: newConditions })
      }
    },
    [combatants, setCombatants, playerCount, mapExists, showToPlayer, toTokenId],
  )

  const handleRevealToggle = useCallback(
    (combatantId: string) => {
      const tokenId = toTokenId(combatantId)
      if (!revealedTokenIds.includes(tokenId)) {
        showToPlayer("reveal", null, { tokenId })
        setRevealedTokenIds((prev) => [...prev, tokenId])
      }
    },
    [toTokenId, revealedTokenIds, showToPlayer, setRevealedTokenIds],
  )

  const handleShowMap = useCallback(() => {
    showToPlayer("map", encounter.id)
    setMapShowing(true)
    setRevealedTokenIds([])
    setTokenPositions({})
  }, [showToPlayer, encounter.id, setMapShowing, setRevealedTokenIds])

  const handleRevealAll = useCallback(() => {
    if (!map) return
    const enemyIds = Object.entries(map.tokens)
      .filter(([, t]) => !t.ally)
      .map(([id]) => id)
    enemyIds.forEach((id) => showToPlayer("reveal", null, { tokenId: id }))
    setRevealedTokenIds(enemyIds)
  }, [map, showToPlayer, setRevealedTokenIds])

  const handleTokenMove = useCallback(
    (tokenId: string, x: number, y: number) => {
      setTokenPositions((prev) => ({ ...prev, [tokenId]: { x, y } }))
      showToPlayer("move", null, { tokenId, x, y })
    },
    [showToPlayer],
  )

  const sorted = useMemo(
    () => [...combatants].sort((a, b) => (b.initiative ?? -1) - (a.initiative ?? -1)),
    [combatants],
  )

  const nextTurn = useCallback(() => {
    const alive = sorted.filter((c) => c.hp > 0)
    if (alive.length === 0) return
    if (!activeTurnId) {
      // Start combat — first combatant
      const first = alive[0]
      setActiveTurnId(first.id)
      setRound(1)
      if (playerCount > 0 && mapExists) {
        showToPlayer("activeTurn", null, { tokenId: toTokenId(first.id) })
      }
      return
    }
    const currentIdx = alive.findIndex((c) => c.id === activeTurnId)
    const nextIdx = currentIdx + 1
    if (nextIdx >= alive.length) {
      // Wrap to top — new round
      const first = alive[0]
      setActiveTurnId(first.id)
      setRound((r) => r + 1)
      if (playerCount > 0 && mapExists) {
        showToPlayer("activeTurn", null, { tokenId: toTokenId(first.id) })
      }
    } else {
      const next = alive[nextIdx]
      setActiveTurnId(next.id)
      if (playerCount > 0 && mapExists) {
        showToPlayer("activeTurn", null, { tokenId: toTokenId(next.id) })
      }
    }
  }, [sorted, activeTurnId, playerCount, mapExists, showToPlayer, toTokenId])

  // Collect conditions per token for passing to BattleMap
  // Uses map token IDs so conditions render on the correct tokens
  const { tokenConditions, proneIds } = useMemo(() => {
    const conditions: Record<string, string[]> = {}
    const prone = new Set<string>()
    combatants.forEach((c) => {
      const conds = c.conditions || []
      const tid = toTokenId(c.id)
      if (conds.length > 0) conditions[tid] = conds
      if (conds.includes("prone")) prone.add(tid)
    })
    return { tokenConditions: conditions, proneIds: prone }
  }, [combatants, toTokenId])

  const revealedSet = useMemo(() => new Set(revealedTokenIds), [revealedTokenIds])
  const deadTokenIds = useMemo(
    () => new Set(combatants.filter((c) => c.hp <= 0).map((c) => toTokenId(c.id))),
    [combatants, toTokenId],
  )

  const diffColors: Record<string, string> = {
    Easy: "text-success-light bg-success/15",
    Medium: "text-warning bg-warning/15",
    Hard: "text-danger-light bg-danger/15",
  }

  return (
    <div className="bg-bg-surface/40 border border-bg-elevated/30 rounded-xl overflow-hidden">
      <div
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer hover:bg-bg-surface/60 transition-colors"
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setOpen(!open)
          }
        }}
      >
        {open ? (
          <ChevronDown className="w-4 h-4 text-gold-dim" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gold-dim" />
        )}
        <Swords className="w-4 h-4 text-danger-light" />
        <div className="flex-1">
          <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-parchment">
            {encounter.name}
          </h3>
          <p className="text-xs text-text-muted">
            Session {encounter.session} — {encounter.location}
          </p>
        </div>
        <span
          className="flex items-center gap-2"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <ShowButton type="combat" id={encounter.id} label={encounter.name} />
          {mapExists && playerCount > 0 && (
            <button
              onClick={handleShowMap}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                mapShowing
                  ? "bg-info/20 text-info border border-info/30"
                  : "bg-info/10 text-info/70 border border-info/15 hover:bg-info/20 hover:text-info"
              }`}
              title="Show battle map to player"
            >
              <Map className="w-3.5 h-3.5" />
              {mapShowing ? "Map Live" : "Show Map"}
            </button>
          )}
          <span
            className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
              diffColors[encounter.difficulty] || ""
            }`}
          >
            {encounter.difficulty}
          </span>
        </span>
      </div>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          <p className="text-sm text-parchment/80">{encounter.description}</p>

          {/* Battle Map Preview */}
          {mapShowing && map && (
            <div className="bg-info/5 border border-info/20 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="w-4 h-4 text-info" />
                  <span className="text-sm font-semibold text-info">Battle Map</span>
                </div>
                {/* Reveal All button */}
                <button
                  onClick={handleRevealAll}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-purple-500/10 text-purple-400/70 border border-purple-500/15 hover:bg-purple-500/20 hover:text-purple-400 cursor-pointer transition-all"
                >
                  <Eye className="w-3 h-3" />
                  Reveal All
                </button>
              </div>
              <div className="text-[10px] text-text-muted">
                Drag tokens to reposition — changes sync to player in real-time
              </div>
              <BattleMap
                map={map}
                revealedTokens={revealedSet}
                tokenPositions={tokenPositions}
                role="dm"
                fullscreen={false}
                onTokenMove={handleTokenMove}
                proneTokens={proneIds}
                activeTurnToken={activeTurnId ? toTokenId(activeTurnId) : null}
                tokenConditions={tokenConditions}
                deadTokens={deadTokenIds}
              />
            </div>
          )}

          {/* Terrain */}
          {encounter.terrain && (
            <div className="bg-cave-cold/10 border border-cave-cold/20 rounded-lg p-3">
              <div className="text-[10px] text-cave-cold uppercase tracking-wider font-medium mb-1">
                Terrain
              </div>
              <p className="text-xs text-parchment/70">{encounter.terrain}</p>
            </div>
          )}

          {/* Turn Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={nextTurn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gold/15 text-gold border border-gold/25 hover:bg-gold/25 transition-colors cursor-pointer"
                title={
                  activeTurnId
                    ? "Advance to next combatant"
                    : "Start combat — first in initiative order"
                }
              >
                <Zap className="w-3.5 h-3.5" />
                {activeTurnId ? "Next Turn" : "Start Combat"}
              </button>
              {activeTurnId && (
                <span className="text-xs text-text-muted">
                  Round <span className="text-gold font-bold">{round}</span>
                </span>
              )}
            </div>
            <button
              onClick={resetEncounter}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-parchment transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Combatants */}
          <div className="space-y-2">
            {sorted.map((c) => {
              const tokenId = toTokenId(c.id)
              const hasToken = map?.tokens?.[tokenId] !== undefined
              return (
                <CombatantRow
                  key={c.id}
                  combatant={c}
                  onHpChange={(delta) => updateHp(c.id, delta)}
                  onInitiativeChange={(val) => updateInitiative(c.id, val)}
                  onConditionToggle={(condition) => toggleCondition(c.id, condition)}
                  isActiveTurn={activeTurnId === c.id}
                  isRevealed={revealedTokenIds.includes(tokenId)}
                  onRevealToggle={() => handleRevealToggle(c.id)}
                  hasToken={hasToken}
                />
              )
            })}
          </div>

          {/* DM Notes */}
          {encounter.notes.length > 0 && (
            <div className="bg-bg-readaloud/60 border border-warning/15 rounded-lg p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                <span className="text-xs font-semibold text-warning uppercase tracking-wider">
                  DM Notes
                </span>
              </div>
              <ul className="space-y-1">
                {encounter.notes.map((n, i) => (
                  <li key={i} className="text-xs text-parchment/70 flex items-start gap-2">
                    <span className="text-warning mt-0.5 shrink-0">•</span>
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function EncounterTracker() {
  const { campaign } = useCampaign()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Swords className="w-6 h-6 text-danger-light" />
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gold">
            Encounter Tracker
          </h2>
          <p className="text-xs text-text-muted">Track initiative, HP, and combat notes</p>
        </div>
      </div>

      {/* Encounter Balance Reference */}
      <div className="bg-bg-surface/40 border border-bg-elevated/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-parchment">Balance Reference (1 PC + Maren)</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-success/10 rounded-lg p-2 text-center">
            <div className="text-[10px] text-success-light uppercase tracking-wider">Easy</div>
            <div className="text-xs text-parchment/80 mt-1">2 Thugs</div>
          </div>
          <div className="bg-warning/10 rounded-lg p-2 text-center">
            <div className="text-[10px] text-warning uppercase tracking-wider">Medium</div>
            <div className="text-xs text-parchment/80 mt-1">3 Thugs or 2 Thugs + Fanatic</div>
          </div>
          <div className="bg-danger/10 rounded-lg p-2 text-center">
            <div className="text-[10px] text-danger-light uppercase tracking-wider">Hard</div>
            <div className="text-xs text-parchment/80 mt-1">Captain + 2 Thugs + Guard</div>
          </div>
        </div>
      </div>

      {/* Encounters */}
      <div className="space-y-3">
        {campaign.encounters.map((e) => (
          <EncounterPanel key={e.id} encounter={e} campaignId={campaign.id} />
        ))}
      </div>
    </div>
  )
}
