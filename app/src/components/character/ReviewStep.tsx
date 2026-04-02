import { useMemo } from "react"
import type { WizardState } from "../../types/character"
import { ABILITY_KEYS, BACKGROUNDS } from "../../types/character"
import {
  computeRacialBonuses,
  applyBonuses,
  formatModifier,
  abilityModifier,
  hpAtLevel1,
  unarmoredAC,
  proficiencyBonus,
  classSavingThrows,
  classBaseProficiencies,
} from "../../services/calculations"

interface ReviewStepProps {
  state: WizardState
}

export default function ReviewStep({ state }: ReviewStepProps) {
  const race = state.race
  const cls = state.class
  const subrace = state.subrace

  const racialBonuses = useMemo(() => {
    if (!race) return {}
    return computeRacialBonuses(race, subrace)
  }, [race, subrace])

  const finalScores = useMemo(
    () => applyBonuses(state.baseScores, racialBonuses),
    [state.baseScores, racialBonuses],
  )

  const derivedStats = useMemo(() => {
    if (!cls) return null
    return {
      hp: hpAtLevel1(cls.hit_die, finalScores.con),
      ac: unarmoredAC(finalScores.dex),
      profBonus: proficiencyBonus(1),
      speed: race?.speed ?? 30,
    }
  }, [cls, finalScores, race])

  const savingThrows = useMemo(() => {
    if (!cls) return []
    return classSavingThrows(cls)
  }, [cls])

  const profs = useMemo(() => {
    if (!cls) return { armor: [], weapons: [], tools: [] }
    return classBaseProficiencies(cls)
  }, [cls])

  const background = useMemo(
    () => BACKGROUNDS.find((b) => b.index === state.background),
    [state.background],
  )

  const allSkills = useMemo(() => {
    const skills = new Set(state.selectedSkills)
    if (background) {
      for (const s of background.skillProficiencies) {
        skills.add(s)
      }
    }
    return Array.from(skills).sort()
  }, [state.selectedSkills, background])

  const languages = useMemo(() => {
    if (!race) return []
    const langs = race.languages.map((l) => l.name)
    if (subrace?.language_options) {
      langs.push(`+${subrace.language_options.choose} choice`)
    }
    return langs
  }, [race, subrace])

  const racialTraits = useMemo(() => {
    const traits = race?.traits.map((t) => t.name) ?? []
    if (subrace) {
      for (const t of subrace.racial_traits) {
        traits.push(t.name)
      }
    }
    return traits
  }, [race, subrace])

  if (!race || !cls || !derivedStats) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">
          Missing race or class selection. Please go back and complete previous steps.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-gold text-xl mb-1">
          Character Review
        </h2>
        <p className="text-text-muted text-sm">
          Review your character before bringing them to life.
        </p>
      </div>

      {/* Character sheet card */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(201,162,39,0.04) 0%, rgba(20,16,12,0.8) 100%)",
          animation: "loadFadeIn 0.4s ease-out",
        }}
      >
        {/* Decorative gold border */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: "2px solid rgba(201,162,39,0.2)",
            boxShadow: "inset 0 0 30px rgba(201,162,39,0.03), 0 0 20px rgba(201,162,39,0.05)",
          }}
        />

        {/* Corner ornaments */}
        <svg
          className="absolute top-0 left-0 w-8 h-8 text-gold/30 pointer-events-none"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 2h10M2 2v10M2 2l8 8" />
        </svg>
        <svg
          className="absolute top-0 right-0 w-8 h-8 text-gold/30 pointer-events-none"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M30 2H20M30 2v10M30 2l-8 8" />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-8 h-8 text-gold/30 pointer-events-none"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M2 30h10M2 30V20M2 30l8-8" />
        </svg>
        <svg
          className="absolute bottom-0 right-0 w-8 h-8 text-gold/30 pointer-events-none"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M30 30H20M30 30V20M30 30l-8-8" />
        </svg>

        {/* Animated shimmer across top */}
        <div
          className="absolute top-0 left-0 right-0 h-24 pointer-events-none overflow-hidden"
          style={{ opacity: 0.4 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(201,162,39,0.08) 45%, rgba(201,162,39,0.15) 50%, rgba(201,162,39,0.08) 55%, transparent 60%)",
              animation: "reviewShimmer 4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Header */}
        <div className="relative px-6 py-6 border-b border-gold/15">
          <div className="flex items-baseline justify-between">
            <div>
              <h3
                className="font-[family-name:var(--font-display)] text-gold text-3xl tracking-wide"
                style={{ textShadow: "0 0 20px rgba(201,162,39,0.2), 0 2px 4px rgba(0,0,0,0.3)" }}
              >
                {state.name || "Unnamed Hero"}
              </h3>
              <p className="text-parchment text-sm mt-1">
                {race.name}
                {subrace ? ` (${subrace.name})` : ""} {cls.name}
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium font-[family-name:var(--font-display)] tracking-wider">
                Level 1
              </span>
            </div>
          </div>
          {(state.alignment || background) && (
            <p className="text-text-muted text-xs mt-2 italic">
              {[state.alignment, background?.name].filter(Boolean).join(" \u2022 ")}
            </p>
          )}
        </div>

        {/* Derived stats row */}
        <div className="grid grid-cols-4 border-b border-gold/15">
          {[
            { label: "Hit Points", value: derivedStats.hp },
            { label: "Armor Class", value: derivedStats.ac },
            { label: "Speed", value: `${derivedStats.speed} ft` },
            { label: "Prof. Bonus", value: `+${derivedStats.profBonus}` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center py-4 border-r border-gold/10 last:border-r-0"
            >
              <div className="text-gold text-xl font-bold font-mono">{stat.value}</div>
              <div className="text-text-muted text-[10px] uppercase tracking-wider mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Ability scores - shield badges in 2x3 grid */}
        <div className="relative px-6 py-5 border-b border-gold/15">
          <h4 className="text-parchment text-xs uppercase tracking-wider mb-4 font-[family-name:var(--font-display)]">
            Ability Scores
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {ABILITY_KEYS.map((key) => {
              const score = finalScores[key]
              return (
                <div key={key} className="flex flex-col items-center">
                  <div className="relative w-16 h-20 flex flex-col items-center justify-center">
                    {/* Shield shape */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 80" fill="none">
                      <path
                        d="M32 2L4 14v24c0 16 12 26 28 38 16-12 28-22 28-38V14L32 2z"
                        fill="rgba(201,162,39,0.06)"
                        stroke="rgba(201,162,39,0.25)"
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span className="relative text-parchment text-xl font-bold font-mono mt-1">
                      {score}
                    </span>
                    <span className="relative text-gold text-[11px] font-medium">
                      {formatModifier(score)}
                    </span>
                  </div>
                  <span className="text-text-muted text-[10px] uppercase tracking-wider mt-1 font-[family-name:var(--font-display)]">
                    {key}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Saving throws */}
        <div className="px-6 py-4 border-b border-gold/15">
          <h4 className="text-parchment text-xs uppercase tracking-wider mb-3">Saving Throws</h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {ABILITY_KEYS.map((key) => {
              const isProficient = savingThrows.includes(key)
              const mod =
                abilityModifier(finalScores[key]) + (isProficient ? derivedStats.profBonus : 0)
              return (
                <div
                  key={key}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs ${
                    isProficient
                      ? "bg-gold/10 border border-gold/20 text-gold"
                      : "bg-bg-elevated/20 border border-bg-elevated/30 text-text-muted"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      isProficient ? "bg-gold" : "border border-text-muted/40"
                    }`}
                  />
                  <span className="uppercase">{key}</span>
                  <span className="ml-auto font-mono font-bold">{mod >= 0 ? `+${mod}` : mod}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Skills */}
        {allSkills.length > 0 && (
          <div className="px-6 py-4 border-b border-gold/15">
            <h4 className="text-parchment text-xs uppercase tracking-wider mb-3">
              Skill Proficiencies
            </h4>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill) => {
                const isFromBackground = background?.skillProficiencies.includes(skill)
                return (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium capitalize"
                  >
                    <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                    {skill.replace("-", " ")}
                    {isFromBackground && <span className="text-text-muted font-normal">(bg)</span>}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Proficiencies (armor, weapons, tools) */}
        <div className="px-6 py-4 border-b border-gold/15">
          <h4 className="text-parchment text-xs uppercase tracking-wider mb-3">Proficiencies</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {profs.armor.length > 0 && (
              <div>
                <span className="text-text-muted text-[10px] uppercase tracking-wider">Armor</span>
                <ul className="mt-1 space-y-0.5">
                  {profs.armor.map((a) => (
                    <li key={a} className="text-parchment text-xs">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {profs.weapons.length > 0 && (
              <div>
                <span className="text-text-muted text-[10px] uppercase tracking-wider">
                  Weapons
                </span>
                <ul className="mt-1 space-y-0.5">
                  {profs.weapons.map((w) => (
                    <li key={w} className="text-parchment text-xs">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {[...profs.tools, ...(background?.toolProficiencies ?? [])].length > 0 && (
              <div>
                <span className="text-text-muted text-[10px] uppercase tracking-wider">Tools</span>
                <ul className="mt-1 space-y-0.5">
                  {[...profs.tools, ...(background?.toolProficiencies ?? [])].map((t) => (
                    <li key={t} className="text-parchment text-xs capitalize">
                      {t.replace("-", " ")}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Racial traits & Class features */}
        <div className="px-6 py-4 border-b border-gold/15">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {racialTraits.length > 0 && (
              <div>
                <h4 className="text-parchment text-xs uppercase tracking-wider mb-2">
                  Racial Traits
                </h4>
                <div className="space-y-1">
                  {racialTraits.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-parchment text-xs">
                      <span className="w-1 h-1 rounded-full bg-gold/60 shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {cls.subclasses.length > 0 && (
              <div>
                <h4 className="text-parchment text-xs uppercase tracking-wider mb-2">
                  Class Features
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-parchment text-xs">
                    <span className="w-1 h-1 rounded-full bg-gold/60 shrink-0" />d{cls.hit_die} Hit
                    Die
                  </div>
                  {cls.spellcasting && (
                    <div className="flex items-center gap-2 text-parchment text-xs">
                      <span className="w-1 h-1 rounded-full bg-gold/60 shrink-0" />
                      Spellcasting ({cls.spellcasting.spellcasting_ability.name})
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        {languages.length > 0 && (
          <div className="px-6 py-4 border-b border-gold/15">
            <h4 className="text-parchment text-xs uppercase tracking-wider mb-2">Languages</h4>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <span
                  key={lang}
                  className="px-2.5 py-1 rounded-lg bg-bg-elevated/30 border border-bg-elevated/40 text-parchment text-xs"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {state.notes && (
          <div className="px-6 py-4">
            <h4 className="text-parchment text-xs uppercase tracking-wider mb-2">Notes</h4>
            <p className="text-parchment text-sm italic leading-relaxed whitespace-pre-wrap">
              {state.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
