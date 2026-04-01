// --- Session / Story ---

export interface SectionVisual {
  type: "location" | "character" | "combat"
  id: string
}

export interface HandoutButton {
  id: string
  buttonText: string
}

export interface Section {
  title: string
  type: "readAloud" | "dmtip" | "notes" | "location" | "encounter" | "reveal" | "combat" | "map"
  content: string
  visual?: SectionVisual
  handout?: string | readonly HandoutButton[]
}

export interface Session {
  id: number
  title: string
  duration: string
  sections: Section[]
}

// --- NPCs ---

export interface AbilityScore {
  score: number
  mod: string
}

export interface NPCStats {
  ac: number
  acNote?: string
  hp: number
  maxHp: number
  speed: string
  str: AbilityScore
  dex: AbilityScore
  con: AbilityScore
  int: AbilityScore
  wis: AbilityScore
  cha: AbilityScore
  saves: string
  skills: string
  passivePerception: number
  languages: string
  cr: string
  damageResistances?: string
  conditionImmunities?: string
}

export interface NPCAbility {
  name: string
  desc: string
}

export interface NPCAttack {
  name: string
  type: string
  toHit: string
  reach: string
  damage: string
  notes?: string
}

export interface NPCSpell {
  name: string
  level: string
  desc: string
  dc?: number
  tactical?: string
}

export interface DialogueLine {
  context: string
  line: string
}

export interface NPC {
  id: string
  name: string
  title: string
  role: "ally" | "villain" | "flavor" | "enemy"
  vibe: string
  secret: string
  session: number[]
  color: string
  initials: string
  stats?: NPCStats | null
  abilities?: NPCAbility[]
  attacks?: NPCAttack[]
  spells?: NPCSpell[]
  personality: string
  voice: string
  dialogueLines: DialogueLine[]
  combatTactics?: string | null
  knows: string[]
}

// --- Encounters ---

export interface EncounterCombatant {
  id: string
  name: string
  npcId: string
  hp: number
  maxHp: number
  ac: number
  notes: string
}

export interface Encounter {
  id: string
  name: string
  session: number
  location: string
  difficulty: "Easy" | "Medium" | "Hard"
  description: string
  enemies: EncounterCombatant[]
  allies: EncounterCombatant[]
  terrain: string
  notes: string[]
}

// --- Clues ---

export interface Clue {
  id: string
  name: string
  session: number
  location: string
  description: string
  dc: string
  leadsTo: string[]
  found: boolean
  handout?: string
}

export interface Failsafe {
  order: number
  trigger: string
  action: string
}

// --- Battle Maps ---

export interface MapToken {
  x: number
  y: number
  label: string
  initials: string
  color: string
  ally: boolean
  autoReveal?: boolean
}

export interface MapFeature {
  type: string
  x?: number
  y?: number
  w?: number
  h?: number
  label?: string
  color?: string
  radius?: number
  shape?: "circle" | "rect"
  border?: string
  points?: string
  innerPoints?: string
}

export interface TerrainNote {
  label: string
  note: string
}

export interface BattleMap {
  name: string
  subtitle: string
  width: number
  height: number
  background: {
    gradient: string[]
  }
  features: MapFeature[]
  terrainNotes: TerrainNote[]
  tokens: Record<string, MapToken>
}

// --- Handouts ---

export interface HandoutContent {
  text?: string
  style: string
  hand?: string
}

export interface Handout {
  id: string
  title: string
  paperType: string
  handwriting: string
  content: HandoutContent[]
  decorations?: string[]
  accentColor: string
  isMap: boolean
  isPuzzle?: boolean
  solvedInscription?: string
}

// --- Visuals ---

export interface LocationVisual {
  name: string
  subtitle: string
  description: string
  gradient: string[]
  accentColor: string
  particles: string
  elements: string[]
  mood: string
}

export interface CharacterVisual {
  name: string
  title: string
  description: string
  gradient: string[]
  accentColor: string
  symbol: string
  mood: string
}

export interface CombatVisual {
  name: string
  subtitle: string
  description: string
  gradient: string[]
  accentColor: string
  mood: string
}

export interface Mood {
  id: string
  name: string
  gradient: string[]
  particles: string | null
  particleColor: string | null
  accentColor: string
}

// --- Campaign (top-level) ---

export interface Campaign {
  id: string
  title: string
  subtitle: string
  sessions: Session[]
  npcs: NPC[]
  encounters: Encounter[]
  clues: Clue[]
  failsafes: Failsafe[]
  battleMaps: Record<string, BattleMap>
  handouts: Record<string, Handout>
  moods: Record<string, Mood>
  visuals: {
    location: Record<string, LocationVisual>
    character: Record<string, CharacterVisual>
    combat: Record<string, CombatVisual>
  }
}
