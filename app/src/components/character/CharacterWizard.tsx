import { useState, useEffect, useCallback, useMemo } from "react"
import type { WizardState, PlayerCharacter, SrdReference, SrdSkill } from "../../types/character"
import {
  INITIAL_WIZARD_STATE,
  ABILITY_KEYS,
  BACKGROUNDS,
  STANDARD_ARRAY,
  POINT_BUY_COSTS,
  POINT_BUY_TOTAL,
} from "../../types/character"
import { preloadCharacterCreationData } from "../../services/srd"
import {
  computeRacialBonuses,
  applyBonuses,
  hpAtLevel1,
  unarmoredAC,
  proficiencyBonus,
  classSavingThrows,
  classBaseProficiencies,
  classSkillChoices,
  pointBuyRemaining,
} from "../../services/calculations"
import LoadingScreen from "../LoadingScreen"
import RaceStep from "./RaceStep"
import ClassStep from "./ClassStep"
import AbilityScoreStep from "./AbilityScoreStep"
import DetailsStep from "./DetailsStep"
import ReviewStep from "./ReviewStep"

interface CharacterWizardProps {
  onComplete: (character: PlayerCharacter) => void
  onCancel: () => void
}

const STEP_NAMES = ["Race", "Class", "Abilities", "Details", "Review"]

