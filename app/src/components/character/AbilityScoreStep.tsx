import { useCallback, useMemo } from "react"
import type { WizardState, AbilityKey, AbilityScores } from "../../types/character"
import {
  ABILITY_KEYS,
  ABILITY_LABELS,
  STANDARD_ARRAY,
  POINT_BUY_COSTS,
  POINT_BUY_TOTAL,
} from "../../types/character"
import {
  computeRacialBonuses,
  applyBonuses,
  formatModifier,
  pointBuyRemaining,
} from "../../services/calculations"

interface AbilityScoreStepProps {
  state: WizardState
  onChange: (updates: Partial<WizardState>) => void
}

const METHODS = [
  { id: "standard-array", label: "Standard Array" },
  { id: "point-buy", label: "Point Buy" },
  { id: "manual", label: "Manual" },
] as const

// Cache scores per method so switching back restores them
const methodScoreCache: Record<string, AbilityScores> = {}

export default function AbilityScoreStep({ state, onChange }: AbilityScoreStepProps) {
  const racialBonuses = useMemo(() => {
    if (!state.race) return {}
    return computeRacialBonuses(state.race, state.subrace)
  }, [state.race, state.subrace])

  const finalScores = useMemo(
    () => applyBonuses(state.baseScores, racialBonuses),
    [state.baseScores, racialBonuses],
  )

  const remaining = useMemo(
    () => pointBuyRemaining(state.baseScores, POINT_BUY_COSTS, POINT_BUY_TOTAL),
    [state.baseScores],
  )

  const handleMethodChange = useCallback(
    (method: WizardState["method"]) => {
      if (method === state.method) return
      // Save current scores before switching
      methodScoreCache[state.method] = { ...state.baseScores }
      // Restore cached scores for the target method, or use defaults
      const cached = methodScoreCache[method]
      if (cached) {
        onChange({ method, baseScores: cached })
      } else if (method === "manual") {
        onChange({ method, baseScores: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 } })
      } else {
        onChange({ method, baseScores: { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 } })
      }
    },
    [state.method, state.baseScores, onChange],
  )

  const handleScoreChange = useCallback(
    (key: AbilityKey, value: number) => {
      onChange({
        baseScores: { ...state.baseScores, [key]: value },
      })
    },
    [state.baseScores, onChange],
  )

  // For standard array: track which values are already assigned
  const usedValues = useMemo(() => {
    if (state.method !== "standard-array") return new Map<number, number>()
    const counts = new Map<number, number>()
    for (const key of ABILITY_KEYS) {
      const val = state.baseScores[key]
      if (STANDARD_ARRAY.includes(val)) {
        counts.set(val, (counts.get(val) ?? 0) + 1)
      }
    }
    return counts
  }, [state.method, state.baseScores])

  const getAvailableValues = useCallback(
    (currentKey: AbilityKey): number[] => {
      const currentVal = state.baseScores[currentKey]
      return STANDARD_ARRAY.filter((v) => {
        if (v === currentVal) return true
        const usedCount = usedValues.get(v) ?? 0
        const totalAvailable = STANDARD_ARRAY.filter((sv) => sv === v).length
        return usedCount < totalAvailable
      })
    },
    [state.baseScores, usedValues],
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-gold text-xl mb-1">
          Ability Scores
        </h2>
        <p className="text-text-muted text-sm">
          Choose how to determine your character{"'"}s six core abilities.
        </p>
      </div>

      {/* Method tabs */}
      <div className="flex gap-2">
        {METHODS.map((m) => (
          <button
            key={m.id}
            onClick={() => handleMethodChange(m.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              state.method === m.id
                ? "bg-gold/15 text-gold border border-gold/30"
                : "bg-bg-surface/60 text-text-muted border border-bg-elevated/50 hover:bg-bg-surface hover:text-parchment"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Method description */}
      <div className="px-4 py-3 rounded-xl bg-bg-surface/40 border border-bg-elevated/30 text-xs text-text-muted">
        {state.method === "standard-array" && (
          <p>
            Assign the values <span className="text-parchment font-mono">15, 14, 13, 12, 10, 8</span> to
            your six abilities. Each value can only be used once. Quick and balanced.
          </p>
        )}
        {state.method === "point-buy" && (
          <p>
            Spend <span className="text-parchment font-bold">{POINT_BUY_TOTAL} points</span> to set scores
            between <span className="text-parchment font-mono">8</span> and{" "}
            <span className="text-parchment font-mono">15</span>. Higher scores cost more points. All
            scores start at 8.
          </p>
        )}
        {state.method === "manual" && (
          <p>
            Enter any values between <span className="text-parchment font-mono">3</span> and{" "}
            <span className="text-parchment font-mono">20</span>. Use this for rolled stats or homebrew
            rules.
          </p>
        )}
      </div>

      {/* Point buy remaining indicator */}
      {state.method === "point-buy" && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-surface/60 border border-bg-elevated/50">
          <span className="text-parchment text-sm">Points Remaining:</span>
          <span
            className={`text-lg font-bold font-mono ${
              remaining > 0 ? "text-green-400" : remaining === 0 ? "text-gold" : "text-red-400"
            }`}
          >
            {remaining}
          </span>
          <span className="text-text-muted text-xs">/ {POINT_BUY_TOTAL}</span>
        </div>
      )}

      {/* Ability score inputs */}
      <div className="space-y-3">
        {ABILITY_KEYS.map((key) => {
          const base = state.baseScores[key]
          const bonus = racialBonuses[key] ?? 0
          const final_ = finalScores[key]

          return (
            <div
              key={key}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-surface/60 border border-bg-elevated/50"
            >
              {/* Ability name */}
              <div className="w-28 shrink-0">
                <span className="font-[family-name:var(--font-display)] text-parchment text-sm">
                  {ABILITY_LABELS[key]}
                </span>
                <span className="text-text-muted text-xs ml-1 uppercase">({key})</span>
              </div>

              {/* Score input */}
              <div className="flex-1">
                {state.method === "standard-array" && (
                  <select
                    value={base}
                    onChange={(e) => handleScoreChange(key, Number(e.target.value))}
                    className="bg-bg-surface border border-gold/30 rounded-lg px-3 py-1.5 text-parchment text-sm focus:outline-none focus:border-gold w-20 cursor-pointer"
                  >
                    <option value={base}>{base === 8 ? "--" : base}</option>
                    {getAvailableValues(key)
                      .filter((v) => v !== base)
                      .map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                  </select>
                )}

                {state.method === "point-buy" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleScoreChange(key, Math.max(8, base - 1))}
                      disabled={base <= 8}
                      className="w-7 h-7 rounded-lg bg-bg-elevated/40 border border-bg-elevated/50 text-parchment text-sm flex items-center justify-center hover:bg-bg-elevated/60 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-parchment text-sm font-mono font-bold">
                      {base}
                    </span>
                    <button
                      onClick={() => handleScoreChange(key, Math.min(15, base + 1))}
                      disabled={
                        base >= 15 ||
                        remaining - ((POINT_BUY_COSTS[base + 1] ?? 0) - (POINT_BUY_COSTS[base] ?? 0)) < 0
                      }
                      className="w-7 h-7 rounded-lg bg-bg-elevated/40 border border-bg-elevated/50 text-parchment text-sm flex items-center justify-center hover:bg-bg-elevated/60 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      +
                    </button>
                    <span className="text-text-muted text-xs ml-1">
                      Cost: {POINT_BUY_COSTS[base] ?? 0}
                    </span>
                  </div>
                )}

                {state.method === "manual" && (
                  <input
                    type="number"
                    min={3}
                    max={20}
                    value={base}
                    onChange={(e) => {
                      const val = Math.max(3, Math.min(20, Number(e.target.value) || 3))
                      handleScoreChange(key, val)
                    }}
                    className="bg-bg-surface border border-gold/30 rounded-lg px-3 py-1.5 text-parchment text-sm focus:outline-none focus:border-gold w-20"
                  />
                )}
              </div>

              {/* Racial bonus badge */}
              {bonus !== 0 && (
                <span className="px-2 py-0.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium shrink-0">
                  +{bonus}
                </span>
              )}

              {/* Final score + modifier */}
              <div className="text-right shrink-0 w-20">
                <span className="text-parchment text-sm font-bold font-mono">{final_}</span>
                <span className="text-text-muted text-xs ml-1">({formatModifier(final_)})</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary table */}
      <div className="border-t border-bg-elevated/30 pt-4">
        <h4 className="text-parchment text-xs uppercase tracking-wider mb-3">
          Ability Score Summary
        </h4>
        <div className="grid grid-cols-6 gap-2">
          {ABILITY_KEYS.map((key) => {
            const base = state.baseScores[key]
            const bonus = racialBonuses[key] ?? 0
            const final_ = finalScores[key]
            return (
              <div
                key={key}
                className="text-center p-3 rounded-xl bg-bg-surface/60 border border-bg-elevated/50"
              >
                <div className="text-text-muted text-[10px] uppercase tracking-wider mb-1">
                  {key}
                </div>
                <div className="text-parchment text-lg font-bold font-mono">{final_}</div>
                <div className="text-gold text-xs font-medium">{formatModifier(final_)}</div>
                {bonus !== 0 && (
                  <div className="text-text-muted text-[10px] mt-1">
                    {base} + {bonus}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
