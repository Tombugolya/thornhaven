import { useCallback, useMemo, useRef, useState } from "react"
import type { WizardState } from "../../types/character"
import { BACKGROUNDS, ALIGNMENTS, STARTING_GOLD } from "../../types/character"

const LEVEL_OPTIONS = Array.from({ length: 20 }, (_, i) => i + 1)
const MAX_PORTRAIT_BYTES = 2 * 1024 * 1024 // 2 MB
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

interface DetailsStepProps {
  state: WizardState
  onChange: (updates: Partial<WizardState>) => void
}

export default function DetailsStep({ state, onChange }: DetailsStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [portraitError, setPortraitError] = useState<string | null>(null)

  const handlePortraitSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setPortraitError("Please select a JPEG, PNG, or WebP image.")
        return
      }

      if (file.size > MAX_PORTRAIT_BYTES) {
        setPortraitError("Image must be under 2 MB.")
        return
      }

      setPortraitError(null)

      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange({ portraitDataUrl: reader.result })
        }
      }
      reader.readAsDataURL(file)
    },
    [onChange],
  )

  const handlePortraitRemove = useCallback(() => {
    onChange({ portraitDataUrl: undefined })
    setPortraitError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [onChange])

  const handleLevelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ level: Number(e.target.value) })
    },
    [onChange],
  )

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

  const handleEquipmentChoice = useCallback(
    (groupIndex: number, optionIndex: number) => {
      const updated = [...state.equipmentChoices]
      updated[groupIndex] = optionIndex
      onChange({ equipmentChoices: updated })
    },
    [onChange, state.equipmentChoices],
  )

  const handleGoldChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10)
      onChange({ startingGold: Number.isNaN(val) ? 0 : Math.max(0, val) })
    },
    [onChange],
  )

  const selectedBackground = useMemo(
    () => BACKGROUNDS.find((b) => b.index === state.background),
    [state.background],
  )

  const startingGoldFormula = useMemo(() => {
    if (!state.class) return null
    return STARTING_GOLD[state.class.index] ?? null
  }, [state.class])

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
        {/* Starting level */}
        <div className="space-y-2">
          <label className="block text-parchment text-xs uppercase tracking-wider font-[family-name:var(--font-display)]">
            Starting Level
          </label>
          <select
            value={state.level}
            onChange={handleLevelChange}
            className="w-full bg-bg-surface border border-gold/30 rounded-lg px-4 py-2.5 text-parchment focus:outline-none focus:border-gold cursor-pointer"
          >
            {LEVEL_OPTIONS.map((lvl) => (
              <option key={lvl} value={lvl}>
                Level {lvl}
              </option>
            ))}
          </select>
        </div>

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

        {/* Portrait upload */}
        <div className="space-y-2">
          <label className="block text-parchment text-xs uppercase tracking-wider font-[family-name:var(--font-display)]">
            Portrait <span className="text-text-muted font-normal normal-case">(optional)</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePortraitSelect}
            className="hidden"
          />
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative w-[128px] h-[128px] rounded-full border-2 border-dashed border-gold/30 hover:border-gold/60 bg-bg-surface/40 hover:bg-bg-surface/60 transition-all cursor-pointer overflow-hidden flex items-center justify-center shrink-0 hover:shadow-[0_0_20px_rgba(201,162,39,0.08)]"
            >
              {state.portraitDataUrl ? (
                <img
                  src={state.portraitDataUrl}
                  alt="Portrait preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-gold/40 group-hover:text-gold/70 transition-colors">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  <span className="text-[10px] uppercase tracking-wider">Upload</span>
                </div>
              )}
              {state.portraitDataUrl && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-parchment text-xs font-medium">Change</span>
                </div>
              )}
            </button>
            <div className="flex flex-col gap-2">
              <p className="text-text-muted text-xs leading-relaxed">
                JPEG, PNG, or WebP. Max 2 MB.
              </p>
              {state.portraitDataUrl && (
                <button
                  type="button"
                  onClick={handlePortraitRemove}
                  className="text-danger text-xs hover:text-danger/80 transition-colors cursor-pointer text-left"
                >
                  Remove portrait
                </button>
              )}
            </div>
          </div>
          {portraitError && <p className="text-danger text-xs mt-1">{portraitError}</p>}
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

        {/* Equipment */}
        {state.class && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* Backpack icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gold/70"
              >
                <path d="M4 10h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" />
                <path d="M8 10V6a4 4 0 0 1 8 0v4" />
                <path d="M10 14h4" />
              </svg>
              <label className="text-parchment text-xs uppercase tracking-wider font-[family-name:var(--font-display)]">
                Starting Equipment
              </label>
            </div>

            {/* Fixed starting equipment */}
            {state.class.starting_equipment.length > 0 && (
              <div>
                <h4 className="text-text-muted text-[10px] uppercase tracking-wider mb-2">
                  Guaranteed Items
                </h4>
                <div className="flex flex-wrap gap-2">
                  {state.class.starting_equipment.map((item) => (
                    <span
                      key={item.equipment.index}
                      className="px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium"
                    >
                      {item.quantity > 1 ? `${item.quantity}x ` : ""}
                      {item.equipment.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment choices */}
            {state.class.starting_equipment_options.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-text-muted text-[10px] uppercase tracking-wider">
                  Equipment Choices
                </h4>
                {state.class.starting_equipment_options.map((choice, groupIndex) => (
                  <div key={groupIndex} className="space-y-2">
                    <p className="text-text-muted text-[10px] uppercase tracking-wider">
                      Choose one
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {choice.from.options.map((option, optionIndex) => {
                        let label: string
                        if (option.option_type === "counted_reference") {
                          label = `${option.count ?? 1}x ${option.of?.name ?? "Unknown"}`
                        } else if (option.option_type === "multiple" && option.items) {
                          label = option.items
                            .map((sub) => {
                              if (sub.option_type === "counted_reference") {
                                return `${sub.count ?? 1}x ${sub.of?.name ?? "item"}`
                              }
                              if (sub.item) return sub.item.name
                              if (sub.choice) return sub.choice.desc
                              return "item"
                            })
                            .join(" + ")
                        } else if (option.option_type === "choice" && option.choice) {
                          label = option.choice.desc
                        } else {
                          label = option.item?.name ?? choice.desc.split(" or ")[optionIndex] ?? `Option ${optionIndex + 1}`
                        }
                        const isSelected = state.equipmentChoices[groupIndex] === optionIndex
                        return (
                          <button
                            key={optionIndex}
                            type="button"
                            onClick={() => handleEquipmentChoice(groupIndex, optionIndex)}
                            className={`p-3 rounded-xl text-left text-xs transition-all duration-200 cursor-pointer border ${
                              isSelected
                                ? "border-gold/50 bg-gold/10 text-gold shadow-[0_0_10px_rgba(201,162,39,0.1)]"
                                : "border-bg-elevated/50 bg-bg-surface/40 text-parchment-dim hover:border-gold/20 hover:bg-bg-surface/60"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full border-2 shrink-0 transition-colors ${
                                  isSelected ? "border-gold bg-gold" : "border-text-muted/40"
                                }`}
                              />
                              <span className="font-medium">{label}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Starting gold */}
            <div className="p-3 rounded-xl bg-bg-surface/60 border border-bg-elevated/50 space-y-2">
              <div className="flex items-center gap-2">
                {/* Coin icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gold"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v12M8 10h8M8 14h8" />
                </svg>
                <span className="text-parchment text-xs font-medium">Starting Gold</span>
                {startingGoldFormula && (
                  <span className="text-text-muted text-[10px]">
                    (roll: {startingGoldFormula})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  value={state.startingGold || ""}
                  onChange={handleGoldChange}
                  placeholder="0"
                  className="w-28 bg-bg-surface border border-gold/30 rounded-lg px-3 py-1.5 text-gold text-sm font-mono focus:outline-none focus:border-gold placeholder:text-text-muted/30"
                />
                <span className="text-text-muted text-xs">gp</span>
              </div>
            </div>
          </div>
        )}

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
