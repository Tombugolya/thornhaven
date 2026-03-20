import { useState, useCallback } from "react";
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
} from "lucide-react";
import { encounters } from "../data/encounters";
import ShowButton from "./ShowButton";

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
