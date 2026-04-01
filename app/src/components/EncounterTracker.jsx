import { useState, useCallback, useEffect, useMemo } from "react";
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
  PersonStanding,
  Brain,
  CircleSlash,
  Ghost,
} from "lucide-react";
import { useCampaign } from "../hooks/useCampaign";
import { useBroadcast } from "../hooks/useBroadcast";
import { usePersistedState } from "../hooks/usePersistedState";
import ShowButton from "./ShowButton";
import BattleMap from "./BattleMap";

const CONDITIONS = [
  { key: "prone", label: "Prone", tooltip: "Prone — disadvantage on attacks, attackers within 5ft have advantage", icon: PersonStanding, color: "#ff9944" },
  { key: "concentrating", label: "Conc", tooltip: "Concentrating — maintaining a spell", icon: Brain, color: "#44aaff" },
  { key: "stunned", label: "Stun", tooltip: "Stunned — incapacitated, auto-fail STR/DEX saves, attacks have advantage", icon: CircleSlash, color: "#ffcc00" },
  { key: "frightened", label: "Frght", tooltip: "Frightened — disadvantage on checks/attacks while source is in sight", icon: Ghost, color: "#cc66ff" },
];

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
  const { campaign } = useCampaign()
  const { showToPlayer, playerCount } = useBroadcast()
  const [sent, setSent] = useState(false)

  if (playerCount === 0 || !campaign.battleMaps[encounterId]) return null

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

