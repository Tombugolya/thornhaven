import { useState, useCallback, useMemo } from "react"
import type { SrdReference, SrdRace, WizardState } from "../../types/character"
import { SRD_ABILITY_MAP, ABILITY_LABELS } from "../../types/character"
import { fetchRace, fetchSubrace } from "../../services/srd"

interface RaceStepProps {
  races: SrdReference[]
  state: WizardState
  onChange: (updates: Partial<WizardState>) => void
}

const raceIcons: Record<string, React.ReactElement> = {
  dwarf: (
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
      <path d="M16 4v12M12 16l4 4 4-4" />
      <path d="M8 28h16l-2-8H10l-2 8z" />
      <path d="M10 20h12" />
    </svg>
  ),
  elf: (
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
      <path d="M16 6c-4 2-7 8-6 14 1-3 3-5 6-6 3 1 5 3 6 6 1-6-2-12-6-14z" />
      <path d="M16 14v8M13 18l3-4 3 4" />
    </svg>
  ),
  human: (
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
      <path d="M16 4l3 6h-6l3-6z" fill="currentColor" opacity="0.3" />
      <path d="M8 28l4-14h8l4 14" />
      <path d="M10 22h12" />
      <circle cx="16" cy="8" r="2" />
    </svg>
  ),
  halfling: (
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
      <path d="M11 18c-2 2-2 5 0 7s5 2 7 0" />
      <path d="M21 18c2 2 2 5 0 7s-5 2-7 0" />
      <path d="M14 14c-1 1-1 3 0 4s3 1 4 0 1-3 0-4-3-1-4 0z" />
      <circle cx="16" cy="10" r="3" />
    </svg>
  ),
  dragonborn: (
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
      <path d="M16 4l-4 6 2 2 2-3 2 3 2-2-4-6z" />
      <path d="M10 12c-1 3 0 7 2 10h8c2-3 3-7 2-10" />
      <path d="M12 16h8M13 20h6" />
      <path d="M8 10l4 2M24 10l-4 2" />
    </svg>
  ),
  gnome: (
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
      <polygon points="16,6 20,12 20,18 16,22 12,18 12,12" />
      <circle cx="16" cy="14" r="3" />
      <path d="M13 24l3 4 3-4" />
    </svg>
  ),
  "half-elf": (
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
      <path d="M16 6c-3 2-5 6-4 10 1-2 2-4 4-4" />
      <path d="M16 6l2 4h-4l2-4z" fill="currentColor" opacity="0.3" />
      <circle cx="16" cy="16" r="4" />
      <path d="M12 24h8" />
      <path d="M14 20v4M18 20v4" />
    </svg>
  ),
  "half-orc": (
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
      <circle cx="16" cy="14" r="7" />
      <path d="M12 18l-1 3h2M20 18l1 3h-2" />
      <path d="M13 12h2M17 12h2" />
      <path d="M14 16l2 2 2-2" />
      <path d="M12 24h8" />
    </svg>
  ),
  tiefling: (
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
      <path d="M10 12c-2-4-1-8 2-10M22 12c2-4 1-8-2-10" />
      <circle cx="16" cy="16" r="6" />
      <path d="M14 15h1M17 15h1" />
      <path d="M16 22c-1 3-2 5-1 8M16 22c1 3 2 5 1 8" />
    </svg>
  ),
}

const raceGradients: Record<string, string> = {
  dwarf: "from-amber-900/20 via-bg-surface/60 to-bg-surface/60",
  elf: "from-emerald-900/20 via-bg-surface/60 to-bg-surface/60",
  human: "from-slate-700/20 via-bg-surface/60 to-bg-surface/60",
  halfling: "from-green-900/20 via-bg-surface/60 to-bg-surface/60",
  dragonborn: "from-red-900/20 via-bg-surface/60 to-bg-surface/60",
  gnome: "from-violet-900/20 via-bg-surface/60 to-bg-surface/60",
  "half-elf": "from-teal-900/20 via-bg-surface/60 to-bg-surface/60",
  "half-orc": "from-stone-700/20 via-bg-surface/60 to-bg-surface/60",
  tiefling: "from-rose-900/20 via-bg-surface/60 to-bg-surface/60",
}

function summarizeBonuses(race: SrdRace): string {
  return race.ability_bonuses
    .map((b) => {
      const key = SRD_ABILITY_MAP[b.ability_score.index]
      const label = key ? ABILITY_LABELS[key] : b.ability_score.name
      return `+${b.bonus} ${label.slice(0, 3).toUpperCase()}`
    })
    .join(", ")
}

