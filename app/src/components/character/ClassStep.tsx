import { useState, useCallback, useMemo } from "react"
import type { SrdReference, SrdSkill, WizardState } from "../../types/character"
import { fetchClass } from "../../services/srd"
import {
  classSavingThrows,
  classBaseProficiencies,
  classSkillChoices,
} from "../../services/calculations"
import { ABILITY_LABELS } from "../../types/character"
import type { AbilityKey } from "../../types/character"
import Tooltip from "./Tooltip"

interface ClassStepProps {
  classes: SrdReference[]
  skills: SrdSkill[]
  state: WizardState
  onChange: (updates: Partial<WizardState>) => void
}

const classIcons: Record<string, React.ReactElement> = {
  barbarian: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 4l6 12 6-12" />
      <path d="M8 8l8 16 8-16" />
      <path d="M16 20v8" />
    </svg>
  ),
  bard: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8c0-2 2-4 4-4s4 2 4 4" />
      <path d="M12 8v14a4 4 0 004 4 4 4 0 004-4V8" />
      <path d="M12 14h8M12 18h8" />
    </svg>
  ),
  cleric: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="16" cy="16" r="8" />
      <path d="M16 8v16M8 16h16" />
      <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.2" />
    </svg>
  ),
  druid: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 28V16" />
      <path d="M16 16c-6-2-8-8-6-12 4 2 8 6 6 12z" />
      <path d="M16 16c6-2 8-8 6-12-4 2-8 6-6 12z" />
      <path d="M12 28c0-2 2-3 4-3s4 1 4 3" />
    </svg>
  ),
  fighter: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4v18M12 8l4-4 4 4" />
      <path d="M10 12h12" />
      <circle cx="16" cy="26" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  monk: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="16" cy="16" r="10" />
      <path d="M16 6a10 10 0 010 20" fill="currentColor" opacity="0.15" />
      <circle cx="12" cy="14" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="20" cy="18" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  ),
  paladin: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4L6 10v8c0 6 4 9 10 12 6-3 10-6 10-12v-8L16 4z" />
      <path d="M16 10v10M12 15h8" />
    </svg>
  ),
  ranger: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 26L26 6" />
      <path d="M20 6h6v6" />
      <path d="M6 26l6-2-4-4-2 6z" fill="currentColor" opacity="0.3" />
      <path d="M14 14l4 4" />
    </svg>
  ),
  rogue: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4l2 12-2 2-2-2 2-12z" />
      <path d="M12 18c-2 1-3 3-3 5h14c0-2-1-4-3-5" />
      <path d="M14 16h4" />
      <circle cx="16" cy="26" r="2" />
    </svg>
  ),
  sorcerer: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 4l2 6-2 2-2-2 2-6z" />
      <path d="M16 12l5 4-3 1 3 5-5-4 3-1-3-5z" fill="currentColor" opacity="0.2" />
      <path d="M8 16l3 2-1 3-2-5zM24 16l-3 2 1 3 2-5z" />
      <circle cx="16" cy="22" r="4" />
    </svg>
  ),
  warlock: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 16c0-6 4-10 8-12 4 2 8 6 8 12s-4 10-8 12c-4-2-8-6-8-12z" />
      <ellipse cx="16" cy="16" rx="3" ry="5" />
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  ),
  wizard: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 2l4 12H12l4-12z" fill="currentColor" opacity="0.15" />
      <path d="M16 14v14" />
      <path d="M10 28h12" />
      <circle cx="16" cy="10" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  ),
}

function HitDieBadge({ die }: { die: number }) {
  return (
    <div className="relative inline-flex items-center justify-center w-10 h-10">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="absolute inset-0">
        <polygon
          points="20,2 38,12 38,28 20,38 2,28 2,12"
          fill="rgba(201,162,39,0.08)"
          stroke="rgba(201,162,39,0.3)"
          strokeWidth="1"
        />
      </svg>
      <span className="relative text-gold text-xs font-bold font-mono">d{die}</span>
    </div>
  )
}

