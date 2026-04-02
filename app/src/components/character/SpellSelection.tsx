import { useState, useEffect, useCallback, useMemo } from "react"
import type { SrdSpellDetail, WizardState } from "../../types/character"
import { fetchClassSpells, fetchSpell } from "../../services/srd"
import Tooltip from "./Tooltip"

interface SpellListItem {
  index: string
  name: string
  level: number
}

interface SpellSelectionProps {
  classIndex: string
  state: WizardState
  onChange: (updates: Partial<WizardState>) => void
}

const CANTRIP_LIMITS: Record<string, number> = {
  wizard: 3,
  cleric: 3,
  druid: 3,
  bard: 2,
  sorcerer: 4,
  warlock: 2,
}

const SPELL_LIMITS: Record<string, number> = {
  wizard: 6,
  cleric: 0,
  druid: 0,
  bard: 4,
  sorcerer: 2,
  warlock: 2,
}

/** Classes that get spells at level 2 instead of level 1 */
const SPELLS_AT_LEVEL_2 = new Set(["ranger", "paladin"])

function spellLimitLabel(classIndex: string): string {
  if (classIndex === "cleric" || classIndex === "druid") {
    return "Select spells to prepare (WIS mod + level, no limit enforced)"
  }
  if (classIndex === "wizard") {
    return "Choose spells for your spellbook"
  }
  return "Choose your known spells"
}

