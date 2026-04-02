import type { AbilityScores, AbilityKey, CharacterValidation, DerivedStats } from "./types";

const ALL_ABILITY_KEYS: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
};
const POINT_BUY_TOTAL = 27;

// --- Core calculations ---

export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function proficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

export function hpAtLevel(hitDie: number, conScore: number, level: number): number {
  const conMod = abilityModifier(conScore);
  const level1Hp = hitDie + conMod;
  const perLevelAvg = Math.floor(hitDie / 2) + 1 + conMod;
  return level1Hp + perLevelAvg * (level - 1);
}

export function unarmoredAC(dexScore: number): number {
  return 10 + abilityModifier(dexScore);
}

// --- Character validation ---

interface ValidateInput {
  race: string;
  class: string;
  level: number;
  abilityScores: AbilityScores;
  abilityMethod: "standard-array" | "point-buy" | "manual";
  selectedSkills: string[];
  name: string;
  background: string;
  alignment: string;
}

export function validateCharacter(input: ValidateInput): CharacterValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Name required
  if (!input.name || input.name.trim().length === 0) {
    errors.push("Character name is required.");
  }

  // Level range
  if (input.level < 1 || input.level > 20) {
    errors.push("Level must be between 1 and 20.");
  }

  // Ability scores validation
  const scores = input.abilityScores;
  for (const key of ALL_ABILITY_KEYS) {
    const val = scores[key];
    if (val < 1 || val > 30) {
      errors.push(`${key.toUpperCase()} score (${val}) is out of valid range (1-30).`);
    }
  }

  // Validate by method
  if (input.abilityMethod === "standard-array") {
    const sorted = ALL_ABILITY_KEYS.map((k) => scores[k]).sort((a, b) => a - b);
    const target = [...STANDARD_ARRAY].sort((a, b) => a - b);
    const isValid = sorted.every((v, i) => v === target[i]);
    if (!isValid) {
      errors.push("Standard array scores must use exactly: 15, 14, 13, 12, 10, 8.");
    }
  } else if (input.abilityMethod === "point-buy") {
    let spent = 0;
    for (const key of ALL_ABILITY_KEYS) {
      const base = scores[key];
      if (base < 8 || base > 15) {
        errors.push(`Point buy scores must be between 8 and 15 (${key.toUpperCase()} is ${base}).`);
      }
      spent += POINT_BUY_COSTS[base] ?? 0;
    }
    if (spent > POINT_BUY_TOTAL) {
      errors.push(`Point buy exceeds ${POINT_BUY_TOTAL} points (spent ${spent}).`);
    }
    if (spent < POINT_BUY_TOTAL) {
      warnings.push(`You have ${POINT_BUY_TOTAL - spent} unspent point buy points.`);
    }
  }

  // Background and alignment
  if (!input.background) {
    errors.push("Background is required.");
  }
  if (!input.alignment) {
    errors.push("Alignment is required.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// --- Derived stats calculation ---

interface CalculateInput {
  level: number;
  hitDie: number;
  abilityScores: AbilityScores;
  savingThrowProficiencies: string[];
  skillProficiencies: string[];
}

const SKILL_ABILITIES: Record<string, AbilityKey> = {
  athletics: "str",
  acrobatics: "dex",
  "sleight-of-hand": "dex",
  stealth: "dex",
  arcana: "int",
  history: "int",
  investigation: "int",
  nature: "int",
  religion: "int",
  "animal-handling": "wis",
  insight: "wis",
  medicine: "wis",
  perception: "wis",
  survival: "wis",
  deception: "cha",
  intimidation: "cha",
  performance: "cha",
  persuasion: "cha",
};

export function calculateDerivedStats(input: CalculateInput): DerivedStats {
  const profBonus = proficiencyBonus(input.level);

  // Ability modifiers
  const modifiers: Record<string, number> = {};
  for (const key of ALL_ABILITY_KEYS) {
    modifiers[key] = abilityModifier(input.abilityScores[key]);
  }

  // Saving throws
  const savingThrows: Record<string, number> = {};
  for (const key of ALL_ABILITY_KEYS) {
    const mod = modifiers[key];
    const proficient = input.savingThrowProficiencies.includes(key);
    savingThrows[key] = mod + (proficient ? profBonus : 0);
  }

  // Skills
  const skills: Record<string, number> = {};
  for (const [skill, ability] of Object.entries(SKILL_ABILITIES)) {
    const mod = modifiers[ability];
    const proficient = input.skillProficiencies.includes(skill);
    skills[skill] = mod + (proficient ? profBonus : 0);
  }

  return {
    hp: hpAtLevel(input.hitDie, input.abilityScores.con, input.level),
    ac: unarmoredAC(input.abilityScores.dex),
    proficiencyBonus: profBonus,
    initiative: modifiers["dex"],
    savingThrows,
    skills,
    modifiers,
  };
}
