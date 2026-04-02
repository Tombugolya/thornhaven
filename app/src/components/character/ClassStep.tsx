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

interface ClassStepProps {
  classes: SrdReference[]
  skills: SrdSkill[]
  state: WizardState
  onChange: (updates: Partial<WizardState>) => void
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {classes.map((ref) => {
          const isSelected = selectedIndex === ref.index
          const isLoading = loadingClass === ref.index
          return (
            <button
              key={ref.index}
              onClick={() => handleSelectClass(ref)}
              disabled={isLoading}
              className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "border-gold/50 bg-gold/5 ring-1 ring-gold/20"
                  : "bg-bg-surface/60 border-bg-elevated/50 hover:bg-bg-surface hover:border-bg-hover"
              }`}
            >
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
            <span className="px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium">
              d{classDetail.hit_die} Hit Die
            </span>
          </div>

          {/* Saving throws */}
          <div>
            <h4 className="text-parchment text-xs uppercase tracking-wider mb-2">Saving Throws</h4>
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
                  Skill Proficiencies
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
