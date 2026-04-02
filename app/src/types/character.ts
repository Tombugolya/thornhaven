// --- SRD API Response Types ---

export interface SrdReference {
  index: string
  name: string
  url: string
}

export interface SrdAbilityBonus {
  ability_score: SrdReference
  bonus: number
}

export interface SrdProficiencyChoice {
  desc: string
  choose: number
  type: string
  from: {
    option_set_type: string
    options: SrdOption[]
  }
}

export interface SrdOption {
  option_type: string
  item?: SrdReference
  count?: number
  of?: SrdReference
  choice?: SrdProficiencyChoice
  items?: SrdOption[]
}

export interface SrdRace {
  index: string
  name: string
  speed: number
  ability_bonuses: SrdAbilityBonus[]
  alignment: string
  age: string
  size: string
  size_description: string
  languages: SrdReference[]
  language_desc: string
  traits: SrdReference[]
  subraces: SrdReference[]
}

export interface SrdSubrace {
  index: string
  name: string
  desc: string
  ability_bonuses: SrdAbilityBonus[]
  racial_traits: SrdReference[]
  language_options?: SrdProficiencyChoice
}

export interface SrdClass {
  index: string
  name: string
  hit_die: number
  proficiency_choices: SrdProficiencyChoice[]
  proficiencies: SrdReference[]
  saving_throws: SrdReference[]
  starting_equipment: { equipment: SrdReference; quantity: number }[]
  starting_equipment_options: SrdProficiencyChoice[]
  subclasses: SrdReference[]
  spellcasting?: {
    level: number
    spellcasting_ability: SrdReference
    info: { name: string; desc: string[] }[]
  }
}

export interface SrdLevelDetail {
  level: number
  ability_score_bonuses: number
  prof_bonus: number
  features: SrdReference[]
  class_specific: Record<string, number>
  spellcasting?: Record<string, number>
}

export interface SrdSpellDetail {
  index: string
  name: string
  level: number
  school: SrdReference
  casting_time: string
  range: string
  components: string[]
  duration: string
  desc: string[]
  higher_level?: string[]
  classes: SrdReference[]
}

export interface SrdSkill {
  index: string
  name: string
  desc: string[]
  ability_score: SrdReference
}

export interface SrdTrait {
  index: string
  name: string
  desc: string[]
}

// --- Ability Score Keys ---

export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha"

export const ABILITY_KEYS: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"]

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
}

// Maps SRD index to our short key
export const SRD_ABILITY_MAP: Record<string, AbilityKey> = {
  str: "str",
  dex: "dex",
  con: "con",
  int: "int",
  wis: "wis",
  cha: "cha",
}

// --- Backgrounds (SRD only has Acolyte, we include common PHB ones) ---

export interface Background {
  index: string
  name: string
  skillProficiencies: string[]
  languages: number
  toolProficiencies: string[]
  description: string
}

export const BACKGROUNDS: Background[] = [
  {
    index: "acolyte",
    name: "Acolyte",
    skillProficiencies: ["insight", "religion"],
    languages: 2,
    toolProficiencies: [],
    description: "You have spent your life in the service of a temple.",
  },
  {
    index: "criminal",
    name: "Criminal",
    skillProficiencies: ["deception", "stealth"],
    languages: 0,
    toolProficiencies: ["thieves-tools"],
    description: "You have a history of breaking the law.",
  },
  {
    index: "folk-hero",
    name: "Folk Hero",
    skillProficiencies: ["animal-handling", "survival"],
    languages: 0,
    toolProficiencies: ["artisans-tools"],
    description: "You come from a humble background but are destined for greatness.",
  },
  {
    index: "noble",
    name: "Noble",
    skillProficiencies: ["history", "persuasion"],
    languages: 1,
    toolProficiencies: ["gaming-set"],
    description: "You understand wealth, power, and privilege.",
  },
  {
    index: "sage",
    name: "Sage",
    skillProficiencies: ["arcana", "history"],
    languages: 2,
    toolProficiencies: [],
    description: "You spent years learning the lore of the multiverse.",
  },
  {
    index: "soldier",
    name: "Soldier",
    skillProficiencies: ["athletics", "intimidation"],
    languages: 0,
    toolProficiencies: ["gaming-set"],
    description: "War has been your life for as long as you care to remember.",
  },
  {
    index: "charlatan",
    name: "Charlatan",
    skillProficiencies: ["deception", "sleight-of-hand"],
    languages: 0,
    toolProficiencies: ["disguise-kit", "forgery-kit"],
    description: "You have always had a way with people.",
  },
  {
    index: "hermit",
    name: "Hermit",
    skillProficiencies: ["medicine", "religion"],
    languages: 1,
    toolProficiencies: ["herbalism-kit"],
    description: "You lived in seclusion for a formative part of your life.",
  },
  {
    index: "outlander",
    name: "Outlander",
    skillProficiencies: ["athletics", "survival"],
    languages: 1,
    toolProficiencies: ["musical-instrument"],
    description: "You grew up in the wilds, far from civilization.",
  },
  {
    index: "urchin",
    name: "Urchin",
    skillProficiencies: ["sleight-of-hand", "stealth"],
    languages: 0,
    toolProficiencies: ["disguise-kit", "thieves-tools"],
    description: "You grew up on the streets alone, orphaned, and poor.",
  },
]