export default function SpellSelection({ classIndex, state, onChange }: SpellSelectionProps) {
  const [allSpells, setAllSpells] = useState<SpellListItem[]>([])
  const [spellDetails, setSpellDetails] = useState<Map<string, SrdSpellDetail>>(new Map())
  const [loading, setLoading] = useState(true)
  const [expandedSpell, setExpandedSpell] = useState<string | null>(null)

  const cantripLimit = CANTRIP_LIMITS[classIndex] ?? 0
  const spellLimit = SPELL_LIMITS[classIndex] ?? 0
  const isDelayedCaster = SPELLS_AT_LEVEL_2.has(classIndex)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchClassSpells(classIndex)
      .then((spells) => {
        if (cancelled) return
        setAllSpells(spells)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [classIndex])

  // Fetch individual spell detail only when expanded (lazy)
  const loadSpellDetail = useCallback(
    async (index: string) => {
      if (spellDetails.has(index)) return
      const detail = await fetchSpell(index)
      setSpellDetails((prev) => {
        const next = new Map(prev)
        next.set(index, detail)
        return next
      })
    },
    [spellDetails],
  )

  const cantrips = useMemo(() => allSpells.filter((s) => s.level === 0), [allSpells])

  const level1Spells = useMemo(() => allSpells.filter((s) => s.level === 1), [allSpells])

  const handleToggleCantrip = useCallback(
    (index: string) => {
      const current = state.selectedCantrips
      if (current.includes(index)) {
        onChange({ selectedCantrips: current.filter((c) => c !== index) })
      } else if (current.length < cantripLimit) {
        onChange({ selectedCantrips: [...current, index] })
      }
    },
    [state.selectedCantrips, cantripLimit, onChange],
  )

  const handleToggleSpell = useCallback(
    (index: string) => {
      const current = state.selectedSpells
      const unlimited = spellLimit === 0
      if (current.includes(index)) {
        onChange({ selectedSpells: current.filter((s) => s !== index) })
      } else if (unlimited || current.length < spellLimit) {
        onChange({ selectedSpells: [...current, index] })
      }
    },
    [state.selectedSpells, spellLimit, onChange],
  )

  const handleToggleExpand = useCallback(
    (index: string) => {
      setExpandedSpell((prev) => (prev === index ? null : index))
      loadSpellDetail(index)
    },
    [loadSpellDetail],
  )

  if (loading) {
    return (
      <div className="border-t border-bg-elevated/30 pt-4">
        <p className="text-text-muted text-sm animate-pulse">Loading spells...</p>
      </div>
    )
  }

  if (isDelayedCaster) {
    return (
      <div className="border-t border-bg-elevated/30 pt-4">
        <h4 className="text-parchment text-xs uppercase tracking-wider mb-2">Spellcasting</h4>
        <p className="text-text-muted text-sm italic">
          {classIndex === "ranger" ? "Rangers" : "Paladins"} gain spellcasting at level 2.
        </p>
      </div>
    )
  }

  return (
    <div className="border-t border-bg-elevated/30 pt-4 space-y-5">
      <h4 className="text-parchment text-xs uppercase tracking-wider">
        <Tooltip text={spellLimitLabel(classIndex)}>Spell Selection</Tooltip>
      </h4>

      {/* Cantrips */}
      {cantripLimit > 0 && cantrips.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h5 className="text-parchment text-xs uppercase tracking-wider">Cantrips</h5>
            <span
              className={`text-xs font-medium ${
                state.selectedCantrips.length === cantripLimit ? "text-gold" : "text-text-muted"
              }`}
            >
              {state.selectedCantrips.length} / {cantripLimit} selected
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cantrips.map((spell) => {
              const detail = spellDetails.get(spell.index)
              const isSelected = state.selectedCantrips.includes(spell.index)
              const isDisabled =
                !isSelected && state.selectedCantrips.length >= cantripLimit
              const isExpanded = expandedSpell === spell.index
              return (
                <div key={spell.index} className="flex flex-col">
                  <button
                    onClick={() => handleToggleCantrip(spell.index)}
                    disabled={isDisabled}
                    className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-gold/15 text-gold border border-gold/30"
                        : isDisabled
                          ? "bg-bg-elevated/20 text-text-muted/50 border border-bg-elevated/30 cursor-not-allowed"
                          : "bg-bg-elevated/30 text-parchment border border-bg-elevated/40 hover:bg-bg-elevated/50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "border-gold bg-gold/20" : "border-text-muted/40"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-2.5 h-2.5 text-gold"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    <div className="min-w-0">
                      <span className="block truncate">{spell.name}</span>
                      {detail && (
                        <span className="block text-[10px] text-text-muted truncate">
                          {detail.school.name}
                        </span>
                      )}
                    </div>
                  </button>
                  {detail && (
                    <button
                      onClick={() => handleToggleExpand(spell.index)}
                      className="text-[10px] text-text-muted hover:text-gold/70 mt-0.5 text-left px-3 cursor-pointer transition-colors"
                    >
                      {isExpanded ? "Hide details" : "Show details"}
                    </button>
                  )}
                  {isExpanded && detail && (
                    <div
                      className="mt-1 px-3 py-2 rounded-lg bg-bg-surface/60 border border-bg-elevated/50 text-xs text-parchment space-y-1"
                      style={{ animation: "loadFadeIn 0.2s ease-out" }}
                    >
                      <p>
                        <span className="text-text-muted">Casting Time:</span>{" "}
                        {detail.casting_time}
                      </p>
                      <p>
                        <span className="text-text-muted">Range:</span> {detail.range}
                      </p>
                      <p>
                        <span className="text-text-muted">Components:</span>{" "}
                        {detail.components.join(", ")}
                      </p>
                      <p>
                        <span className="text-text-muted">Duration:</span> {detail.duration}
                      </p>
                      <p className="italic text-text-muted">{detail.desc[0]}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Level 1 Spells */}
      {level1Spells.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h5 className="text-parchment text-xs uppercase tracking-wider">Level 1 Spells</h5>
            <span
              className={`text-xs font-medium ${
                spellLimit > 0 && state.selectedSpells.length === spellLimit
                  ? "text-gold"
                  : "text-text-muted"
              }`}
            >
              {state.selectedSpells.length}
              {spellLimit > 0 ? ` / ${spellLimit}` : ""} selected
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {level1Spells.map((spell) => {
              const detail = spellDetails.get(spell.index)
              const isSelected = state.selectedSpells.includes(spell.index)
              const isDisabled =
                !isSelected && spellLimit > 0 && state.selectedSpells.length >= spellLimit
              const isExpanded = expandedSpell === spell.index
              return (
                <div key={spell.index} className="flex flex-col">
                  <button
                    onClick={() => handleToggleSpell(spell.index)}
                    disabled={isDisabled}
                    className={`flex items-start gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-gold/15 text-gold border border-gold/30"
                        : isDisabled
                          ? "bg-bg-elevated/20 text-text-muted/50 border border-bg-elevated/30 cursor-not-allowed"
                          : "bg-bg-elevated/30 text-parchment border border-bg-elevated/40 hover:bg-bg-elevated/50"
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "border-gold bg-gold/20" : "border-text-muted/40"
                      }`}
                    >
                      {isSelected && (
                        <svg
                          className="w-2.5 h-2.5 text-gold"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>
                    <div className="min-w-0">
                      <span className="block truncate">{spell.name}</span>
                      {detail && (
                        <span className="block text-[10px] text-text-muted truncate">
                          {detail.school.name}
                        </span>
                      )}
                    </div>
                  </button>
                  {detail && (
                    <button
                      onClick={() => handleToggleExpand(spell.index)}
                      className="text-[10px] text-text-muted hover:text-gold/70 mt-0.5 text-left px-3 cursor-pointer transition-colors"
                    >
                      {isExpanded ? "Hide details" : "Show details"}
                    </button>
                  )}
                  {isExpanded && detail && (
                    <div
                      className="mt-1 px-3 py-2 rounded-lg bg-bg-surface/60 border border-bg-elevated/50 text-xs text-parchment space-y-1"
                      style={{ animation: "loadFadeIn 0.2s ease-out" }}
                    >
                      <p>
                        <span className="text-text-muted">Casting Time:</span>{" "}
                        {detail.casting_time}
                      </p>
                      <p>
                        <span className="text-text-muted">Range:</span> {detail.range}
                      </p>
                      <p>
                        <span className="text-text-muted">Components:</span>{" "}
                        {detail.components.join(", ")}
                      </p>
                      <p>
                        <span className="text-text-muted">Duration:</span> {detail.duration}
                      </p>
                      <p className="italic text-text-muted">{detail.desc[0]}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