export default function RaceStep({ races, state, onChange }: RaceStepProps) {
  const [loadingRace, setLoadingRace] = useState<string | null>(null)
  const [loadingSubrace, setLoadingSubrace] = useState<string | null>(null)

  const selectedIndex = state.race?.index ?? null

  const handleSelectRace = useCallback(
    async (ref: SrdReference) => {
      if (ref.index === selectedIndex) return
      setLoadingRace(ref.index)
      try {
        const race = await fetchRace(ref.index)
        // Auto-select subrace if there's only one
        if (race.subraces.length === 1) {
          const subrace = await fetchSubrace(race.subraces[0].index)
          onChange({ race, subrace })
        } else {
          onChange({ race, subrace: undefined })
        }
      } finally {
        setLoadingRace(null)
      }
    },
    [selectedIndex, onChange],
  )

  const handleSelectSubrace = useCallback(
    async (ref: SrdReference) => {
      if (ref.index === state.subrace?.index) return
      setLoadingSubrace(ref.index)
      try {
        const subrace = await fetchSubrace(ref.index)
        onChange({ subrace })
      } finally {
        setLoadingSubrace(null)
      }
    },
    [state.subrace?.index, onChange],
  )

  const raceDetail = state.race

  const allBonuses = useMemo(() => {
    if (!raceDetail) return []
    const bonuses = raceDetail.ability_bonuses.map((b) => ({
      label: ABILITY_LABELS[SRD_ABILITY_MAP[b.ability_score.index]] ?? b.ability_score.name,
      bonus: b.bonus,
      source: raceDetail.name,
    }))
    if (state.subrace) {
      for (const b of state.subrace.ability_bonuses) {
        bonuses.push({
          label: ABILITY_LABELS[SRD_ABILITY_MAP[b.ability_score.index]] ?? b.ability_score.name,
          bonus: b.bonus,
          source: state.subrace.name,
        })
      }
    }
    return bonuses
  }, [raceDetail, state.subrace])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-gold text-xl mb-1">
          Choose Your Race
        </h2>
        <p className="text-text-muted text-sm">
          Your race determines innate abilities, speed, and heritage.
        </p>
      </div>

      {/* Race grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {races.map((ref) => {
          const isSelected = selectedIndex === ref.index
          const isLoading = loadingRace === ref.index
          const icon = raceIcons[ref.index]
          return (
            <button
              key={ref.index}
              onClick={() => handleSelectRace(ref)}
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
              {isSelected && raceDetail && (
                <div className="mt-2 space-y-1">
                  <p className="text-text-muted text-xs">Speed {raceDetail.speed} ft</p>
                  <p className="text-gold/80 text-xs font-medium">{summarizeBonuses(raceDetail)}</p>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected race detail panel */}
      {raceDetail && (
        <div
          className={`bg-gradient-to-b ${raceGradients[raceDetail.index] ?? "from-bg-surface/60 to-bg-surface/60"} border border-gold/15 rounded-xl p-5 space-y-4`}
          style={{ animation: "loadFadeIn 0.3s ease-out" }}
        >
          <div className="flex items-baseline justify-between">
            <h3 className="font-[family-name:var(--font-display)] text-gold text-lg">
              {raceDetail.name}
            </h3>
            <span className="text-text-muted text-xs uppercase tracking-wider">
              {raceDetail.size}
            </span>
          </div>

          {/* Ability bonuses */}
          <div>
            <h4 className="text-parchment text-xs uppercase tracking-wider mb-2">
              Ability Bonuses
            </h4>
            <div className="flex flex-wrap gap-2">
              {allBonuses.map((b, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium"
                >
                  +{b.bonus} {b.label}
                  {state.subrace && <span className="text-text-muted ml-1">({b.source})</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Speed & Size */}
          <div className="flex gap-6">
            <div>
              <span className="text-text-muted text-xs uppercase tracking-wider">Speed</span>
              <p className="text-parchment text-sm">{raceDetail.speed} ft</p>
            </div>
            <div>
              <span className="text-text-muted text-xs uppercase tracking-wider">Size</span>
              <p className="text-parchment text-sm">{raceDetail.size}</p>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-parchment text-xs uppercase tracking-wider mb-1">Languages</h4>
            <p className="text-parchment text-sm">
              {raceDetail.languages.map((l) => l.name).join(", ")}
            </p>
          </div>

          {/* Traits */}
          {raceDetail.traits.length > 0 && (
            <div>
              <h4 className="text-parchment text-xs uppercase tracking-wider mb-1">
                Racial Traits
              </h4>
              <div className="flex flex-wrap gap-2">
                {raceDetail.traits.map((t) => (
                  <span
                    key={t.index}
                    className="px-2.5 py-1 rounded-lg bg-bg-elevated/40 border border-bg-elevated/50 text-parchment text-xs"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subraces */}
          {raceDetail.subraces.length > 0 && (
            <div>
              <h4 className="text-parchment text-xs uppercase tracking-wider mb-2">Subrace</h4>
              <div className="flex gap-2 flex-wrap">
                {raceDetail.subraces.map((sr) => {
                  const isSubSelected = state.subrace?.index === sr.index
                  const isSubLoading = loadingSubrace === sr.index
                  return (
                    <button
                      key={sr.index}
                      onClick={() => handleSelectSubrace(sr)}
                      disabled={isSubLoading}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isSubSelected
                          ? "bg-gold/15 text-gold border border-gold/30"
                          : "bg-bg-elevated/40 text-parchment border border-bg-elevated/50 hover:bg-bg-elevated/60 hover:text-gold"
                      }`}
                    >
                      {isSubLoading ? "Loading..." : sr.name}
                    </button>
                  )
                })}
              </div>

              {/* Subrace detail */}
              {state.subrace && (
                <div
                  className="mt-3 p-3 rounded-lg bg-bg-elevated/20 border border-bg-elevated/30 space-y-2"
                  style={{ animation: "loadFadeIn 0.3s ease-out" }}
                >
                  <p className="text-parchment text-sm">{state.subrace.desc}</p>
                  {state.subrace.racial_traits.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {state.subrace.racial_traits.map((t) => (
                        <span
                          key={t.index}
                          className="px-2 py-0.5 rounded bg-gold/10 border border-gold/15 text-gold text-xs"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
