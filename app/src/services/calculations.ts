import type { AbilityScores, AbilityKey, SrdRace, SrdSubrace, SrdClass } from "../types/character"
import { SRD_ABILITY_MAP } from "../types/character"

/** floor((score - 10) / 2) */
export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

/** Format modifier as "+2" or "-1" */
export function formatModifier(score: number): string {
  const mod = abilityModifier(score)
  return mod >= 0 ? `+${mod}` : `${mod}`
}

/** 2 at L1-4, 3 at L5-8, 4 at L9-12, 5 at L13-16, 6 at L17-20 */
export function proficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1
}

/** HP at level 1 = max hit die + CON modifier */
export function hpAtLevel1(hitDie: number, conScore: number): number {
  return hitDie + abilityModifier(conScore)
}

/** AC (unarmored) = 10 + DEX modifier */
export function unarmoredAC(dexScore: number): number {
  return 10 + abilityModifier(dexScore)
}

/** Compute racial ability bonuses from SRD race (and optional subrace) */
export function computeRacialBonuses(race: SrdRace, subrace?: SrdSubrace): Partial<AbilityScores> {
  const bonuses: Partial<AbilityScores> = {}

  for (const bonus of race.ability_bonuses) {
    const key = SRD_ABILITY_MAP[bonus.ability_score.index]
    if (key) {
      bonuses[key] = (bonuses[key] ?? 0) + bonus.bonus
    }
  }

  if (subrace) {
    for (const bonus of subrace.ability_bonuses) {
      const key = SRD_ABILITY_MAP[bonus.ability_score.index]
      if (key) {
        bonuses[key] = (bonuses[key] ?? 0) + bonus.bonus
      }
    }
  }

  return bonuses
}

/** Apply racial bonuses to base scores */
export function applyBonuses(base: AbilityScores, bonuses: Partial<AbilityScores>): AbilityScores {
  return {
    str: base.str + (bonuses.str ?? 0),
    dex: base.dex + (bonuses.dex ?? 0),
    con: base.con + (bonuses.con ?? 0),
    int: base.int + (bonuses.int ?? 0),
    wis: base.wis + (bonuses.wis ?? 0),
    cha: base.cha + (bonuses.cha ?? 0),
  }
}

/** Extract saving throw proficiency keys from SRD class */
export function classSavingThrows(srdClass: SrdClass): AbilityKey[] {
  return srdClass.saving_throws
    .map((st) => SRD_ABILITY_MAP[st.index])
    .filter((k): k is AbilityKey => k !== undefined)
}

/** Extract proficiency names from SRD class (armor, weapons, etc.) */
export function classBaseProficiencies(srdClass: SrdClass): {
  armor: string[]
  weapons: string[]
  tools: string[]
} {
  const armor: string[] = []
  const weapons: string[] = []
  const tools: string[] = []

  for (const prof of srdClass.proficiencies) {
    const name = prof.name
    if (name.includes("armor") || name.includes("shield") || name.includes("Shield")) {
      armor.push(name)
    } else if (
      name.includes("weapon") ||
      name.includes("sword") ||
      name.includes("Crossbow") ||
      name.includes("dagger") ||
      name.includes("Dagger")
    ) {
      weapons.push(name)
    } else if (!name.includes("Saving Throw")) {
      tools.push(name)
    }
  }

  return { armor, weapons, tools }
}

/** Extract skill choices from SRD class proficiency_choices */
export function classSkillChoices(srdClass: SrdClass): {
  choose: number
  options: string[]
} {
  for (const choice of srdClass.proficiency_choices) {
    // Skill choices have items like "Skill: Athletics"
    const skillOptions = choice.from.options
      .filter((o) => o.item?.index.startsWith("skill-"))
      .map((o) => o.item!.index.replace("skill-", ""))

    if (skillOptions.length > 0) {
      return { choose: choice.choose, options: skillOptions }
    }
  }

  return { choose: 0, options: [] }
}

/** Point buy: calculate remaining points */
export function pointBuyRemaining(
  scores: AbilityScores,
  costs: Record<number, number>,
  total: number,
): number {
  let spent = 0
  for (const key of Object.keys(scores) as AbilityKey[]) {
    spent += costs[scores[key]] ?? 0
  }
  return total - spent
}
