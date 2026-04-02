# Character Creation & Player Integration

## Vision
Transform Thornhaven from a DM-only companion into a full player+DM platform. Players authenticate, create D&D 5e characters via an SRD-assisted wizard, and bring those characters into live sessions. Up to 6 players per session.

## Edition & Data Source
- **D&D 5e (2014 rules)**
- **SRD API**: `dnd5eapi.co` — free, no auth, CORS-enabled, covers races, classes, ability scores, skills, proficiencies, spells, equipment
- **Gaps to fill manually**: ability score generation methods (point buy/standard array), starting gold, backgrounds (limited SRD coverage), XP thresholds, HP/AC/modifier calculations

---

## Layer 1: Player Auth + Character Creation (BUILD FIRST)

### 1.1 Player Authentication
- Reuse existing Google auth via Firebase (`signInWithPopup`)
- Currently only DMs auth. Players join with just name + room code
- Change: players also sign in with Google before joining
- Firebase path: `players/{uid}` stores player profile + characters
- Players can still join sessions via room code, but now their character data persists across sessions

### 1.2 SRD API Integration Layer
Create `src/services/srd.ts` — a typed client for dnd5eapi.co with caching:

```
Available endpoints:
  /api/races          → Race[]           (9 races: Dwarf, Elf, Halfling, Human, Dragonborn, Gnome, Half-Elf, Half-Orc, Tiefling)
  /api/races/{index}  → RaceDetail       (speed, ability_bonuses, traits, subraces, languages, size)
  /api/classes        → Class[]          (12 classes)
  /api/classes/{index}→ ClassDetail      (hit_die, proficiency_choices, proficiencies, saving_throws, starting_equipment_options, subclasses)
  /api/ability-scores → AbilityScore[]   (STR, DEX, CON, INT, WIS, CHA)
  /api/skills         → Skill[]          (18 skills, each linked to an ability score)
  /api/levels/{class}/{level} → LevelDetail (proficiency_bonus, features, spellcasting)
```

Cache responses in memory (static reference data, never changes). Type all responses with proper interfaces.

### 1.3 Character Creation Wizard
Step-by-step flow, each step validates before proceeding:

**Step 1: Race**
- Grid of race cards with name, speed, ability bonuses, traits summary
- Select race → show subraces if available → confirm
- SRD provides: ability_bonuses, speed, size, languages, traits

**Step 2: Class**
- Grid of class cards with name, hit die, key abilities, armor/weapon proficiencies
- Select class → show proficiency choices (e.g., "Pick 2 skills from: Athletics, Acrobatics...")
- SRD provides: hit_die, proficiency_choices, saving_throws, starting_equipment_options

**Step 3: Ability Scores**
- Three methods: Standard Array (15,14,13,12,10,8), Point Buy (27 points), Manual Entry
- Drag-and-drop or dropdown to assign scores to STR/DEX/CON/INT/WIS/CHA
- Auto-apply racial bonuses
- Show resulting modifiers live

**Step 4: Details**
- Character name (required)
- Background (dropdown: Acolyte, Criminal, Folk Hero, Noble, Sage, Soldier — SRD backgrounds)
- Alignment (dropdown)
- Appearance notes (optional text)

**Step 5: Review & Create**
- Full character summary card
- Auto-calculated: HP (hit die + CON mod), AC (10 + DEX mod, or armor-dependent), proficiency bonus, saving throws, skill modifiers
- "Create Character" → saves to Firebase

### 1.4 Character Data Model

```typescript
interface PlayerCharacter {
  id: string
  playerId: string           // Firebase auth UID
  name: string
  race: string               // SRD index (e.g., "elf")
  subrace?: string           // SRD index (e.g., "high-elf")
  class: string              // SRD index (e.g., "fighter")
  level: number
  xp: number
  background: string
  alignment: string

  // Ability Scores (base + racial bonuses already applied)
  abilityScores: {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
  }

  // Derived (auto-calculated, editable for homebrew)
  hp: number
  maxHp: number
  ac: number
  speed: number
  proficiencyBonus: number
  initiative: number         // DEX modifier

  // Proficiencies
  savingThrows: string[]     // e.g., ["str", "con"]
  skillProficiencies: string[] // e.g., ["athletics", "intimidation"]
  armorProficiencies: string[]
  weaponProficiencies: string[]
  toolProficiencies: string[]
  languages: string[]

  // Features & Traits
  racialTraits: string[]     // from SRD race data
  classFeatures: string[]    // from SRD class/level data

  // Combat
  hitDie: number             // e.g., 10 for d10
  deathSaves: { successes: number; failures: number }

  // Spellcasting (if applicable)
  spellcastingAbility?: string
  spellSlots?: Record<number, { total: number; used: number }>
  knownSpells?: string[]
  preparedSpells?: string[]

  // Equipment
  equipment?: { name: string; quantity: number }[]
  gold?: number

  // Meta
  notes: string
  portraitUrl?: string
  createdAt: number
  updatedAt: number

  // Homebrew overrides — when set, these override calculated values
  overrides?: Partial<{
    hp: number
    maxHp: number
    ac: number
    speed: number
    proficiencyBonus: number
  }>
}
```

