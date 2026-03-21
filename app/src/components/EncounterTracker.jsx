import { useState, useCallback, useEffect } from "react";
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
  MonitorUp,
} from "lucide-react";
import { encounters } from "../data/encounters";
import { battleMaps } from "../data/maps";
import { useBroadcast } from "../hooks/useBroadcast";
import ShowButton from "./ShowButton";
import BattleMap from "./BattleMap";

function HPBar({ current, max }) {
  const pct = Math.max(0, Math.min(100, (current / max) * 100));
  let color = "bg-success";
  if (pct <= 25) color = "bg-danger";
  else if (pct <= 50) color = "bg-warning";

  return (
    <div className="w-full h-2 bg-bg-base rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300 rounded-full`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function RevealButton({ tokenId, label }) {
  const { showToPlayer, playerCount } = useBroadcast()
  const [sent, setSent] = useState(false)

  if (playerCount === 0) return null

  const handleClick = (e) => {
    e.stopPropagation()
    showToPlayer("reveal", null, { tokenId })
    setSent(true)
  }

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium
        transition-all duration-200 cursor-pointer shrink-0
        ${sent
          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
          : "bg-purple-500/10 text-purple-400/70 border border-purple-500/15 hover:bg-purple-500/20 hover:text-purple-400"
        }
      `}
      title={`Reveal ${label} on player map`}
    >
      <Eye className="w-3 h-3" />
      {sent ? "Shown" : "Reveal"}
    </button>
  )
}

function MapButton({ encounterId }) {
  const { showToPlayer, playerCount } = useBroadcast()
  const [sent, setSent] = useState(false)

  if (playerCount === 0 || !battleMaps[encounterId]) return null

  const handleClick = (e) => {
    e.stopPropagation()
    showToPlayer("map", encounterId)
    setSent(true)
  }

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
        transition-all duration-200 cursor-pointer
        ${sent
          ? "bg-info/20 text-info border border-info/30"
          : "bg-info/10 text-info/70 border border-info/15 hover:bg-info/20 hover:text-info"
        }
      `}
      title="Show battle map to player"
    >
      <Map className="w-3.5 h-3.5" />
      {sent ? "Map Showing" : "Show Map"}
    </button>
  )
}

