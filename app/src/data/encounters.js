export const encounters = [
  {
    id: "night-encounter",
    name: "Night Encounter",
    session: 1,
    location: "Thornhaven streets",
    difficulty: "Easy",
    description: "Two Undertow thugs follow the player at night. They are not stealthy.",
    enemies: [
      { id: "thug-1", name: "Thug 1", npcId: "thug", hp: 32, maxHp: 32, ac: 11, notes: "Sneezes, blowing stealth" },
      { id: "thug-2", name: "Thug 2", npcId: "thug", hp: 32, maxHp: 32, ac: 11, notes: 'Whispers "SHUT UP" very loudly' },
    ],
    allies: [
      { id: "maren-1", name: "Maren", npcId: "maren", hp: 30, maxHp: 30, ac: 16, notes: "Annoyed more than alarmed" },
    ],
    terrain: "Town streets at night. No special terrain.",
    notes: [
      "Thugs attack if spotted — fight with zero conviction",
      "If captured (DC 12 Intimidation): they crack immediately",
      "Loot: 8 sp each, potion of water breathing, Undertow handbook",
    ],
  },
  {
    id: "saltworks-rescue",
    name: "Saltworks Rescue",
    session: 2,
    location: "Old Saltworks basement",
    difficulty: "Medium",
    description: "Three thugs and the Undertow Lieutenant guard the Saltworks. One thug is mid-sandwich.",
    enemies: [
      { id: "thug-3", name: "Thug (sandwich)", npcId: "thug", hp: 32, maxHp: 32, ac: 11, notes: "Mid-sandwich. Fights one-handed Round 1 (disadvantage)." },
      { id: "thug-4", name: "Thug 2", npcId: "thug", hp: 32, maxHp: 32, ac: 11, notes: "" },
      { id: "thug-5", name: "Thug 3", npcId: "thug", hp: 32, maxHp: 32, ac: 11, notes: "" },
      { id: "lt-1", name: "Lieutenant", npcId: "cultfanatic", hp: 33, maxHp: 33, ac: 13, notes: "The only competent one. True believer. See spell tactics." },
    ],
    allies: [
      { id: "maren-2", name: "Maren", npcId: "maren", hp: 30, maxHp: 30, ac: 16, notes: "Focused, professional. Targets thugs." },
    ],
    terrain: "Underground basement. Normal terrain. Tight quarters favor melee.",
    notes: [
      "Lieutenant Round 1: Spiritual Weapon (bonus) + Hold Person (action)",
      "Lieutenant Round 2: Spiritual Weapon + Inflict Wounds (3d10!)",
      "WARNING: Hold Person + Inflict Wounds can KO level 3 PC. Pull if unfun.",
      "Sandwich thug has disadvantage Round 1",
      "Tone shift: The Lieutenant is genuinely dangerous",
    ],
  },
  {
    id: "altar-chamber",
    name: "Altar Chamber",
    session: 2,
    location: "Sea caves — Altar Chamber",
    difficulty: "Hard",
    description: "The climactic confrontation. Selen, two thugs, and Edric stand before the altar.",
    enemies: [
      { id: "selen-1", name: "Selen Dray", npcId: "selen", hp: 65, maxHp: 65, ac: 15, notes: "AC 17 behind altar (half cover). Parry: +2 AC reaction." },
      { id: "thug-6", name: "Reluctant Thug", npcId: "thug", hp: 32, maxHp: 32, ac: 11, notes: "Will sit down if addressed with any Persuasion check" },
      { id: "thug-7", name: "Thug", npcId: "thug", hp: 32, maxHp: 32, ac: 11, notes: "" },
      { id: "edric-1", name: "Edric Ashwick", npcId: "edric", hp: 11, maxHp: 11, ac: 16, notes: "Surrenders at 5 HP. Instant surrender if Maren talks (DC 13 Persuasion, ADV with Maren)." },
    ],
    allies: [
      { id: "maren-3", name: "Maren", npcId: "maren", hp: 30, maxHp: 30, ac: 16, notes: "Does NOT attack Round 1. Sees Edric. Processing." },
    ],
    terrain: "Waist-deep water = difficult terrain (half the room). Black stone altar provides half cover (+2 AC, +2 DEX saves).",
    notes: [
      "Selen offers a deal first — combat only if refused",
      "Edric holds action Round 1, looks between Selen and Maren",
      "Maren frozen Round 1 — doesn't attack",
      "Player can talk Edric down: Action, DC 13 Persuasion (ADV with Maren)",
      "Selen uses Multiattack (3 attacks), kicks toward water (shove: Athletics +4)",
      "Selen doesn't flee. Surrenders only if Edric down + below 20 HP.",
      "After fight: altar goes dormant, water recedes, cold fades",
    ],
  },
];

export const initiativeTemplate = {
  round: 1,
  entries: [],
};
