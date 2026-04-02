// Shared types for the API

export interface SubclassFeature {
  name: string;
  level: number;
  description: string;
}

export interface SubclassData {
  index: string;
  name: string;
  className: string;
  classIndex: string;
  subclassLevel: number;
  description: string;
  features: SubclassFeature[];
  spellcasting?: {
    ability: string;
    description: string;
  };
}

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export const ABILITY_KEYS: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];

export interface CharacterValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DerivedStats {
  hp: number;
  ac: number;
  proficiencyBonus: number;
  initiative: number;
  savingThrows: Record<string, number>;
  skills: Record<string, number>;
  modifiers: Record<string, number>;
}