function CombatantRow({ combatant, onHpChange, onInitiativeChange }) {
  const [damageInput, setDamageInput] = useState("");
  const isDead = combatant.hp <= 0;

  const applyDamage = () => {
    const val = parseInt(damageInput);
    if (!isNaN(val)) {
      onHpChange(-val);
      setDamageInput("");
    }
  };

  const applyHeal = () => {
    const val = parseInt(damageInput);
    if (!isNaN(val)) {
      onHpChange(val);
      setDamageInput("");
    }
  };

  return (
    <div
      className={`bg-bg-surface/60 border rounded-xl p-4 transition-all duration-200 ${
        isDead
          ? "border-danger/30 opacity-50"
          : combatant.isAlly
          ? "border-success/20"
          : "border-bg-elevated/50"
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        {/* Initiative */}
        <input
          type="number"
          value={combatant.initiative ?? ""}
          onChange={(e) => onInitiativeChange(parseInt(e.target.value) || 0)}
          className="w-10 h-10 rounded-lg bg-bg-base border border-bg-elevated/50 text-center text-sm font-bold text-gold focus:outline-none focus:border-gold/40"
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
            {combatant.isAlly && (
              <span className="text-[10px] bg-success/15 text-success-light px-1.5 py-0.5 rounded-full">
                Ally
              </span>
            )}
            {!combatant.isAlly && (
              <RevealButton tokenId={combatant.id} label={combatant.name} />
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

      {/* Notes */}
      {combatant.notes && (
        <p className="text-xs text-parchment-dim mt-2 italic">
          {combatant.notes}
        </p>
      )}
    </div>
  );
}

function MapControlPanel({ encounter }) {
  const { showToPlayer, lastMessage, playerCount } = useBroadcast()
  const map = battleMaps[encounter.id]
  const [mapShowing, setMapShowing] = useState(false)
  const [revealed, setRevealed] = useState(new Set())
  const [killed, setKilled] = useState(new Set())
  const [tokenPositions, setTokenPositions] = useState({})

  if (!map || playerCount === 0) return null

  const enemies = Object.entries(map.tokens).filter(([, t]) => !t.ally)

  // Listen for player moves
  useEffect(() => {
    if (lastMessage?.type === "move") {
      setTokenPositions(prev => ({
        ...prev,
        [lastMessage.tokenId]: { x: lastMessage.x, y: lastMessage.y },
      }))
    }
  }, [lastMessage])

  const handleShowMap = () => {
    showToPlayer("map", encounter.id)
    setMapShowing(true)
    setRevealed(new Set())
    setKilled(new Set())
    setTokenPositions({})
  }

  const handleReveal = (tokenId) => {
    showToPlayer("reveal", null, { tokenId })
    setRevealed(prev => new Set([...prev, tokenId]))
  }

  const handleRevealAll = () => {
    enemies.forEach(([id]) => {
      showToPlayer("reveal", null, { tokenId: id })
    })
    setRevealed(new Set(enemies.map(([id]) => id)))
  }

  const handleKill = (tokenId) => {
    const newKilled = new Set([...killed, tokenId])
    setKilled(newKilled)
    showToPlayer("kill", null, { tokenId })

    // Check if all enemies are dead → victory!
    if (newKilled.size === enemies.length) {
      setTimeout(() => {
        showToPlayer("battleWon", null, { encounterName: encounter.name })
      }, 800)
    }
  }

  const handleTokenMove = (tokenId, x, y) => {
    setTokenPositions(prev => ({ ...prev, [tokenId]: { x, y } }))
    showToPlayer("move", null, { tokenId, x, y })
  }

  // Build revealed set excluding killed
  const visibleTokens = new Set([...revealed].filter(id => !killed.has(id)))

  return (
    <div className="bg-info/5 border border-info/20 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-info" />
          <span className="text-sm font-semibold text-info">Player Map Controls</span>
        </div>
        <div className="flex items-center gap-2">
          {mapShowing && enemies.length > 0 && (
            <button
              onClick={handleRevealAll}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-purple-500/15 text-purple-400 border border-purple-500/20 hover:bg-purple-500/25 transition-colors cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              Reveal All
            </button>
          )}
          <button
            onClick={handleShowMap}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              mapShowing
                ? "bg-info/20 text-info border border-info/30"
                : "bg-info/10 text-info/80 border border-info/20 hover:bg-info/20 hover:text-info"
            }`}
          >
            <MonitorUp className="w-3.5 h-3.5" />
            {mapShowing ? "Map Live" : "Show Map to Player"}
          </button>
        </div>
      </div>

      {mapShowing && (
        <>
          {/* DM Map Preview — drag tokens here! */}
          <div className="text-[10px] text-text-muted uppercase tracking-wider">
            Drag tokens to move them — both sides see changes in real-time
          </div>
          <BattleMap
            map={map}
            revealedTokens={visibleTokens}
            tokenPositions={tokenPositions}
            role="dm"
            fullscreen={false}
            onTokenMove={handleTokenMove}
          />

          {/* Enemy controls */}
          <div className="grid grid-cols-2 gap-2">
            {enemies.map(([id, token]) => {
              const isRevealed = revealed.has(id)
              const isDead = killed.has(id)
              return (
                <div
                  key={id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${
                    isDead
                      ? "bg-danger/5 border-danger/20 opacity-50"
                      : isRevealed
                      ? "bg-purple-500/10 border-purple-500/25"
                      : "bg-bg-base/50 border-bg-elevated/40"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                    style={{
                      backgroundColor: isDead ? "#c0392b22" : token.color + "22",
                      color: isDead ? "#c0392b" : token.color,
                      border: `2px solid ${isDead ? "#c0392b" : token.color}44`,
                    }}
                  >
                    {isDead ? <Skull className="w-3 h-3" /> : token.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium ${isDead ? "text-danger line-through" : isRevealed ? "text-parchment" : "text-parchment/60"}`}>
                      {token.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!isRevealed && !isDead && (
                      <button onClick={() => handleReveal(id)}
                        className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 cursor-pointer">
                        Reveal
                      </button>
                    )}
                    {isRevealed && !isDead && (
                      <button onClick={() => handleKill(id)}
                        className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-danger/15 text-danger-light hover:bg-danger/25 cursor-pointer flex items-center gap-0.5">
                        <Skull className="w-2.5 h-2.5" /> Kill
                      </button>
                    )}
                    {isDead && (
                      <span className="text-[9px] text-danger">Dead</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function EncounterPanel({ encounter }) {
  const [open, setOpen] = useState(false);
  const [combatants, setCombatants] = useState(() =>
    [
      ...encounter.enemies.map((e) => ({ ...e, isAlly: false, initiative: null })),
      ...encounter.allies.map((a) => ({ ...a, isAlly: true, initiative: null })),
    ]
  );
  const [round, setRound] = useState(1);

  const resetEncounter = useCallback(() => {
    setCombatants(
      [
        ...encounter.enemies.map((e) => ({ ...e, isAlly: false, initiative: null })),
        ...encounter.allies.map((a) => ({ ...a, isAlly: true, initiative: null })),
      ]
    );
    setRound(1);
  }, [encounter]);

  const updateHp = useCallback((id, delta) => {
    setCombatants((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, hp: Math.max(0, Math.min(c.maxHp, c.hp + delta)) }
          : c
      )
    );
  }, []);

  const updateInitiative = useCallback((id, val) => {
    setCombatants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, initiative: val } : c))
    );
  }, []);

  const sorted = [...combatants].sort(
    (a, b) => (b.initiative ?? -1) - (a.initiative ?? -1)
  );

  const diffColors = {
    Easy: "text-success-light bg-success/15",
    Medium: "text-warning bg-warning/15",
    Hard: "text-danger-light bg-danger/15",
  };

  return (
    <div className="bg-bg-surface/40 border border-bg-elevated/30 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer hover:bg-bg-surface/60 transition-colors"
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
        <span className="flex items-center gap-2">
          <ShowButton type="combat" id={encounter.id} label={encounter.name} />
          <span
            className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${
              diffColors[encounter.difficulty] || ""
            }`}
          >
            {encounter.difficulty}
          </span>
        </span>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          <p className="text-sm text-parchment/80">{encounter.description}</p>

          {/* Map Control Panel */}
          {battleMaps[encounter.id] && <MapControlPanel encounter={encounter} />}

          {/* Terrain */}
          {encounter.terrain && (
            <div className="bg-cave-cold/10 border border-cave-cold/20 rounded-lg p-3">
              <div className="text-[10px] text-cave-cold uppercase tracking-wider font-medium mb-1">
                Terrain
              </div>
              <p className="text-xs text-parchment/70">{encounter.terrain}</p>
            </div>
          )}

          {/* Round Tracker */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs text-text-muted uppercase tracking-wider">
                Round
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setRound((r) => Math.max(1, r - 1))}
                  className="p-1 rounded bg-bg-base hover:bg-bg-elevated transition-colors cursor-pointer text-text-muted"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-lg font-bold text-gold">
                  {round}
                </span>
                <button
                  onClick={() => setRound((r) => r + 1)}
                  className="p-1 rounded bg-bg-base hover:bg-bg-elevated transition-colors cursor-pointer text-text-muted"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
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
            {sorted.map((c) => (
              <CombatantRow
                key={c.id}
                combatant={c}
                onHpChange={(delta) => updateHp(c.id, delta)}
                onInitiativeChange={(val) => updateInitiative(c.id, val)}
              />
            ))}
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
  );
}

export default function EncounterTracker() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Swords className="w-6 h-6 text-danger-light" />
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gold">
            Encounter Tracker
          </h2>
          <p className="text-xs text-text-muted">
            Track initiative, HP, and combat notes
          </p>
        </div>
      </div>

      {/* Encounter Balance Reference */}
      <div className="bg-bg-surface/40 border border-bg-elevated/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gold" />
          <h3 className="text-sm font-semibold text-parchment">
            Balance Reference (1 PC + Maren)
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-success/10 rounded-lg p-2 text-center">
            <div className="text-[10px] text-success-light uppercase tracking-wider">
              Easy
            </div>
            <div className="text-xs text-parchment/80 mt-1">2 Thugs</div>
          </div>
          <div className="bg-warning/10 rounded-lg p-2 text-center">
            <div className="text-[10px] text-warning uppercase tracking-wider">
              Medium
            </div>
            <div className="text-xs text-parchment/80 mt-1">
              3 Thugs or 2 Thugs + Fanatic
            </div>
          </div>
          <div className="bg-danger/10 rounded-lg p-2 text-center">
            <div className="text-[10px] text-danger-light uppercase tracking-wider">
              Hard
            </div>
            <div className="text-xs text-parchment/80 mt-1">
              Captain + 2 Thugs + Guard
            </div>
          </div>
        </div>
      </div>

      {/* Encounters */}
      <div className="space-y-3">
        {encounters.map((e) => (
          <EncounterPanel key={e.id} encounter={e} />
        ))}
      </div>
    </div>
  );
}
