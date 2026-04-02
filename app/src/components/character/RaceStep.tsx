import { useState, useCallback, useMemo } from "react"
import type { SrdReference, SrdRace, WizardState } from "../../types/character"
import { SRD_ABILITY_MAP, ABILITY_LABELS } from "../../types/character"
import { fetchRace, fetchSubrace } from "../../services/srd"

interface RaceStepProps {
  races: SrdReference[]
  state: WizardState
  onChange: (updates: Partial<WizardState>) => void
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
        onChange({ race, subrace: undefined })
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
          return (
            <button
              key={ref.index}
              onClick={() => handleSelectRace(ref)}
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
          className="bg-bg-surface/60 border border-bg-elevated/50 rounded-xl p-5 space-y-4"
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
