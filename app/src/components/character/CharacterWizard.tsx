import { useState, useEffect, useCallback, useMemo } from "react"
import type { WizardState, PlayerCharacter, SrdReference, SrdSkill } from "../../types/character"
import { INITIAL_WIZARD_STATE, ABILITY_KEYS, BACKGROUNDS } from "../../types/character"
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
} from "../../services/calculations"
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

// Pre-computed ember particle data (avoids Math.random in render)
const WIZARD_EMBERS = Array.from({ length: 8 }, () => ({
  width: 2 + Math.random() * 3,
  height: 2 + Math.random() * 3,
  left: `${20 + Math.random() * 60}%`,
  bottom: `${10 + Math.random() * 40}%`,
  duration: `${2 + Math.random() * 3}s`,
  delay: `${Math.random() * 3}s`,
}))

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
      case 2:
        // Ability scores: all must be non-zero
        return ABILITY_KEYS.every((k) => state.baseScores[k] > 0)
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

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-bg-deep flex items-center justify-center overflow-hidden z-50">
        {WIZARD_EMBERS.map((ember, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: ember.width,
              height: ember.height,
              left: ember.left,
              bottom: ember.bottom,
              background: "radial-gradient(circle, #c9a227, #8a6e1a00)",
              animation: `loadEmber ${ember.duration} ease-out infinite`,
              animationDelay: ember.delay,
            }}
          />
        ))}
        <div
          className="relative flex flex-col items-center gap-8"
          style={{ animation: "loadFadeIn 0.6s ease-out" }}
        >
          {/* Rune circle */}
          <div className="relative w-24 h-24">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              style={{ animation: "runeRotate 12s linear infinite" }}
            >
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#c9a227"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="#c9a227"
                strokeWidth="1"
                opacity="0.6"
                strokeDasharray="8 12 4 16 6 14"
              />
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <text
                  key={angle}
                  x={50 + 46 * Math.cos(((angle - 90) * Math.PI) / 180)}
                  y={50 + 46 * Math.sin(((angle - 90) * Math.PI) / 180)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#c9a227"
                  fontSize="6"
                  opacity="0.7"
                  style={{ fontFamily: "serif" }}
                >
                  {["\u16A0", "\u16B1", "\u16C1", "\u16D2", "\u16A8", "\u16B9"][angle / 60]}
                </text>
              ))}
            </svg>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              style={{ animation: "runeRotateReverse 8s linear infinite" }}
            >
              <circle
                cx="50"
                cy="50"
                r="32"
                fill="none"
                stroke="#c9a227"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <circle
                cx="50"
                cy="50"
                r="32"
                fill="none"
                stroke="#c9a227"
                strokeWidth="0.8"
                opacity="0.5"
                strokeDasharray="4 8 6 10"
              />
            </svg>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              style={{ animation: "runePulse 3s ease-in-out infinite" }}
            >
              <polygon
                points="50,30 62,50 50,70 38,50"
                fill="none"
                stroke="#c9a227"
                strokeWidth="1"
              />
              <circle cx="50" cy="50" r="2" fill="#c9a227" opacity="0.8" />
            </svg>
          </div>
          <div className="text-center space-y-2">
            <h2 className="font-[family-name:var(--font-display)] text-gold text-lg tracking-widest uppercase">
              Preparing the Forge
            </h2>
            <div className="flex items-center justify-center gap-1.5">
              {["Gathering", "ancient", "knowledge"].map((word, i) => (
                <span
                  key={i}
                  className="text-text-muted text-xs tracking-wider"
                  style={{ animation: `loadFadeIn 0.4s ease-out ${0.3 + i * 0.1}s both` }}
                >
                  {word}
                </span>
              ))}
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block w-1 h-1 rounded-full bg-gold"
                  style={{ animation: `loadingDot 1.4s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
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
      <header className="bg-bg-base border-b border-gold/15 px-6 py-4 shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-[family-name:var(--font-display)] text-gold text-lg tracking-wide">
              Create Character
            </h1>
            <button
              onClick={onCancel}
              className="text-text-muted hover:text-parchment text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1">
            {STEP_NAMES.map((name, i) => {
              const isComplete = i < state.step
              const isCurrent = i === state.step
              return (
                <div key={name} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        isCurrent
                          ? "bg-gold shadow-[0_0_8px_rgba(201,162,39,0.4)]"
                          : isComplete
                            ? "bg-gold/60"
                            : "bg-bg-elevated/60 border border-bg-elevated"
                      }`}
                    />
                    <span
                      className={`text-[10px] mt-1 tracking-wider ${
                        isCurrent ? "text-gold" : isComplete ? "text-gold/50" : "text-text-muted/50"
                      }`}
                    >
                      {name}
                    </span>
                  </div>
                  {i < STEP_NAMES.length - 1 && (
                    <div
                      className={`h-px flex-1 mx-1 -mt-3 ${
                        i < state.step ? "bg-gold/40" : "bg-bg-elevated/40"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </header>

      {/* Step content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6">
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
      <footer className="bg-bg-base border-t border-gold/15 px-6 py-4 shrink-0">
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