function ConditionToggles({ conditions = [], onToggle }) {
  return (
    <div className="flex items-center gap-1 mt-2">
      {CONDITIONS.map(({ key, label, tooltip, icon: Icon, color }) => {
        const active = conditions.includes(key);
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className={`
              inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium
              transition-all duration-200 cursor-pointer border
              ${active
                ? "opacity-100"
                : "opacity-40 hover:opacity-70"
              }
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
        );
      })}
    </div>
  );
}

function CombatantRow({ combatant, onHpChange, onInitiativeChange, onConditionToggle, isActiveTurn }) {
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

      {/* Condition Toggles */}
      <ConditionToggles
        conditions={combatant.conditions}
        onToggle={(condition) => onConditionToggle(condition)}
      />

      {/* Notes */}
      {combatant.notes && (
        <p className="text-xs text-parchment-dim mt-2 italic">
          {combatant.notes}
        </p>
      )}
    </div>
  );
}

function MapControlPanel({ encounter, activeTurnId, proneIds, tokenConditions = {} }) {
  const { campaign } = useCampaign()
  const { showToPlayer, lastMessage, playerCount } = useBroadcast()
  const map = campaign.battleMaps[encounter.id]
  const [mapShowing, setMapShowing] = useState(false)
  const [revealed, setRevealed] = useState(new Set())
  const [killed, setKilled] = useState(new Set())
  const [tokenPositions, setTokenPositions] = useState({})

  // Listen for player moves — must be before any early return
  useEffect(() => {
    if (lastMessage?.type === "move") {
      setTokenPositions(prev => ({
        ...prev,
        [lastMessage.tokenId]: { x: lastMessage.x, y: lastMessage.y },
      }))
    }
  }, [lastMessage])

  if (!map || playerCount === 0) return null

  const enemies = Object.entries(map.tokens).filter(([, t]) => !t.ally)

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

  const handleProne = (tokenId) => {
    const isProne = proneIds.has(tokenId)
    const currentConds = tokenConditions[tokenId] || []
    const newConds = isProne
      ? currentConds.filter((c) => c !== "prone")
      : [...currentConds, "prone"]
    showToPlayer("conditions", null, { tokenId, conditions: newConds })
  }

  const handleTokenMove = (tokenId, x, y) => {
    setTokenPositions(prev => ({ ...prev, [tokenId]: { x, y } }))
    showToPlayer("move", null, { tokenId, x, y })
  }

  // Build revealed set excluding killed
  const visibleTokens = useMemo(
    () => new Set([...revealed].filter(id => !killed.has(id))),
    [revealed, killed]
  )

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
            proneTokens={proneIds}
            activeTurnToken={activeTurnId}
            tokenConditions={tokenConditions}
          />

          {/* Enemy controls */}
          <div className="grid grid-cols-2 gap-2">
            {enemies.map(([id, token]) => {
              const isRevealed = revealed.has(id)
              const isDead = killed.has(id)
              const isProne = proneIds.has(id)
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
                      <>
                        <button onClick={() => handleProne(id)}
                          title="Toggle prone — token flattens on map"
                          className={`px-1.5 py-0.5 rounded text-[9px] font-medium cursor-pointer flex items-center gap-0.5 transition-all ${
                            isProne
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : "bg-orange-500/10 text-orange-400/60 hover:bg-orange-500/15 border border-transparent"
                          }`}>
                          <PersonStanding className="w-2.5 h-2.5" /> Prone
                        </button>
                        <button onClick={() => handleKill(id)}
                          className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-danger/15 text-danger-light hover:bg-danger/25 cursor-pointer flex items-center gap-0.5">
                          <Skull className="w-2.5 h-2.5" /> Kill
                        </button>
                      </>
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

function EncounterPanel({ encounter, campaignId }) {
  const [open, setOpen] = useState(false);
  const { showToPlayer, playerCount } = useBroadcast();
  const { campaign } = useCampaign();
  const mapExists = !!campaign.battleMaps[encounter.id];

  const map = campaign.battleMaps[encounter.id];

  const defaultCombatants = () => {
    const list = [
      ...encounter.enemies.map((e) => ({ ...e, isAlly: false, initiative: null, conditions: [] })),
      ...encounter.allies.map((a) => ({ ...a, isAlly: true, initiative: null, conditions: [] })),
    ];
    // Auto-add PC if the map has a player token
    if (map?.tokens?.player) {
      list.unshift({
        id: "player", name: "Player", isAlly: true, isPC: true,
        hp: 25, maxHp: 25, ac: 15, initiative: null, conditions: [], notes: "",
      });
    }
    return list;
  };

  const [combatants, setCombatants] = usePersistedState(
    `dm:${campaignId}:encounter:${encounter.id}:combatants`,
    defaultCombatants()
  );

  // Migrate: inject PC if persisted state predates the PC addition
  useEffect(() => {
    if (map?.tokens?.player) {
      setCombatants((prev) => {
        if (prev.find((c) => c.id === "player")) return prev;
        return [{
          id: "player", name: "Player", isAlly: true, isPC: true,
          hp: 25, maxHp: 25, ac: 15, initiative: null, conditions: [], notes: "",
        }, ...prev];
      });
    }
  }, [map]);
  const [round, setRound] = usePersistedState(
    `dm:${campaignId}:encounter:${encounter.id}:round`,
    1
  );
  const [activeTurnId, setActiveTurnId] = usePersistedState(
    `dm:${campaignId}:encounter:${encounter.id}:activeTurn`,
    null
  );

  // Map combatant IDs → map token IDs. Enemies match directly; allies use npcId.
  const toTokenId = useCallback((combatantId) => {
    if (!map) return combatantId;
    if (map.tokens[combatantId]) return combatantId; // direct match (enemies)
    const combatant = combatants.find((c) => c.id === combatantId);
    if (combatant?.npcId && map.tokens[combatant.npcId]) return combatant.npcId;
    return combatantId;
  }, [map, combatants]);

  const resetEncounter = useCallback(() => {
    setCombatants(defaultCombatants());
    setRound(1);
    setActiveTurnId(null);
  }, [encounter, setCombatants, setRound, setActiveTurnId]);

  const updateHp = useCallback((id, delta) => {
    setCombatants((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, hp: Math.max(0, Math.min(c.maxHp, c.hp + delta)) }
          : c
      )
    );
    // Broadcast floating damage number if map is live and players connected
    if (playerCount > 0 && mapExists) {
      showToPlayer("damage", null, { tokenId: toTokenId(id), value: delta })
    }
  }, [setCombatants, playerCount, mapExists, showToPlayer, toTokenId]);

  const updateInitiative = useCallback((id, val) => {
    setCombatants((prev) =>
      prev.map((c) => (c.id === id ? { ...c, initiative: val } : c))
    );
  }, [setCombatants]);

  const toggleCondition = useCallback((id, condition) => {
    // Compute new conditions before state update so broadcast is reliable
    const combatant = combatants.find((c) => c.id === id);
    const conditions = combatant?.conditions || [];
    const has = conditions.includes(condition);
    const newConditions = has
      ? conditions.filter((x) => x !== condition)
      : [...conditions, condition];

    setCombatants((prev) =>
      prev.map((c) => c.id === id ? { ...c, conditions: newConditions } : c)
    );

    if (playerCount > 0 && mapExists) {
      showToPlayer("conditions", null, { tokenId: toTokenId(id), conditions: newConditions });
    }
  }, [combatants, setCombatants, playerCount, mapExists, showToPlayer, toTokenId]);

  const sorted = useMemo(
    () => [...combatants].sort((a, b) => (b.initiative ?? -1) - (a.initiative ?? -1)),
    [combatants]
  );

  const nextTurn = useCallback(() => {
    const alive = sorted.filter((c) => c.hp > 0);
    if (alive.length === 0) return;
    if (!activeTurnId) {
      // Start combat — first combatant
      const first = alive[0];
      setActiveTurnId(first.id);
      setRound(1);
      if (playerCount > 0 && mapExists) {
        showToPlayer("activeTurn", null, { tokenId: toTokenId(first.id) });
      }
      return;
    }
    const currentIdx = alive.findIndex((c) => c.id === activeTurnId);
    const nextIdx = currentIdx + 1;
    if (nextIdx >= alive.length) {
      // Wrap to top — new round
      const first = alive[0];
      setActiveTurnId(first.id);
      setRound((r) => r + 1);
      if (playerCount > 0 && mapExists) {
        showToPlayer("activeTurn", null, { tokenId: toTokenId(first.id) });
      }
    } else {
      const next = alive[nextIdx];
      setActiveTurnId(next.id);
      if (playerCount > 0 && mapExists) {
        showToPlayer("activeTurn", null, { tokenId: toTokenId(next.id) });
      }
    }
  }, [sorted, activeTurnId, playerCount, mapExists, showToPlayer, toTokenId]);

  // Collect conditions per token for passing to MapControlPanel / BattleMap
  // Uses map token IDs so conditions render on the correct tokens
  const { tokenConditions, proneIds } = useMemo(() => {
    const conditions = {};
    const prone = new Set();
    combatants.forEach((c) => {
      const conds = c.conditions || [];
      const tid = toTokenId(c.id);
      if (conds.length > 0) conditions[tid] = conds;
      if (conds.includes("prone")) prone.add(tid);
    });
    return { tokenConditions: conditions, proneIds: prone };
  }, [combatants, toTokenId]);

  const diffColors = {
    Easy: "text-success-light bg-success/15",
    Medium: "text-warning bg-warning/15",
    Hard: "text-danger-light bg-danger/15",
  };

  return (
    <div className="bg-bg-surface/40 border border-bg-elevated/30 rounded-xl overflow-hidden">
      <div
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer hover:bg-bg-surface/60 transition-colors"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!open); } }}
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
        <span className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <ShowButton type="combat" id={encounter.id} label={encounter.name} />
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

          {/* Map Control Panel */}
          <MapControlPanel encounter={encounter} activeTurnId={activeTurnId ? toTokenId(activeTurnId) : null} proneIds={proneIds} tokenConditions={tokenConditions} />

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
                title={activeTurnId ? "Advance to next combatant" : "Start combat — first in initiative order"}
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
            {sorted.map((c) => (
              <CombatantRow
                key={c.id}
                combatant={c}
                onHpChange={(delta) => updateHp(c.id, delta)}
                onInitiativeChange={(val) => updateInitiative(c.id, val)}
                onConditionToggle={(condition) => toggleCondition(c.id, condition)}
                isActiveTurn={activeTurnId === c.id}
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
  const { campaign } = useCampaign();

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
        {campaign.encounters.map((e) => (
          <EncounterPanel key={e.id} encounter={e} campaignId={campaign.id} />
        ))}
      </div>
    </div>
  );
}
