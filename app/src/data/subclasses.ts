import type { SubclassData } from "../types/character"

export const subclasses: SubclassData[] = [
  // ========== BARBARIAN (subclass at level 3) ==========
  {
    index: "berserker",
    name: "Path of the Berserker",
    className: "Barbarian",
    classIndex: "barbarian",
    subclassLevel: 3,
    description:
      "A barbarian driven by pure destructive fury, entering a frenzy that pushes beyond normal rage into a state of reckless abandon.",
    features: [
      {
        name: "Frenzy",
        level: 3,
        description:
          "While raging, you can enter a frenzy as a bonus action. During the frenzy, you can make a single melee weapon attack as a bonus action on each of your turns. When the rage ends, you gain one level of exhaustion.",
      },
      {
        name: "Mindless Rage",
        level: 6,
        description:
          "You cannot be charmed or frightened while raging. If you were charmed or frightened when you enter rage, the effect is suspended for the duration.",
      },
      {
        name: "Intimidating Presence",
        level: 10,
        description:
          "You can use your action to frighten a creature within 30 feet that can see you. The target must succeed on a Wisdom saving throw (DC = 8 + your proficiency bonus + your Charisma modifier) or be frightened until the end of your next turn.",
      },
      {
        name: "Retaliation",
        level: 14,
        description:
          "When you take damage from a creature within 5 feet of you, you can use your reaction to make a melee weapon attack against that creature.",
      },
    ],
  },
  {
    index: "totem-warrior",
    name: "Path of the Totem Warrior",
    className: "Barbarian",
    classIndex: "barbarian",
    subclassLevel: 3,
    description:
      "A spiritual warrior who draws on the primal forces of nature, forging a bond with a totem animal spirit that guides and protects them.",
    features: [
      {
        name: "Spirit Seeker",
        level: 3,
        description:
          "You gain the ability to cast Beast Sense and Speak with Animals as rituals.",
      },
      {
        name: "Totem Spirit",
        level: 3,
        description:
          "Choose a totem animal: Bear (while raging, you have resistance to all damage except psychic), Eagle (enemies have disadvantage on opportunity attacks against you while raging, and you can Dash as a bonus action), or Wolf (while raging, your allies have advantage on melee attack rolls against hostile creatures within 5 feet of you).",
      },
      {
        name: "Aspect of the Beast",
        level: 6,
        description:
          "You gain a benefit based on your totem: Bear (carrying capacity doubles and you have advantage on Strength checks to push, pull, or lift), Eagle (you can see up to 1 mile with clarity and dim light doesn't impose disadvantage on Perception), or Wolf (you can track creatures at a fast pace and move stealthily at a normal pace).",
      },
      {
        name: "Spirit Walker",
        level: 10,
        description: "You can cast Commune with Nature as a ritual.",
      },
      {
        name: "Totemic Attunement",
        level: 14,
        description:
          "Bear (while raging, hostile creatures within 5 feet have disadvantage on attacks against your allies), Eagle (you gain a flying speed equal to your walking speed while raging), or Wolf (while raging, you can use a bonus action to knock a Large or smaller creature prone when you hit it with a melee attack).",
      },
    ],
  },

  // ========== BARD (subclass at level 3) ==========
  {
    index: "lore",
    name: "College of Lore",
    className: "Bard",
    classIndex: "bard",
    subclassLevel: 3,
    description:
      "A scholar-bard who collects knowledge from every source, using their broad expertise and sharp wit to undermine foes and bolster allies.",
    features: [
      {
        name: "Bonus Proficiencies",
        level: 3,
        description: "You gain proficiency in three skills of your choice.",
      },
      {
        name: "Cutting Words",
        level: 3,
        description:
          "When a creature you can see within 60 feet makes an attack roll, ability check, or damage roll, you can use your reaction to expend a Bardic Inspiration die and subtract the result from the creature's roll.",
      },
      {
        name: "Additional Magical Secrets",
        level: 6,
        description:
          "You learn two spells of your choice from any class's spell list. These count as bard spells for you.",
      },
      {
        name: "Peerless Skill",
        level: 14,
        description:
          "When you make an ability check, you can expend a Bardic Inspiration die and add it to the result. You can do this after rolling but before knowing if it succeeds.",
      },
    ],
  },
  {
    index: "valor",
    name: "College of Valor",
    className: "Bard",
    classIndex: "bard",
    subclassLevel: 3,
    description:
      "A warrior-poet who inspires heroism through tales of glory, blending martial prowess with bardic magic on the battlefield.",
    features: [
      {
        name: "Bonus Proficiencies",
        level: 3,
        description:
          "You gain proficiency with medium armor, shields, and martial weapons.",
      },
      {
        name: "Combat Inspiration",
        level: 3,
        description:
          "A creature that has your Bardic Inspiration die can add it to a weapon damage roll or to their AC against one attack, expending the die.",
      },
      {
        name: "Extra Attack",
        level: 6,
        description:
          "You can attack twice instead of once when you take the Attack action on your turn.",
      },
      {
        name: "Battle Magic",
        level: 14,
        description:
          "When you use your action to cast a bard spell, you can make one weapon attack as a bonus action.",
      },
    ],
  },

  // ========== CLERIC (subclass at level 1) ==========
  {
    index: "life",
    name: "Life Domain",
    className: "Cleric",
    classIndex: "cleric",
    subclassLevel: 1,
    description:
      "A divine healer devoted to the positive energy of life, whose magic restores vitality and shields the living from harm.",
    features: [
      {
        name: "Bonus Proficiency",
        level: 1,
        description: "You gain proficiency with heavy armor.",
      },
      {
        name: "Disciple of Life",
        level: 1,
        description:
          "Your healing spells are more effective. Whenever you cast a spell of 1st level or higher that restores hit points, the creature regains additional hit points equal to 2 + the spell's level.",
      },
      {
        name: "Channel Divinity: Preserve Life",
        level: 2,
        description:
          "As an action, you present your holy symbol and restore hit points to creatures within 30 feet. You distribute a pool of HP equal to 5 times your cleric level. Each creature can be healed up to half its maximum HP.",
      },
      {
        name: "Blessed Healer",
        level: 6,
        description:
          "When you cast a healing spell of 1st level or higher on another creature, you also regain hit points equal to 2 + the spell's level.",
      },
      {
        name: "Divine Strike",
        level: 8,
        description:
          "Once per turn, you deal an extra 1d8 radiant damage when you hit with a weapon attack. At 14th level, this increases to 2d8.",
      },
      {
        name: "Supreme Healing",
        level: 17,
        description:
          "When you roll dice to restore HP with a healing spell, you use the maximum possible result instead of rolling.",
      },
    ],
  },
  {
    index: "knowledge",
    name: "Knowledge Domain",
    className: "Cleric",
    classIndex: "cleric",
    subclassLevel: 1,
    description:
      "A cleric who serves gods of learning, seeking to uncover secrets and share (or hoard) the knowledge of the multiverse.",
    features: [
      {
        name: "Blessings of Knowledge",
        level: 1,
        description:
          "You learn two languages of your choice and gain proficiency in two of the following skills: Arcana, History, Nature, or Religion. Your proficiency bonus is doubled for checks with those skills.",
      },
      {
        name: "Channel Divinity: Knowledge of the Ages",
        level: 2,
        description:
          "As an action, you gain proficiency with one skill or tool of your choice for 10 minutes.",
      },
      {
        name: "Channel Divinity: Read Thoughts",
        level: 6,
        description:
          "You can use Channel Divinity to read a creature's surface thoughts. The target must make a Wisdom save or you can read its thoughts for 1 minute. You can also cast Suggestion on the target without expending a spell slot.",
      },
      {
        name: "Potent Spellcasting",
        level: 8,
        description:
          "You add your Wisdom modifier to the damage of cleric cantrips.",
      },
      {
        name: "Visions of the Past",
        level: 17,
        description:
          "You can spend a short rest meditating to receive visions related to an object you hold or your immediate surroundings, learning about significant events that occurred there.",
      },
    ],
  },
  {
    index: "light",
    name: "Light Domain",
    className: "Cleric",
    classIndex: "cleric",
    subclassLevel: 1,
    description:
      "A cleric who wields the power of fire and radiance, burning away darkness and evil with divine light.",
    features: [
      {
        name: "Bonus Cantrip",
        level: 1,
        description: "You gain the Light cantrip if you don't already know it.",
      },
      {
        name: "Warding Flare",
        level: 1,
        description:
          "When a creature you can see within 30 feet attacks you, you can use your reaction to impose disadvantage on the attack roll by flashing a burst of light. You can use this a number of times equal to your Wisdom modifier per long rest.",
      },
      {
        name: "Channel Divinity: Radiance of the Dawn",
        level: 2,
        description:
          "As an action, you dispel magical darkness within 30 feet. Each hostile creature in that area must make a Constitution save or take 2d10 + your cleric level in radiant damage (half on a save).",
      },
      {
        name: "Improved Flare",
        level: 6,
        description:
          "You can use Warding Flare when a creature you can see attacks a creature other than you within 30 feet.",
      },
      {
        name: "Potent Spellcasting",
        level: 8,
        description:
          "You add your Wisdom modifier to the damage of cleric cantrips.",
      },
      {
        name: "Corona of Light",
        level: 17,
        description:
          "You can use your action to activate an aura of sunlight that lasts 1 minute. It sheds bright light in a 60-foot radius and dim light 30 feet beyond that. Enemies in bright light have disadvantage on saves against spells that deal fire or radiant damage.",
      },
    ],
  },
  {
    index: "tempest",
    name: "Tempest Domain",
    className: "Cleric",
    classIndex: "cleric",
    subclassLevel: 1,
    description:
      "A cleric who channels the destructive fury of storms, wielding thunder and lightning as divine weapons.",
    features: [
      {
        name: "Bonus Proficiencies",
        level: 1,
        description:
          "You gain proficiency with martial weapons and heavy armor.",
      },
      {
        name: "Wrath of the Storm",
        level: 1,
        description:
          "When a creature within 5 feet hits you with an attack, you can use your reaction to force it to make a Dexterity save. It takes 2d8 lightning or thunder damage on a failure, half on a success. Usable Wisdom modifier times per long rest.",
      },
      {
        name: "Channel Divinity: Destructive Wrath",
        level: 2,
        description:
          "When you roll lightning or thunder damage, you can use Channel Divinity to deal maximum damage instead of rolling.",
      },
      {
        name: "Thunderbolt Strike",
        level: 6,
        description:
          "When you deal lightning damage to a Large or smaller creature, you can push it up to 10 feet away from you.",
      },
      {
        name: "Divine Strike",
        level: 8,
        description:
          "Once per turn, you deal an extra 1d8 thunder damage with a weapon attack. Increases to 2d8 at 14th level.",
      },
      {
        name: "Stormborn",
        level: 17,
        description:
          "You gain a flying speed equal to your walking speed whenever you are outdoors.",
      },
    ],
  },
  {
    index: "trickery",
    name: "Trickery Domain",
    className: "Cleric",
    classIndex: "cleric",
    subclassLevel: 1,
    description:
      "A cleric who serves gods of deception and mischief, using illusions, stealth, and cunning to serve their deity's aims.",
    features: [
      {
        name: "Blessing of the Trickster",
        level: 1,
        description:
          "You can use your action to touch a willing creature and grant it advantage on Dexterity (Stealth) checks for 1 hour, or until you use this again.",
      },
      {
        name: "Channel Divinity: Invoke Duplicity",
        level: 2,
        description:
          "You create an illusory duplicate of yourself within 30 feet that lasts 1 minute. You can cast spells as though you were in the duplicate's space, and you have advantage on attack rolls against creatures within 5 feet of the duplicate.",
      },
      {
        name: "Channel Divinity: Cloak of Shadows",
        level: 6,
        description:
          "You can use Channel Divinity to become invisible until the end of your next turn, or until you attack or cast a spell.",
      },
      {
        name: "Divine Strike",
        level: 8,
        description:
          "Once per turn, you deal an extra 1d8 poison damage with a weapon attack. Increases to 2d8 at 14th level.",
      },
      {
        name: "Improved Duplicity",
        level: 17,
        description:
          "You can create up to four duplicates instead of one when using Invoke Duplicity.",
      },
    ],
  },
  {
    index: "war",
    name: "War Domain",
    className: "Cleric",
    classIndex: "cleric",
    subclassLevel: 1,
    description:
      "A militant cleric who embodies the fury and honor of battle, augmenting their martial prowess with divine power.",
    features: [
      {
        name: "Bonus Proficiencies",
        level: 1,
        description:
          "You gain proficiency with martial weapons and heavy armor.",
      },
      {
        name: "War Priest",
        level: 1,
        description:
          "When you take the Attack action, you can make one weapon attack as a bonus action. You can use this a number of times equal to your Wisdom modifier per long rest.",
      },
      {
        name: "Channel Divinity: Guided Strike",
        level: 2,
        description:
          "When you make an attack roll, you can use Channel Divinity to add +10 to the roll. You choose after seeing the roll but before the DM says whether it hits.",
      },
      {
        name: "Channel Divinity: War God's Blessing",
        level: 6,
        description:
          "When a creature within 30 feet makes an attack roll, you can use your reaction and Channel Divinity to grant +10 to that roll.",
      },
      {
        name: "Divine Strike",
        level: 8,
        description:
          "Once per turn, you deal an extra 1d8 damage of the weapon's type with a weapon attack. Increases to 2d8 at 14th level.",
      },
      {
        name: "Avatar of Battle",
        level: 17,
        description:
          "You have resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons.",
      },
    ],
  },

  // ========== DRUID (subclass at level 2) ==========
  {
    index: "land",
    name: "Circle of the Land",
    className: "Druid",
    classIndex: "druid",
    subclassLevel: 2,
    description:
      "A druid deeply connected to a specific biome, drawing additional spellcasting power from the land itself.",
    features: [
      {
        name: "Bonus Cantrip",
        level: 2,
        description: "You learn one additional druid cantrip of your choice.",
      },
      {
        name: "Natural Recovery",
        level: 2,
        description:
          "During a short rest, you can recover expended spell slots with a combined level equal to or less than half your druid level (rounded up). You can't recover slots of 6th level or higher.",
      },
      {
        name: "Circle Spells",
        level: 3,
        description:
          "You choose a land type (Arctic, Coast, Desert, Forest, Grassland, Mountain, Swamp, or Underdark) that grants you additional always-prepared spells at 3rd, 5th, 7th, and 9th level.",
      },
      {
        name: "Land's Stride",
        level: 6,
        description:
          "Moving through nonmagical difficult terrain costs no extra movement, and you can pass through nonmagical plants without being slowed or taking damage. You also have advantage on saves against magically created plants.",
      },
      {
        name: "Nature's Ward",
        level: 10,
        description:
          "You can't be charmed or frightened by elementals or fey, and you are immune to poison and disease.",
      },
      {
        name: "Nature's Sanctuary",
        level: 14,
        description:
          "Beasts and plant creatures must make a Wisdom save before attacking you. On a failure, they must choose a different target or the attack misses.",
      },
    ],
  },
  {
    index: "moon",
    name: "Circle of the Moon",
    className: "Druid",
    classIndex: "druid",
    subclassLevel: 2,
    description:
      "A druid who specializes in Wild Shape, transforming into powerful beast forms for combat rather than utility.",
    features: [
      {
        name: "Combat Wild Shape",
        level: 2,
        description:
          "You can use Wild Shape as a bonus action rather than an action. While in beast form, you can expend a spell slot to regain 1d8 HP per slot level.",
      },
      {
        name: "Circle Forms",
        level: 2,
        description:
          "You can transform into beasts with a CR as high as 1 (no flying speed). At 6th level, the CR equals your druid level divided by 3, rounded down.",
      },
      {
        name: "Primal Strike",
        level: 6,
        description:
          "Your attacks in beast form count as magical for the purpose of overcoming resistance and immunity to nonmagical attacks.",
      },
      {
        name: "Elemental Wild Shape",
        level: 10,
        description:
          "You can expend two uses of Wild Shape to transform into an air, earth, fire, or water elemental.",
      },
      {
        name: "Thousand Forms",
        level: 14,
        description: "You can cast Alter Self at will without expending a spell slot.",
      },
    ],
  },

  // ========== FIGHTER (subclass at level 3) ==========
  {
    index: "champion",
    name: "Champion",
    className: "Fighter",
    classIndex: "fighter",
    subclassLevel: 3,
    description:
      "A straightforward martial warrior who hones raw physical power and athletic prowess to lethal perfection.",
    features: [
      {
        name: "Improved Critical",
        level: 3,
        description: "Your weapon attacks score a critical hit on a roll of 19 or 20.",
      },
      {
        name: "Remarkable Athlete",
        level: 7,
        description:
          "You add half your proficiency bonus (rounded up) to any Strength, Dexterity, or Constitution check that doesn't already use your proficiency bonus. Your running long jump distance increases by a number of feet equal to your Strength modifier.",
      },
      {
        name: "Additional Fighting Style",
        level: 10,
        description: "You choose a second Fighting Style option.",
      },
      {
        name: "Superior Critical",
        level: 15,
        description: "Your weapon attacks score a critical hit on a roll of 18, 19, or 20.",
      },
      {
        name: "Survivor",
        level: 18,
        description:
          "At the start of each of your turns, you regain hit points equal to 5 + your Constitution modifier if you have no more than half your HP remaining and at least 1 HP.",
      },
    ],
  },
  {
    index: "battle-master",
    name: "Battle Master",
    className: "Fighter",
    classIndex: "fighter",
    subclassLevel: 3,
    description:
      "A tactical warrior who employs combat maneuvers and superiority dice to control the battlefield with precision and cunning.",
    features: [
      {
        name: "Combat Superiority",
        level: 3,
        description:
          "You learn three maneuvers of your choice (e.g., Trip Attack, Riposte, Disarming Attack, Precision Attack, Menacing Attack). You gain four d8 superiority dice that fuel these maneuvers. You regain all expended dice on a short or long rest. You learn two additional maneuvers at 7th, 10th, and 15th level.",
      },
      {
        name: "Student of War",
        level: 3,
        description: "You gain proficiency with one type of artisan's tools of your choice.",
      },
      {
        name: "Know Your Enemy",
        level: 7,
        description:
          "After observing a creature for 1 minute outside of combat, you learn whether it is your equal, superior, or inferior in two characteristics of your choice (such as Strength score, AC, current HP, total class levels, or fighter class levels).",
      },
      {
        name: "Improved Combat Superiority",
        level: 10,
        description: "Your superiority dice become d10s. At 18th level, they become d12s.",
      },
      {
        name: "Relentless",
        level: 15,
        description:
          "When you roll initiative and have no superiority dice remaining, you regain one superiority die.",
      },
    ],
  },
  {
    index: "eldritch-knight",
    name: "Eldritch Knight",
    className: "Fighter",
    classIndex: "fighter",
    subclassLevel: 3,
    description:
      "A fighter who blends martial combat with arcane magic from the wizard tradition, weaving spells between sword strikes.",
    features: [
      {
        name: "Spellcasting",
        level: 3,
        description:
          "You learn cantrips and spells from the wizard spell list, primarily from the abjuration and evocation schools. Intelligence is your spellcasting ability.",
      },
      {
        name: "Weapon Bond",
        level: 3,
        description:
          "You can bond with up to two weapons. A bonded weapon can't be disarmed, and you can summon it to your hand as a bonus action if it's on the same plane.",
      },
      {
        name: "War Magic",
        level: 7,
        description:
          "When you cast a cantrip, you can make one weapon attack as a bonus action.",
      },
      {
        name: "Eldritch Strike",
        level: 10,
        description:
          "When you hit a creature with a weapon attack, that creature has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn.",
      },
      {
        name: "Arcane Charge",
        level: 15,
        description:
          "When you use Action Surge, you can teleport up to 30 feet to an unoccupied space you can see before or after the additional action.",
      },
      {
        name: "Improved War Magic",
        level: 18,
        description:
          "When you cast a spell of 1st level or higher, you can make one weapon attack as a bonus action.",
      },
    ],
    spellcasting: {
      ability: "Intelligence",
      description:
        "You learn wizard spells, primarily from the abjuration and evocation schools. At certain levels, you can learn spells from any school.",
    },
  },

  // ========== MONK (subclass at level 3) ==========
  {
    index: "open-hand",
    name: "Way of the Open Hand",
    className: "Monk",
    classIndex: "monk",
    subclassLevel: 3,
    description:
      "A monk who perfects unarmed combat techniques, manipulating an opponent's body and ki with devastating precision.",
    features: [
      {
        name: "Open Hand Technique",
        level: 3,
        description:
          "When you hit with a Flurry of Blows attack, you can impose one of these effects: the target must make a Dexterity save or be knocked prone; the target must make a Strength save or be pushed up to 15 feet; or the target can't take reactions until the end of your next turn.",
      },
      {
        name: "Wholeness of Body",
        level: 6,
        description:
          "You can use an action to regain hit points equal to three times your monk level. You must finish a long rest before using this again.",
      },
      {
        name: "Tranquility",
        level: 11,
        description:
          "At the end of a long rest, you gain the effect of a Sanctuary spell until the start of your next long rest. The save DC equals 8 + your Wisdom modifier + your proficiency bonus.",
      },
      {
        name: "Quivering Palm",
        level: 17,
        description:
          "When you hit a creature with an unarmed strike, you can spend 3 ki points to set up lethal vibrations. At any point within a number of days equal to your monk level, you can use an action to end the vibrations. The target must make a Constitution save or be reduced to 0 HP. On a success, it takes 10d10 necrotic damage.",
      },
    ],
  },
  {
    index: "shadow",
    name: "Way of Shadow",
    className: "Monk",
    classIndex: "monk",
    subclassLevel: 3,
    description:
      "A monk who follows the path of darkness, using stealth, subterfuge, and the manipulation of shadows as weapons.",
    features: [
      {
        name: "Shadow Arts",
        level: 3,
        description:
          "You can spend 2 ki points to cast Darkness, Darkvision, Pass Without Trace, or Silence. You also learn the Minor Illusion cantrip.",
      },
      {
        name: "Shadow Step",
        level: 6,
        description:
          "When you are in dim light or darkness, you can use a bonus action to teleport up to 60 feet to another space in dim light or darkness. You have advantage on the first melee attack you make before the end of your turn.",
      },
      {
        name: "Cloak of Shadows",
        level: 11,
        description:
          "When you are in dim light or darkness, you can use your action to become invisible. You remain invisible until you attack, cast a spell, or are in bright light.",
      },
      {
        name: "Opportunist",
        level: 17,
        description:
          "When a creature within 5 feet of you is hit by an attack made by a creature other than you, you can use your reaction to make a melee attack against the target.",
      },
    ],
  },
  {
    index: "four-elements",
    name: "Way of the Four Elements",
    className: "Monk",
    classIndex: "monk",
    subclassLevel: 3,
    description:
      "A monk who channels ki into elemental magic, conjuring fire, water, earth, and air to enhance their martial techniques.",
    features: [
      {
        name: "Disciple of the Elements",
        level: 3,
        description:
          "You learn elemental disciplines that let you spend ki points to cast spells or create magical effects. You start with Elemental Attunement (minor elemental manipulation) and one other discipline of your choice. You learn additional disciplines at 6th, 11th, and 17th level.",
      },
      {
        name: "Elemental Disciplines (examples)",
        level: 3,
        description:
          "Fist of Unbroken Air (creates a blast of compressed air, 3 ki), Sweeping Cinder Strike (creates an arc of fire, 2 ki), Water Whip (creates a whip of water to pull or knock prone, 2 ki), Fangs of the Fire Snake (reach attacks wreathed in flame, 1 ki).",
      },
      {
        name: "Advanced Disciplines",
        level: 6,
        description:
          "At higher levels, you can learn more powerful disciplines such as Flames of the Phoenix (Fireball, 4 ki), Ride the Wind (Fly, 4 ki), and Wave of Rolling Earth (Wall of Stone, 6 ki).",
      },
    ],
  },

  // ========== PALADIN (subclass at level 3) ==========
  {
    index: "devotion",
    name: "Oath of Devotion",
    className: "Paladin",
    classIndex: "paladin",
    subclassLevel: 3,
    description:
      "A paladin sworn to the highest ideals of justice, virtue, and order — the archetypal knight in shining armor.",
    features: [
      {
        name: "Channel Divinity: Sacred Weapon",
        level: 3,
        description:
          "As an action, you imbue one weapon with positive energy for 1 minute. You add your Charisma modifier to attack rolls, it emits bright light in a 20-foot radius, and the weapon counts as magical.",
      },
      {
        name: "Channel Divinity: Turn the Unholy",
        level: 3,
        description:
          "As an action, each fiend or undead within 30 feet must make a Wisdom save or be turned for 1 minute.",
      },
      {
        name: "Aura of Devotion",
        level: 7,
        description:
          "You and friendly creatures within 10 feet can't be charmed while you are conscious. At 18th level, this extends to 30 feet.",
      },
      {
        name: "Purity of Spirit",
        level: 15,
        description: "You are always under the effects of a Protection from Evil and Good spell.",
      },
      {
        name: "Holy Nimbus",
        level: 20,
        description:
          "As an action, you emanate an aura of sunlight for 1 minute. You shed bright light in a 30-foot radius. Enemies starting their turn in the light take 10 radiant damage. You also have advantage on saving throws against spells cast by fiends and undead.",
      },
    ],
  },
  {
    index: "ancients",
    name: "Oath of the Ancients",
    className: "Paladin",
    classIndex: "paladin",
    subclassLevel: 3,
    description:
      "A paladin who swears to protect the light and beauty of the natural world against the forces of darkness and decay.",
    features: [
      {
        name: "Channel Divinity: Nature's Wrath",
        level: 3,
        description:
          "You can use Channel Divinity to cause spectral vines to restrain a creature within 10 feet. The target must make a Strength or Dexterity save or be restrained. It can repeat the save at the end of each of its turns.",
      },
      {
        name: "Channel Divinity: Turn the Faithless",
        level: 3,
        description:
          "You can turn fey and fiends within 30 feet, forcing them to make a Wisdom save or be turned for 1 minute.",
      },
      {
        name: "Aura of Warding",
        level: 7,
        description:
          "You and friendly creatures within 10 feet have resistance to damage from spells. At 18th level, this extends to 30 feet.",
      },
      {
        name: "Undying Sentinel",
        level: 15,
        description:
          "When you are reduced to 0 HP and not killed outright, you drop to 1 HP instead. You can use this once per long rest. You also suffer no penalties from aging and can't be aged magically.",
      },
      {
        name: "Elder Champion",
        level: 20,
        description:
          "As an action, you transform for 1 minute. You regain 10 HP at the start of each turn, your paladin spells have no somatic or material components, and enemies within 10 feet have disadvantage on saves against your spells and Channel Divinity.",
      },
    ],
  },
  {
    index: "vengeance",
    name: "Oath of Vengeance",
    className: "Paladin",
    classIndex: "paladin",
    subclassLevel: 3,
    description:
      "A relentless paladin devoted to punishing those who commit grievous sins, willing to sacrifice their own light to destroy evil.",
    features: [
      {
        name: "Channel Divinity: Abjure Enemy",
        level: 3,
        description:
          "As an action, choose a creature within 60 feet. It must make a Wisdom save or be frightened for 1 minute. Its speed becomes 0. Fiends and undead have disadvantage on this save.",
      },
      {
        name: "Channel Divinity: Vow of Enmity",
        level: 3,
        description:
          "As a bonus action, choose a creature within 10 feet. You gain advantage on attack rolls against that creature for 1 minute.",
      },
      {
        name: "Relentless Avenger",
        level: 7,
        description:
          "When you hit a creature with an opportunity attack, you can move up to half your speed immediately after, without provoking opportunity attacks.",
      },
      {
        name: "Soul of Vengeance",
        level: 15,
        description:
          "When a creature under your Vow of Enmity makes an attack, you can use your reaction to make a melee weapon attack against it.",
      },
      {
        name: "Avenging Angel",
        level: 20,
        description:
          "As an action, you sprout wings (60 ft fly speed) and emanate a menacing aura for 1 hour. When an enemy enters or starts its turn within 30 feet, it must make a Wisdom save or be frightened for 1 minute.",
      },
    ],
  },

  // ========== RANGER (subclass at level 3) ==========
  {
    index: "hunter",
    name: "Hunter",
    className: "Ranger",
    classIndex: "ranger",
    subclassLevel: 3,
    description:
      "A ranger who accepts the challenge of protecting civilization from the threats of the wilderness through specialized combat techniques.",
    features: [
      {
        name: "Hunter's Prey",
        level: 3,
        description:
          "Choose one: Colossus Slayer (deal an extra 1d8 damage once per turn to a creature below its max HP), Giant Killer (use your reaction to attack a Large+ creature that misses you), or Horde Breaker (make one additional attack against a different creature within 5 feet of the original target).",
      },
      {
        name: "Defensive Tactics",
        level: 7,
        description:
          "Choose one: Escape the Horde (opportunity attacks against you have disadvantage), Multiattack Defense (gain +4 AC against subsequent attacks from the same creature), or Steel Will (advantage on saves against being frightened).",
      },
      {
        name: "Multiattack",
        level: 11,
        description:
          "Choose one: Volley (make a ranged attack against any number of creatures within 10 feet of a point within range, with an arrow for each) or Whirlwind Attack (make a melee attack against each creature within 5 feet of you).",
      },
      {
        name: "Superior Hunter's Defense",
        level: 15,
        description:
          "Choose one: Evasion (take no damage on a successful Dex save, half on a failure), Stand Against the Tide (when a creature misses you with a melee attack, you can redirect the attack to another creature), or Uncanny Dodge (halve the damage of an attack that hits you by using your reaction).",
      },
    ],
  },
  {
    index: "beast-master",
    name: "Beast Master",
    className: "Ranger",
    classIndex: "ranger",
    subclassLevel: 3,
    description:
      "A ranger who forms a deep bond with a beast companion, fighting alongside it as a coordinated team.",
    features: [
      {
        name: "Ranger's Companion",
        level: 3,
        description:
          "You gain a beast companion with a CR of 1/4 or lower. It obeys your commands, acts on your turn, and adds your proficiency bonus to its AC, attack rolls, damage rolls, saves, and skills. It can take the Attack, Dash, Disengage, Dodge, or Help action on its turn.",
      },
      {
        name: "Exceptional Training",
        level: 7,
        description:
          "Your companion can Dash, Disengage, Dodge, or Help as a bonus action on your turn. Its attacks count as magical for overcoming resistance and immunity.",
      },
      {
        name: "Bestial Fury",
        level: 11,
        description:
          "Your companion can make two attacks when you command it to take the Attack action.",
      },
      {
        name: "Share Spells",
        level: 15,
        description:
          "When you cast a spell targeting yourself, you can also affect your companion if it's within 30 feet of you.",
      },
    ],
  },

  // ========== ROGUE (subclass at level 3) ==========
  {
    index: "thief",
    name: "Thief",
    className: "Rogue",
    classIndex: "rogue",
    subclassLevel: 3,
    description:
      "A rogue who perfects the arts of larceny, becoming the ultimate burglar, pickpocket, and second-story infiltrator.",
    features: [
      {
        name: "Fast Hands",
        level: 3,
        description:
          "You can use the bonus action granted by Cunning Action to make a Dexterity (Sleight of Hand) check, use thieves' tools to disarm a trap or open a lock, or take the Use an Object action.",
      },
      {
        name: "Second-Story Work",
        level: 3,
        description:
          "Climbing no longer costs extra movement. Your running jump distance increases by a number of feet equal to your Dexterity modifier.",
      },
      {
        name: "Supreme Sneak",
        level: 9,
        description:
          "You have advantage on Dexterity (Stealth) checks if you move no more than half your speed on the same turn.",
      },
      {
        name: "Use Magic Device",
        level: 13,
        description:
          "You can use any magic item regardless of class, race, or level requirements.",
      },
      {
        name: "Thief's Reflexes",
        level: 17,
        description:
          "You can take two turns during the first round of any combat. You take your first turn at your normal initiative and your second turn at your initiative minus 10.",
      },
    ],
  },
  {
    index: "assassin",
    name: "Assassin",
    className: "Rogue",
    classIndex: "rogue",
    subclassLevel: 3,
    description:
      "A deadly rogue specialized in the art of killing, using disguise and poison to eliminate targets with lethal efficiency.",
    features: [
      {
        name: "Bonus Proficiencies",
        level: 3,
        description:
          "You gain proficiency with the disguise kit and the poisoner's kit.",
      },
      {
        name: "Assassinate",
        level: 3,
        description:
          "You have advantage on attack rolls against creatures that haven't taken a turn yet in combat. Any hit you score against a surprised creature is a critical hit.",
      },
      {
        name: "Infiltration Expertise",
        level: 9,
        description:
          "You can spend 7 days and 25 gp to create a false identity, including documentation, established acquaintances, and disguises.",
      },
      {
        name: "Impostor",
        level: 13,
        description:
          "After spending 3 hours studying a person's behavior, speech, and mannerisms, you can mimic them convincingly. Creatures have disadvantage on checks to detect the deception.",
      },
      {
        name: "Death Strike",
        level: 17,
        description:
          "When you hit a surprised creature, it must make a Constitution save (DC 8 + your Dexterity modifier + your proficiency bonus) or the damage is doubled.",
      },
    ],
  },
  {
    index: "arcane-trickster",
    name: "Arcane Trickster",
    className: "Rogue",
    classIndex: "rogue",
    subclassLevel: 3,
    description:
      "A rogue who blends stealth and thievery with enchantment and illusion magic from the wizard tradition, becoming a master of magical misdirection.",
    features: [
      {
        name: "Spellcasting",
        level: 3,
        description:
          "You learn cantrips and spells from the wizard spell list, primarily from the enchantment and illusion schools. Intelligence is your spellcasting ability. You learn Mage Hand as a bonus cantrip.",
      },
      {
        name: "Mage Hand Legerdemain",
        level: 3,
        description:
          "Your Mage Hand is invisible. You can use it to stow or retrieve objects from containers, pick locks, disarm traps, or plant objects on a person — all without being noticed (Sleight of Hand check contested by Perception).",
      },
      {
        name: "Magical Ambush",
        level: 9,
        description:
          "If you are hidden from a creature when you cast a spell on it, the creature has disadvantage on any saving throw against that spell.",
      },
      {
        name: "Versatile Trickster",
        level: 13,
        description:
          "As a bonus action, you can designate a creature within 5 feet of your Mage Hand. You have advantage on attack rolls against that creature until the end of your turn.",
      },
      {
        name: "Spell Thief",
        level: 17,
        description:
          "When a creature casts a spell targeting you or including you in its area, you can use your reaction to force the creature to make a save against your spell DC. On a failure, you negate the spell's effect on you, and you steal knowledge of the spell for 8 hours (you can cast it using your spell slots). The creature can't cast that spell until the 8 hours have passed.",
      },
    ],
    spellcasting: {
      ability: "Intelligence",
      description:
        "You learn wizard spells, focusing on enchantment and illusion. At certain levels, you can choose spells from any wizard school.",
    },
  },

  // ========== SORCERER (subclass at level 1) ==========
  {
    index: "draconic",
    name: "Draconic Bloodline",
    className: "Sorcerer",
    classIndex: "sorcerer",
    subclassLevel: 1,
    description:
      "A sorcerer whose innate magic comes from draconic ancestry, granting them the resilience and elemental power of dragons.",
    features: [
      {
        name: "Dragon Ancestor",
        level: 1,
        description:
          "You choose a dragon type (Black, Blue, Brass, Bronze, Copper, Gold, Green, Red, Silver, or White) that determines your affinity damage type. You can speak, read, and write Draconic. Your Charisma checks have doubled proficiency bonus when interacting with dragons.",
      },
      {
        name: "Draconic Resilience",
        level: 1,
        description:
          "Your HP maximum increases by 1 per sorcerer level. When you aren't wearing armor, your AC equals 13 + your Dexterity modifier.",
      },
      {
        name: "Elemental Affinity",
        level: 6,
        description:
          "When you cast a spell that deals damage of your draconic ancestry type, you add your Charisma modifier to one damage roll. You can also spend 1 sorcery point to gain resistance to that damage type for 1 hour.",
      },
      {
        name: "Dragon Wings",
        level: 14,
        description:
          "You can use a bonus action to sprout dragon wings, gaining a flying speed equal to your current speed. The wings last until you dismiss them.",
      },
      {
        name: "Draconic Presence",
        level: 18,
        description:
          "You can spend 5 sorcery points to emanate an aura of draconic awe or fear in a 60-foot radius for 1 minute. Each hostile creature starting its turn in the aura must make a Wisdom save or be charmed (awe) or frightened (fear).",
      },
    ],
  },
  {
    index: "wild-magic",
    name: "Wild Magic",
    className: "Sorcerer",
    classIndex: "sorcerer",
    subclassLevel: 1,
    description:
      "A sorcerer whose magic is volatile and unpredictable, tapping into raw chaotic forces that can produce spectacular and dangerous side effects.",
    features: [
      {
        name: "Wild Magic Surge",
        level: 1,
        description:
          "After you cast a sorcerer spell of 1st level or higher, the DM can have you roll a d20. On a 1, you roll on the Wild Magic Surge table to create a random magical effect.",
      },
      {
        name: "Tides of Chaos",
        level: 1,
        description:
          "You can gain advantage on one attack roll, ability check, or saving throw. Once used, the DM can trigger a Wild Magic Surge to restore this feature (no d20 roll needed).",
      },
      {
        name: "Bend Luck",
        level: 6,
        description:
          "When another creature you can see makes an attack roll, ability check, or saving throw, you can use your reaction and spend 2 sorcery points to add or subtract 1d4 from the roll.",
      },
      {
        name: "Controlled Chaos",
        level: 14,
        description:
          "When you roll on the Wild Magic Surge table, you roll twice and choose which result to use.",
      },
      {
        name: "Spell Bombardment",
        level: 18,
        description:
          "When you roll damage for a spell and one or more dice show the maximum value, you can reroll one of those dice and add the new roll to the damage total.",
      },
    ],
  },

  // ========== WARLOCK (subclass at level 1) ==========
  {
    index: "fiend",
    name: "The Fiend",
    className: "Warlock",
    classIndex: "warlock",
    subclassLevel: 1,
    description:
      "A warlock bound to a fiendish patron from the lower planes — a demon lord, devil, or other powerful fiend who grants dark power in exchange for service.",
    features: [
      {
        name: "Dark One's Blessing",
        level: 1,
        description:
          "When you reduce a hostile creature to 0 HP, you gain temporary hit points equal to your Charisma modifier + your warlock level.",
      },
      {
        name: "Dark One's Own Luck",
        level: 6,
        description:
          "When you make an ability check or saving throw, you can add a d10 to the roll. You can use this once per short or long rest.",
      },
      {
        name: "Fiendish Resilience",
        level: 10,
        description:
          "At the end of a short or long rest, you can choose one damage type. You have resistance to that type until you choose a different one. Damage from magical weapons or silver weapons ignores this resistance.",
      },
      {
        name: "Hurl Through Hell",
        level: 14,
        description:
          "When you hit a creature with an attack, you can instantly transport it through the lower planes. It disappears and hurtles through a nightmare landscape, taking 10d10 psychic damage at the end of your next turn when it returns. Once per long rest.",
      },
    ],
  },
  {
    index: "archfey",
    name: "The Archfey",
    className: "Warlock",
    classIndex: "warlock",
    subclassLevel: 1,
    description:
      "A warlock whose patron is a powerful fey lord or lady — an ancient being of the Feywild whose motivations are often inscrutable and capricious.",
    features: [
      {
        name: "Fey Presence",
        level: 1,
        description:
          "As an action, you cause each creature in a 10-foot cube originating from you to make a Wisdom save. Those who fail are charmed or frightened by you (your choice) until the end of your next turn. Once per short or long rest.",
      },
      {
        name: "Misty Escape",
        level: 6,
        description:
          "When you take damage, you can use your reaction to turn invisible and teleport up to 60 feet. You remain invisible until the start of your next turn or until you attack or cast a spell. Once per short or long rest.",
      },
      {
        name: "Beguiling Defenses",
        level: 10,
        description:
          "You are immune to being charmed. When another creature attempts to charm you, you can use your reaction to turn the charm back on them. They must make a Wisdom save or be charmed by you for 1 minute.",
      },
      {
        name: "Dark Delirium",
        level: 14,
        description:
          "As an action, choose a creature within 60 feet. It must make a Wisdom save or be charmed or frightened by you for 1 minute. The creature perceives itself as lost in a misty realm, unable to see or hear anything beyond the illusion. Once per short or long rest.",
      },
    ],
  },
  {
    index: "great-old-one",
    name: "The Great Old One",
    className: "Warlock",
    classIndex: "warlock",
    subclassLevel: 1,
    description:
      "A warlock whose patron is a mysterious entity from the far realms — an alien intelligence whose very nature is incomprehensible to mortal minds.",
    features: [
      {
        name: "Awakened Mind",
        level: 1,
        description:
          "You can communicate telepathically with any creature within 30 feet that you can see. You don't need to share a language, but the creature must understand at least one language.",
      },
      {
        name: "Entropic Ward",
        level: 6,
        description:
          "When a creature makes an attack roll against you, you can use your reaction to impose disadvantage on the roll. If the attack misses, your next attack roll against the creature has advantage. Once per short or long rest.",
      },
      {
        name: "Thought Shield",
        level: 10,
        description:
          "Your thoughts can't be read by telepathy or other means unless you allow it. You also have resistance to psychic damage, and when a creature deals psychic damage to you, it takes the same amount.",
      },
      {
        name: "Create Thrall",
        level: 14,
        description:
          "You can touch an incapacitated humanoid and charm it. The charmed creature is under your control. You can communicate telepathically with it as long as you're on the same plane.",
      },
    ],
  },

  // ========== WIZARD (subclass at level 2) ==========
  {
    index: "evocation",
    name: "School of Evocation",
    className: "Wizard",
    classIndex: "wizard",
    subclassLevel: 2,
    description:
      "A wizard who specializes in the raw elemental power of evocation magic, creating devastating blasts of fire, lightning, and force.",
    features: [
      {
        name: "Evocation Savant",
        level: 2,
        description:
          "Copying evocation spells into your spellbook costs half the normal gold and time.",
      },
      {
        name: "Sculpt Spells",
        level: 2,
        description:
          "When you cast an evocation spell that affects other creatures, you can choose a number of creatures equal to 1 + the spell's level. Those creatures automatically succeed on their save and take no damage if they would normally take half.",
      },
      {
        name: "Potent Cantrip",
        level: 6,
        description:
          "When a creature succeeds on a saving throw against your cantrip, it still takes half the cantrip's damage but suffers no additional effect.",
      },
      {
        name: "Empowered Evocation",
        level: 10,
        description:
          "You add your Intelligence modifier to one damage roll of any wizard evocation spell you cast.",
      },
      {
        name: "Overchannel",
        level: 14,
        description:
          "When you cast a wizard spell of 5th level or lower, you can deal maximum damage with it. Using this again before a long rest causes 2d12 necrotic damage per spell level to you, increasing by 1d12 each additional use.",
      },
    ],
  },
  {
    index: "abjuration",
    name: "School of Abjuration",
    className: "Wizard",
    classIndex: "wizard",
    subclassLevel: 2,
    description:
      "A wizard specializing in protective and warding magic, creating barriers and shields to defend against all manner of threats.",
    features: [
      {
        name: "Abjuration Savant",
        level: 2,
        description:
          "Copying abjuration spells into your spellbook costs half the normal gold and time.",
      },
      {
        name: "Arcane Ward",
        level: 2,
        description:
          "When you cast an abjuration spell of 1st level or higher, you create a magical ward that has HP equal to twice your wizard level + your Intelligence modifier. When you take damage, the ward takes the damage instead. When you cast another abjuration spell, the ward regains HP equal to twice the spell's level.",
      },
      {
        name: "Projected Ward",
        level: 6,
        description:
          "When a creature within 30 feet takes damage, you can use your reaction to have your Arcane Ward absorb the damage instead.",
      },
      {
        name: "Improved Abjuration",
        level: 10,
        description:
          "When you cast an abjuration spell that requires an ability check (such as Counterspell or Dispel Magic), you add your proficiency bonus to the check.",
      },
      {
        name: "Spell Resistance",
        level: 14,
        description:
          "You have advantage on saving throws against spells, and you have resistance to the damage of spells.",
      },
    ],
  },
  {
    index: "conjuration",
    name: "School of Conjuration",
    className: "Wizard",
    classIndex: "wizard",
    subclassLevel: 2,
    description:
      "A wizard who masters the art of summoning creatures and objects, and teleporting matter across vast distances.",
    features: [
      {
        name: "Conjuration Savant",
        level: 2,
        description:
          "Copying conjuration spells into your spellbook costs half the normal gold and time.",
      },
      {
        name: "Minor Conjuration",
        level: 2,
        description:
          "As an action, you conjure an inanimate object in your hand or on the ground within 10 feet. It must be no larger than 3 feet on a side and weigh no more than 10 pounds. It is visibly magical, sheds dim light in a 5-foot radius, and disappears after 1 hour, when you use this again, or when it takes or deals damage.",
      },
      {
        name: "Benign Transposition",
        level: 6,
        description:
          "As an action, you can teleport up to 30 feet to an unoccupied space. Alternatively, you can swap places with a willing Small or Medium creature within 30 feet. Once per long rest or until you cast a conjuration spell of 1st level or higher.",
      },
      {
        name: "Focused Conjuration",
        level: 10,
        description:
          "While concentrating on a conjuration spell, your concentration can't be broken by taking damage.",
      },
      {
        name: "Durable Summons",
        level: 14,
        description:
          "Any creature you summon or create with a conjuration spell has 30 temporary hit points.",
      },
    ],
  },
  {
    index: "divination",
    name: "School of Divination",
    className: "Wizard",
    classIndex: "wizard",
    subclassLevel: 2,
    description:
      "A wizard who peers into the future and uncovers hidden truths, bending fate with prophetic visions.",
    features: [
      {
        name: "Divination Savant",
        level: 2,
        description:
          "Copying divination spells into your spellbook costs half the normal gold and time.",
      },
      {
        name: "Portent",
        level: 2,
        description:
          "After a long rest, roll two d20s and record the numbers. You can replace any attack roll, saving throw, or ability check made by you or a creature you can see with one of these rolls. You must choose before the roll. Each portent roll can be used only once.",
      },
      {
        name: "Expert Divination",
        level: 6,
        description:
          "When you cast a divination spell of 2nd level or higher using a spell slot, you regain one expended spell slot of a lower level (up to 5th level).",
      },
      {
        name: "The Third Eye",
        level: 10,
        description:
          "As an action, you gain one of these benefits until your next short or long rest: darkvision 60 feet, ability to see into the Ethereal Plane within 60 feet, ability to read any language, or ability to see invisible creatures and objects within 10 feet.",
      },
      {
        name: "Greater Portent",
        level: 14,
        description: "You roll three d20s for your Portent feature instead of two.",
      },
    ],
  },
  {
    index: "enchantment",
    name: "School of Enchantment",
    className: "Wizard",
    classIndex: "wizard",
    subclassLevel: 2,
    description:
      "A wizard who specializes in the magic of charm and compulsion, bending the wills and emotions of others.",
    features: [
      {
        name: "Enchantment Savant",
        level: 2,
        description:
          "Copying enchantment spells into your spellbook costs half the normal gold and time.",
      },
      {
        name: "Hypnotic Gaze",
        level: 2,
        description:
          "As an action, choose a creature within 5 feet. If it can see or hear you, it must make a Wisdom save or be charmed until the end of your next turn. The charmed creature's speed drops to 0 and it is incapacitated. You can maintain this on subsequent turns with your action. The effect ends if you move more than 5 feet from the creature or it takes damage.",
      },
      {
        name: "Instinctive Charm",
        level: 6,
        description:
          "When a creature within 30 feet attacks you, you can use your reaction to redirect the attack to another creature within the attacker's range (not you or the attacker). The attacker must make a Wisdom save; on a failure, it must target the closest creature. Once per long rest.",
      },
      {
        name: "Split Enchantment",
        level: 10,
        description:
          "When you cast an enchantment spell that targets only one creature, you can have it target a second creature as well.",
      },
      {
        name: "Alter Memories",
        level: 14,
        description:
          "When you cast an enchantment spell that charms a creature, you can alter its memory so it doesn't know it was charmed. Additionally, before the charm ends, you can use your action to make the creature forget some of the time it was charmed (up to 1 + your Charisma modifier hours).",
      },
    ],
  },
  {
    index: "illusion",
    name: "School of Illusion",
    className: "Wizard",
    classIndex: "wizard",
    subclassLevel: 2,
    description:
      "A wizard who crafts intricate illusions that blur the line between reality and fantasy, deceiving all the senses.",
    features: [
      {
        name: "Illusion Savant",
        level: 2,
        description:
          "Copying illusion spells into your spellbook costs half the normal gold and time.",
      },
      {
        name: "Improved Minor Illusion",
        level: 2,
        description:
          "You learn the Minor Illusion cantrip. When you cast it, you can create both a sound and an image with a single casting.",
      },
      {
        name: "Malleable Illusions",
        level: 6,
        description:
          "When you cast an illusion spell with a duration of 1 minute or longer, you can use your action to change the nature of the illusion (using the spell's normal parameters).",
      },
      {
        name: "Illusory Self",
        level: 10,
        description:
          "When a creature makes an attack roll against you, you can use your reaction to create an illusory duplicate that causes the attack to automatically miss. Once per short or long rest.",
      },
      {
        name: "Illusory Reality",
        level: 14,
        description:
          "When you cast an illusion spell of 1st level or higher, you can choose one inanimate, nonmagical object that is part of the illusion and make it real for 1 minute. The object can't deal damage or directly harm anyone.",
      },
    ],
  },
  {
    index: "necromancy",
    name: "School of Necromancy",
    className: "Wizard",
    classIndex: "wizard",
    subclassLevel: 2,
    description:
      "A wizard who delves into the magic of life, death, and undeath, commanding the forces between the living and the dead.",
    features: [
      {
        name: "Necromancy Savant",
        level: 2,
        description:
          "Copying necromancy spells into your spellbook costs half the normal gold and time.",
      },
      {
        name: "Grim Harvest",
        level: 2,
        description:
          "When you kill a creature with a spell of 1st level or higher, you regain HP equal to twice the spell's level (three times for necromancy spells). This doesn't work on undead or constructs.",
      },
      {
        name: "Undead Thralls",
        level: 6,
        description:
          "When you cast Animate Dead, you can target one additional corpse or pile of bones. Undead you create with necromancy spells have additional HP equal to your wizard level and add your proficiency bonus to their damage rolls.",
      },
      {
        name: "Inured to Undeath",
        level: 10,
        description:
          "You have resistance to necrotic damage, and your HP maximum can't be reduced.",
      },
      {
        name: "Command Undead",
        level: 14,
        description:
          "As an action, you can target an undead creature you can see within 60 feet. It must make a Charisma save. On a failure, it becomes friendly to you and follows your commands. Intelligent undead (Int 8+) make the save with advantage and can repeat it periodically.",
      },
    ],
  },
  {
    index: "transmutation",
    name: "School of Transmutation",
    className: "Wizard",
    classIndex: "wizard",
    subclassLevel: 2,
    description:
      "A wizard who studies the magic of transformation, altering the physical properties of creatures, objects, and the world itself.",
    features: [
      {
        name: "Transmutation Savant",
        level: 2,
        description:
          "Copying transmutation spells into your spellbook costs half the normal gold and time.",
      },
      {
        name: "Minor Alchemy",
        level: 2,
        description:
          "You can temporarily transform one object made of wood, stone, iron, copper, or silver into a different one of those materials. The transformation lasts 1 hour or until you lose concentration.",
      },
      {
        name: "Transmuter's Stone",
        level: 6,
        description:
          "You create a transmuter's stone that grants one of these benefits to the bearer: darkvision 60 feet, +10 feet speed, proficiency in Constitution saves, or resistance to one elemental damage type. You can change the benefit when you cast a transmutation spell of 1st level or higher.",
      },
      {
        name: "Shapechanger",
        level: 10,
        description:
          "You add the Polymorph spell to your spellbook. You can cast it without expending a spell slot to transform into a beast with CR 1 or lower. Once per short or long rest.",
      },
      {
        name: "Master Transmuter",
        level: 14,
        description:
          "You can destroy your transmuter's stone to produce one of these effects: transmute a nonmagical object into another nonmagical object of similar size, remove all curses/diseases/poisons from a creature, cast Raise Dead without a spell slot, or reduce a creature's apparent age by 3d10 years.",
      },
    ],
  },
]

/** Get all subclasses for a given class */
export function getSubclassesForClass(classIndex: string): SubclassData[] {
  return subclasses.filter((s) => s.classIndex === classIndex)
}

/** Get a specific subclass by index */
export function getSubclass(index: string): SubclassData | undefined {
  return subclasses.find((s) => s.index === index)
}