export default function ClassStep({ classes, skills, state, onChange }: ClassStepProps) {
  const [loadingClass, setLoadingClass] = useState<string | null>(null)

  const selectedIndex = state.class?.index ?? null

  const handleSelectClass = useCallback(
    async (ref: SrdReference) => {
      if (ref.index === selectedIndex) return
      setLoadingClass(ref.index)
      try {
        const cls = await fetchClass(ref.index)
        onChange({ class: cls, selectedSkills: [] })
      } finally {
        setLoadingClass(null)
      }
    },
    [selectedIndex, onChange],
  )

  const classDetail = state.class

  const savingThrows = useMemo(() => {
    if (!classDetail) return []
    return classSavingThrows(classDetail)
  }, [classDetail])

  const proficiencies = useMemo(() => {
    if (!classDetail) return { armor: [], weapons: [], tools: [] }
    return classBaseProficiencies(classDetail)
  }, [classDetail])

  const skillChoice = useMemo(() => {
    if (!classDetail) return { choose: 0, options: [] }
    return classSkillChoices(classDetail)
  }, [classDetail])

  const skillMap = useMemo(() => {
    const map = new Map<string, SrdSkill>()
    for (const s of skills) {
      map.set(s.index, s)
    }
    return map
  }, [skills])

  const handleToggleSkill = useCallback(
    (skillIndex: string) => {
      const current = state.selectedSkills
      if (current.includes(skillIndex)) {
        onChange({ selectedSkills: current.filter((s) => s !== skillIndex) })
      } else if (current.length < skillChoice.choose) {
        onChange({ selectedSkills: [...current, skillIndex] })
      }
    },
    [state.selectedSkills, skillChoice.choose, onChange],
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-gold text-xl mb-1">
          Choose Your Class
        </h2>
        <p className="text-text-muted text-sm">
          Your class defines your combat style, abilities, and role in the party.
        </p>
      </div>

      {/* Class grid */}
      {!selectedIndex && (
        <p className="text-text-muted/60 text-xs italic">Click to select a class</p>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {classes.map((ref) => {
          const isSelected = selectedIndex === ref.index
          const isLoading = loadingClass === ref.index
          const icon = classIcons[ref.index]
          return (
            <button
              key={ref.index}
              onClick={() => handleSelectClass(ref)}
              disabled={isLoading}
              className={`relative text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-gold/50 bg-gold/5 ring-1 ring-gold/30 shadow-[0_0_15px_rgba(201,162,39,0.1)]"
                  : "bg-bg-surface/60 border-bg-elevated/50 hover:bg-bg-surface hover:border-gold/20 hover:shadow-[0_0_10px_rgba(201,162,39,0.05)]"
              }`}
              style={isSelected ? { animation: "loadFadeIn 0.3s ease-out" } : undefined}
            >
              {isSelected && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />
              )}
              {icon && (
                <div
                  className={`mb-2 ${isSelected ? "text-gold" : "text-text-muted"} transition-colors duration-300`}
                >
                  {icon}
                </div>
              )}
              <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-parchment">
                {ref.name}
              </h3>
              {isLoading && <p className="text-text-muted text-xs mt-1">Loading...</p>}
              {isSelected && classDetail && (
                <div className="mt-2 space-y-1">
                  <p className="text-gold/80 text-xs font-medium">d{classDetail.hit_die} Hit Die</p>
                  <p className="text-text-muted text-xs">
                    Saves:{" "}
                    {savingThrows
                      .map((k) => ABILITY_LABELS[k].slice(0, 3).toUpperCase())
                      .join(", ")}
                  </p>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected class detail panel */}
      {classDetail && (
        <div
          className="bg-bg-surface/60 border border-bg-elevated/50 rounded-xl p-5 space-y-4"
          style={{ animation: "loadFadeIn 0.3s ease-out" }}
        >
          <div className="flex items-baseline justify-between">
            <h3 className="font-[family-name:var(--font-display)] text-gold text-lg">
              {classDetail.name}
            </h3>
            <Tooltip text="The die you roll when gaining HP on level up">
              <HitDieBadge die={classDetail.hit_die} />
            </Tooltip>
          </div>

          {/* Saving throws */}
          <div>
            <h4 className="text-parchment text-xs uppercase tracking-wider mb-2">
              <Tooltip text="Ability checks to resist effects like spells">Saving Throws</Tooltip>
            </h4>
            <div className="flex gap-2">
              {savingThrows.map((key: AbilityKey) => (
                <span
                  key={key}
                  className="px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium"
                >
                  {ABILITY_LABELS[key]}
                </span>
              ))}
            </div>
          </div>

          {/* Proficiencies */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {proficiencies.armor.length > 0 && (
              <div>
                <h4 className="text-parchment text-xs uppercase tracking-wider mb-1">Armor</h4>
                <ul className="space-y-0.5">
                  {proficiencies.armor.map((a) => (
                    <li key={a} className="text-parchment text-sm">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {proficiencies.weapons.length > 0 && (
              <div>
                <h4 className="text-parchment text-xs uppercase tracking-wider mb-1">Weapons</h4>
                <ul className="space-y-0.5">
                  {proficiencies.weapons.map((w) => (
                    <li key={w} className="text-parchment text-sm">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {proficiencies.tools.length > 0 && (
              <div>
                <h4 className="text-parchment text-xs uppercase tracking-wider mb-1">Tools</h4>
                <ul className="space-y-0.5">
                  {proficiencies.tools.map((t) => (
                    <li key={t} className="text-parchment text-sm">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Spellcasting */}
          {classDetail.spellcasting && (
            <div>
              <h4 className="text-parchment text-xs uppercase tracking-wider mb-1">Spellcasting</h4>
              <p className="text-parchment text-sm">
                Spellcasting Ability:{" "}
                <span className="text-gold font-medium">
                  {classDetail.spellcasting.spellcasting_ability.name}
                </span>
              </p>
            </div>
          )}

          {/* Skill proficiency selection */}
          {skillChoice.options.length > 0 && (
            <div className="border-t border-bg-elevated/30 pt-4">
              <div className="flex items-baseline justify-between mb-3">
                <h4 className="text-parchment text-xs uppercase tracking-wider">
                  Skill Proficiencies <span className="text-gold">*</span>
                </h4>
                <span
                  className={`text-xs font-medium ${
                    state.selectedSkills.length === skillChoice.choose
                      ? "text-gold"
                      : "text-text-muted"
                  }`}
                >
                  {state.selectedSkills.length} / {skillChoice.choose} selected
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {skillChoice.options.map((skillIndex) => {
                  const skill = skillMap.get(skillIndex)
                  const isChecked = state.selectedSkills.includes(skillIndex)
                  const isDisabled = !isChecked && state.selectedSkills.length >= skillChoice.choose
                  return (
                    <button
                      key={skillIndex}
                      onClick={() => handleToggleSkill(skillIndex)}
                      disabled={isDisabled}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-all duration-200 cursor-pointer ${
                        isChecked
                          ? "bg-gold/15 text-gold border border-gold/30"
                          : isDisabled
                            ? "bg-bg-elevated/20 text-text-muted/50 border border-bg-elevated/30 cursor-not-allowed"
                            : "bg-bg-elevated/30 text-parchment border border-bg-elevated/40 hover:bg-bg-elevated/50"
                      }`}
                    >
                      {/* Checkbox indicator */}
                      <span
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? "border-gold bg-gold/20" : "border-text-muted/40"
                        }`}
                      >
                        {isChecked && (
                          <svg
                            className="w-2.5 h-2.5 text-gold"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className="truncate">{skill?.name ?? skillIndex}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