// --- Alignments ---

export const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
]

// --- Standard Array & Point Buy ---

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]

export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
}

export const POINT_BUY_TOTAL = 27

// --- Equipment ---

export interface EquipmentItem {
  name: string
  quantity: number
}

export const STARTING_GOLD: Record<string, string> = {
  barbarian: "2d4 x 10 gp",
  bard: "5d4 x 10 gp",
  cleric: "5d4 x 10 gp",
  druid: "2d4 x 10 gp",
  fighter: "5d4 x 10 gp",
  monk: "5d4 gp",
  paladin: "5d4 x 10 gp",
  ranger: "5d4 x 10 gp",
  rogue: "4d4 x 10 gp",
  sorcerer: "3d4 x 10 gp",
  warlock: "4d4 x 10 gp",
  wizard: "4d4 x 10 gp",
}

// --- Player Character (persisted to Firebase) ---

export interface AbilityScores {
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
}

export interface PlayerCharacter {
  id: string
  playerId: string
  name: string
  race: string
  raceName: string
  subrace?: string | null
  subraceName?: string | null
  class: string
  className: string
  subclass?: string | null
  subclassName?: string | null
  level: number
  background: string
  backgroundName: string
  alignment: string

  // Base ability scores (before racial bonuses)
  baseAbilityScores: AbilityScores
  // Racial bonuses applied
  racialBonuses: Partial<AbilityScores>
  // Final scores (base + racial)
  abilityScores: AbilityScores

  // Derived stats
  hp: number
  maxHp: number
  ac: number
  speed: number
  proficiencyBonus: number
  hitDie: number

  // Proficiencies
  savingThrows: string[]
  skillProficiencies: string[]
  armorProficiencies: string[]
  weaponProficiencies: string[]
  toolProficiencies: string[]
  languages: string[]

  // Features
  racialTraits: string[]
  classFeatures: string[]

  // Equipment & Gold
  equipment: EquipmentItem[]
  gold: number

  // Spellcasting
  spellcastingAbility?: string | null
  cantrips: string[]
  spells: string[]

  // Portrait
  portraitUrl?: string

  // Meta
  notes: string
  createdAt: number
  updatedAt: number

  // Homebrew overrides
  overrides?: Partial<{
    hp: number
    maxHp: number
    ac: number
    speed: number
    proficiencyBonus: number
  }>
}

// --- Wizard State (intermediate state during creation) ---

export interface WizardState {
  step: number
  // Step 1: Race
  race?: SrdRace
  subrace?: SrdSubrace
  // Step 2: Class
  class?: SrdClass
  subclass?: SrdReference
  selectedSkills: string[]
  selectedCantrips: string[]
  selectedSpells: string[]
  // Step 3: Ability Scores
  method: "standard-array" | "point-buy" | "manual"
  baseScores: AbilityScores
  // Step 4: Details
  level: number
  name: string
  background: string
  alignment: string
  notes: string
  portraitDataUrl?: string
  // Equipment
  equipmentChoices: number[]
  startingGold: number
}

export const INITIAL_WIZARD_STATE: WizardState = {
  step: 0,
  subclass: undefined,
  selectedSkills: [],
  selectedCantrips: [],
  selectedSpells: [],
  method: "standard-array",
  baseScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  level: 1,
  name: "",
  background: "",
  alignment: "",
  notes: "",
  equipmentChoices: [],
  startingGold: 0,
}