export default function CharacterWizard({ onComplete, onCancel }: CharacterWizardProps) {
  const [state, setState] = useState<WizardState>(INITIAL_WIZARD_STATE)
  const [races, setRaces] = useState<SrdReference[]>([])
  const [classes, setClasses] = useState<SrdReference[]>([])
  const [skills, setSkills] = useState<SrdSkill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    preloadCharacterCreationData()
      .then((data) => {
        if (cancelled) return
        setRaces(data.races)
        setClasses(data.classes)
        setSkills(data.skills)
        setLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : "Failed to load game data"
        setError(message)
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Warn on page refresh/close while wizard is open
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [])

  const handleChange = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  const canAdvance = useMemo(() => {
    switch (state.step) {
      case 0:
        // Race must be selected; if subraces exist, one must be chosen
        if (!state.race) return false
        if (state.race.subraces.length > 0 && !state.subrace) return false
        return true
      case 1: {
        // Class must be selected; skill choices must be fulfilled
        if (!state.class) return false
        const choice = classSkillChoices(state.class)
        if (choice.choose > 0 && state.selectedSkills.length !== choice.choose) return false
        return true
      }
      case 2: {
        // Ability scores must be properly assigned
        if (state.method === "standard-array") {
          // All 6 standard array values must be used
          const sorted = ABILITY_KEYS.map((k) => state.baseScores[k]).sort((a, b) => a - b)
          const target = [...STANDARD_ARRAY].sort((a, b) => a - b)
          return sorted.every((v, i) => v === target[i])
        }
        if (state.method === "point-buy") {
          return pointBuyRemaining(state.baseScores, POINT_BUY_COSTS, POINT_BUY_TOTAL) >= 0
        }
        // Manual: all scores must be 3-20
        return ABILITY_KEYS.every((k) => state.baseScores[k] >= 3 && state.baseScores[k] <= 20)
      }
      case 3:
        // Name is required
        return state.name.trim().length > 0
      case 4:
        return true
      default:
        return false
    }
  }, [state])

  const goNext = useCallback(() => {
    if (state.step < 4 && canAdvance) {
      setState((prev) => ({ ...prev, step: prev.step + 1 }))
    }
  }, [state.step, canAdvance])

  const goBack = useCallback(() => {
    if (state.step > 0) {
      setState((prev) => ({ ...prev, step: prev.step - 1 }))
    }
  }, [state.step])

  const handleCreate = useCallback(() => {
    if (!state.race || !state.class) return

    const racialBonuses = computeRacialBonuses(state.race, state.subrace)
    const finalScores = applyBonuses(state.baseScores, racialBonuses)
    const saves = classSavingThrows(state.class)
    const profs = classBaseProficiencies(state.class)
    const bg = BACKGROUNDS.find((b) => b.index === state.background)

    const allSkills = new Set(state.selectedSkills)
    if (bg) {
      for (const s of bg.skillProficiencies) {
        allSkills.add(s)
      }
    }

    const racialTraits = state.race.traits.map((t) => t.name)
    if (state.subrace) {
      for (const t of state.subrace.racial_traits) {
        racialTraits.push(t.name)
      }
    }

    const languages = state.race.languages.map((l) => l.name)

    const character: PlayerCharacter = {
      id: crypto.randomUUID(),
      playerId: "",
      name: state.name.trim(),
      race: state.race.index,
      raceName: state.race.name,
      subrace: state.subrace?.index,
      subraceName: state.subrace?.name,
      class: state.class.index,
      className: state.class.name,
      level: 1,
      background: state.background,
      backgroundName: bg?.name ?? "",
      alignment: state.alignment,
      baseAbilityScores: { ...state.baseScores },
      racialBonuses,
      abilityScores: finalScores,
      hp: hpAtLevel1(state.class.hit_die, finalScores.con),
      maxHp: hpAtLevel1(state.class.hit_die, finalScores.con),
      ac: unarmoredAC(finalScores.dex),
      speed: state.race.speed,
      proficiencyBonus: proficiencyBonus(1),
      hitDie: state.class.hit_die,
      savingThrows: saves,
      skillProficiencies: Array.from(allSkills),
      armorProficiencies: profs.armor,
      weaponProficiencies: profs.weapons,
      toolProficiencies: [...profs.tools, ...(bg?.toolProficiencies ?? [])],
      languages,
      racialTraits,
      classFeatures: [],
      spellcastingAbility: state.class.spellcasting?.spellcasting_ability.name,
      notes: state.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    onComplete(character)
  }, [state, onComplete])

  if (loading) {
    return <LoadingScreen message="Gathering ancient knowledge" />
  }

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-bg-deep flex items-center justify-center z-50">
        <div className="text-center space-y-4 px-6">
          <h2 className="font-[family-name:var(--font-display)] text-gold text-xl">
            Something Went Wrong
          </h2>
          <p className="text-text-muted text-sm max-w-xs">{error}</p>
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 cursor-pointer transition-colors text-sm font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-bg-deep z-50 flex flex-col overflow-hidden">
      {/* Top bar with progress */}
      <header className="bg-bg-base/90 backdrop-blur-sm border-b border-gold/15 px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                <span className="text-gold text-sm">
                  {state.step + 1}
                </span>
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-display)] text-gold text-lg tracking-wide">
                  {STEP_NAMES[state.step]}
                </h1>
                <p className="text-text-muted text-[10px] tracking-wider uppercase">
                  Step {state.step + 1} of {STEP_NAMES.length}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-text-muted hover:text-parchment text-sm transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-bg-surface/60"
            >
              Cancel
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-bg-elevated/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold/60 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((state.step + 1) / STEP_NAMES.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Step content */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_rgba(201,162,39,0.03)_0%,_transparent_70%)]">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {state.step === 0 && <RaceStep races={races} state={state} onChange={handleChange} />}
          {state.step === 1 && (
            <ClassStep classes={classes} skills={skills} state={state} onChange={handleChange} />
          )}
          {state.step === 2 && <AbilityScoreStep state={state} onChange={handleChange} />}
          {state.step === 3 && <DetailsStep state={state} onChange={handleChange} />}
          {state.step === 4 && <ReviewStep state={state} />}
        </div>
      </main>

      {/* Bottom navigation */}
      <footer className="bg-bg-base/90 backdrop-blur-sm border-t border-gold/15 px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={state.step === 0 ? onCancel : goBack}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-text-muted hover:text-parchment border border-bg-elevated/50 hover:bg-bg-surface/60 cursor-pointer transition-colors"
          >
            {state.step === 0 ? "Cancel" : "Back"}
          </button>

          {state.step < 4 ? (
            <button
              onClick={goNext}
              disabled={!canAdvance}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30 cursor-pointer transition-all duration-200 shadow-[0_0_12px_rgba(201,162,39,0.15)] hover:shadow-[0_0_20px_rgba(201,162,39,0.25)]"
            >
              Create Character
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}