### 1.5 Firebase Structure

```
players/
  {uid}/
    profile: { displayName, email, photoUrl }
    characters/
      {charId}/
        ... PlayerCharacter fields

rooms/
  {code}/
    state/
      encounter/
        combatants/  ← now includes real PC data from character sheets
    players/
      {uid}/
        characterId: "char-123"  ← which character they brought to this session
```

### 1.6 Encounter Tracker Integration
- When player joins session with a character, their real stats populate the PC combatant
- DM sees actual HP, AC, ability scores in the encounter tracker
- HP changes in combat sync back to the character (temporary — encounter HP vs character sheet HP)
- Death saving throws tracked per combatant in encounter state

---

## Layer 2: Spells, Equipment, Level-Up (BUILD SECOND)

### 2.1 Spell Management
- SRD spell list per class: `/api/classes/{class}/spells`
- Spell detail: `/api/spells/{spell}` — level, school, casting time, range, components, description
- UI: spell book view, prepare/unprepare spells, track spell slots per level
- Cantrips (at-will) vs leveled spells (slot-based)
- Spell slots auto-calculated from class + level via SRD `/api/levels/{class}/{level}`

### 2.2 Equipment & Inventory
- Starting equipment from class (SRD `starting_equipment_options`)
- Equipment detail: `/api/equipment/{item}` — weight, cost, damage (weapons), AC bonus (armor)
- Inventory management: add/remove items, track weight (optional encumbrance)
- Armor affects AC calculation

### 2.3 Level-Up Wizard
- Trigger: DM awards XP or milestone level-up
- Auto-calculate: HP increase (roll hit die + CON mod, or take average), new proficiency bonus
- Show new class features from SRD `/api/levels/{class}/{newLevel}`
- Ability Score Improvement at levels 4, 8, 12, 16, 19: +2 to one score or +1 to two
- New spell slots (if spellcaster)
- Subclass selection at class-specific level (e.g., Fighter at 3, Wizard at 2)

---

## Layer 3: Death Saves & Advanced Combat (BUILD THIRD)

### 3.1 Death Saving Throws
- When PC hits 0 HP in combat: enter death save mode
- Player rolls d20 on their turn: ≥10 = success, <10 = failure
- 3 successes = stabilize (1 HP), 3 failures = death
- Natural 20 = regain 1 HP and consciousness
- Natural 1 = 2 failures
- Taking damage at 0 HP = automatic failure
- UI: death save tracker on player's battle map view, DM sees status

### 3.2 Multi-Player Battle Map
- Currently 1 PC token ("player"). Expand to support up to 6 PC tokens
- Each player can drag their own token (already supported via "move" messages)
- DM can drag any token
- Initiative order includes all PCs + NPCs
- Turn indicator shows whose turn it is on all players' screens

---

## Calculations Reference

```
Modifier = floor((score - 10) / 2)
Proficiency Bonus = ceil(level / 4) + 1  (or: 2 at L1-4, 3 at L5-8, 4 at L9-12, 5 at L13-16, 6 at L17-20)
HP at Level 1 = hit_die + CON_modifier
HP per Level = roll(hit_die) + CON_modifier  (or average: hit_die/2 + 1 + CON_mod)
AC (unarmored) = 10 + DEX_modifier
Initiative = DEX_modifier
Saving Throw = ability_modifier + (proficient ? proficiency_bonus : 0)
Skill Check = ability_modifier + (proficient ? proficiency_bonus : 0)
```

---

## UI/UX Notes

- Character creation should feel like a polished onboarding flow, not a spreadsheet
- Use the existing dark fantasy theme (gold accents, Cinzel font, parchment tones)
- Each wizard step should show a preview of what's being built
- Mobile-friendly — players often use phones at the table
- Animations: card selections, stat calculations appearing, parchment-style character sheet

---

## Open Questions (for future sessions)

- [ ] Should characters be shareable between campaigns/sessions or locked to one?
- [ ] Do we want character portraits? (upload or generate?)
- [ ] How to handle multiclassing? (complex — maybe Layer 4)
- [ ] Feats — SRD only has a few, most are in the PHB (non-SRD)
- [ ] Should the DM be able to edit player characters? (e.g., curse effects, magic items)
