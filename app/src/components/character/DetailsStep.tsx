import { useCallback, useMemo } from "react"
import type { WizardState } from "../../types/character"
import { BACKGROUNDS, ALIGNMENTS } from "../../types/character"

interface DetailsStepProps {
  state: WizardState
  onChange: (updates: Partial<WizardState>) => void
}

export default function DetailsStep({ state, onChange }: DetailsStepProps) {
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ name: e.target.value.slice(0, 30) })
    },
    [onChange],
  )

  const handleBackgroundChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ background: e.target.value })
    },
    [onChange],
  )

  const handleAlignmentChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ alignment: e.target.value })
    },
    [onChange],
  )

  const handleNotesChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange({ notes: e.target.value })
    },
    [onChange],
  )

  const selectedBackground = useMemo(
    () => BACKGROUNDS.find((b) => b.index === state.background),
    [state.background],
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-gold text-xl mb-1">
          Character Details
        </h2>
        <p className="text-text-muted text-sm">
          Name your character and choose a background that shapes their story.
        </p>
      </div>

      {/* Parchment-style form area */}
      <div
        className="rounded-xl border border-gold/10 p-6 space-y-6"
        style={{
          background:
            "linear-gradient(145deg, rgba(184,164,120,0.05) 0%, rgba(26,26,46,0.6) 30%, rgba(160,140,100,0.04) 60%, rgba(26,26,46,0.6) 100%)",
        }}
      >
        {/* Character name */}
        <div className="space-y-2">
          <label className="block text-parchment text-xs uppercase tracking-wider font-[family-name:var(--font-display)]">
            Character Name <span className="text-gold">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2l4 4-10 10H4v-4L14 2z" />
                <path d="M12 4l4 4" />
                <path d="M4 16l2-2" />
              </svg>
            </div>
            <input
              type="text"
              value={state.name}
              onChange={handleNameChange}
              maxLength={30}
              placeholder="Enter a name for your character"
              className="w-full bg-bg-surface border border-gold/30 rounded-xl pl-12 pr-4 py-4 text-parchment text-xl font-[family-name:var(--font-display)] tracking-wide focus:outline-none focus:border-gold focus:shadow-[0_0_12px_rgba(201,162,39,0.1)] transition-shadow placeholder:text-text-muted/30 placeholder:text-base placeholder:font-sans placeholder:tracking-normal"
            />
          </div>
          <p className="text-text-muted text-xs text-right">{state.name.length} / 30</p>
        </div>

        {/* Background */}
        <div className="space-y-2">
          <label className="block text-parchment text-xs uppercase tracking-wider">
            Background
          </label>
          <select
            value={state.background}
            onChange={handleBackgroundChange}
            className="w-full bg-bg-surface border border-gold/30 rounded-lg px-4 py-2.5 text-parchment focus:outline-none focus:border-gold cursor-pointer"
          >
            <option value="">Select a background</option>
            {BACKGROUNDS.map((bg) => (
              <option key={bg.index} value={bg.index}>
                {bg.name}
              </option>
            ))}
          </select>

          {/* Background detail */}
          {selectedBackground && (
            <div
              className="mt-3 p-4 rounded-xl bg-bg-surface/60 border border-bg-elevated/50 space-y-3"
              style={{ animation: "loadFadeIn 0.3s ease-out" }}
            >
              <p className="text-parchment text-sm italic">{selectedBackground.description}</p>
              <div>
                <h4 className="text-parchment text-xs uppercase tracking-wider mb-1">
                  Skill Proficiencies
                </h4>
                <div className="flex gap-2">
                  {selectedBackground.skillProficiencies.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium capitalize"
                    >
                      {skill.replace("-", " ")}
                    </span>
                  ))}
                </div>
              </div>
              {selectedBackground.toolProficiencies.length > 0 && (
                <div>
                  <h4 className="text-parchment text-xs uppercase tracking-wider mb-1">
                    Tool Proficiencies
                  </h4>
                  <div className="flex gap-2">
                    {selectedBackground.toolProficiencies.map((tool) => (
                      <span
                        key={tool}
                        className="px-2.5 py-1 rounded-lg bg-bg-elevated/40 border border-bg-elevated/50 text-parchment text-xs capitalize"
                      >
                        {tool.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedBackground.languages > 0 && (
                <p className="text-text-muted text-xs">
                  Additional Languages: {selectedBackground.languages}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Alignment */}
        <div className="space-y-2">
          <label className="block text-parchment text-xs uppercase tracking-wider">Alignment</label>
          <select
            value={state.alignment}
            onChange={handleAlignmentChange}
            className="w-full bg-bg-surface border border-gold/30 rounded-lg px-4 py-2.5 text-parchment focus:outline-none focus:border-gold cursor-pointer"
          >
            <option value="">Select alignment</option>
            {ALIGNMENTS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="block text-parchment text-xs uppercase tracking-wider">
            Notes <span className="text-text-muted font-normal normal-case">(optional)</span>
          </label>
          <textarea
            value={state.notes}
            onChange={handleNotesChange}
            rows={4}
            placeholder="Backstory, appearance, personality traits..."
            className="w-full bg-bg-surface border border-gold/30 rounded-lg px-4 py-2.5 text-parchment focus:outline-none focus:border-gold placeholder:text-text-muted/50 resize-none"
          />
        </div>
      </div>
      {/* end parchment wrapper */}
    </div>
  )
}
