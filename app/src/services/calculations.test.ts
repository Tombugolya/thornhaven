import {
  abilityModifier,
  formatModifier,
  proficiencyBonus,
  hpAtLevel1,
  unarmoredAC,
  pointBuyRemaining,
} from "./calculations"
import { POINT_BUY_COSTS, POINT_BUY_TOTAL } from "../types/character"
import type { AbilityScores } from "../types/character"

describe("abilityModifier", () => {
  it("returns 0 for a score of 10", () => {
    expect(abilityModifier(10)).toBe(0)
  })

  it("returns -1 for a score of 8", () => {
    expect(abilityModifier(8)).toBe(-1)
  })

  it("returns +2 for a score of 15", () => {
    expect(abilityModifier(15)).toBe(2)
  })

  it("returns +5 for a score of 20", () => {
    expect(abilityModifier(20)).toBe(5)
  })

  it("returns -5 for a score of 1", () => {
    expect(abilityModifier(1)).toBe(-5)
  })
})

describe("formatModifier", () => {
  it("formats score 10 as '+0'", () => {
    expect(formatModifier(10)).toBe("+0")
  })

  it("formats score 8 as '-1'", () => {
    expect(formatModifier(8)).toBe("-1")
  })

  it("formats score 15 as '+2'", () => {
    expect(formatModifier(15)).toBe("+2")
  })
})

describe("proficiencyBonus", () => {
  it("returns 2 for level 1", () => {
    expect(proficiencyBonus(1)).toBe(2)
  })

  it("returns 2 for level 4", () => {
    expect(proficiencyBonus(4)).toBe(2)
  })

  it("returns 3 for level 5", () => {
    expect(proficiencyBonus(5)).toBe(3)
  })

  it("returns 4 for level 9", () => {
    expect(proficiencyBonus(9)).toBe(4)
  })

  it("returns 6 for level 17", () => {
    expect(proficiencyBonus(17)).toBe(6)
  })
})

describe("hpAtLevel1", () => {
  it("returns 12 for hitDie 10 and CON 14", () => {
    expect(hpAtLevel1(10, 14)).toBe(12)
  })

  it("returns 5 for hitDie 6 and CON 8", () => {
    expect(hpAtLevel1(6, 8)).toBe(5)
  })
})

describe("unarmoredAC", () => {
  it("returns 12 for DEX 14", () => {
    expect(unarmoredAC(14)).toBe(12)
  })

  it("returns 10 for DEX 10", () => {
    expect(unarmoredAC(10)).toBe(10)
  })
})

describe("pointBuyRemaining", () => {
  it("returns 27 when all scores are 8 (nothing spent)", () => {
    const scores: AbilityScores = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 }
    expect(pointBuyRemaining(scores, POINT_BUY_COSTS, POINT_BUY_TOTAL)).toBe(27)
  })

  it("returns -27 when all scores are 15 (over budget)", () => {
    const scores: AbilityScores = { str: 15, dex: 15, con: 15, int: 15, wis: 15, cha: 15 }
    expect(pointBuyRemaining(scores, POINT_BUY_COSTS, POINT_BUY_TOTAL)).toBe(-27)
  })
})
