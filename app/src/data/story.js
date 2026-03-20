export const sessions = [
  {
    id: 1,
    title: `Session 1: "Nobody Here Is Acting Suspicious"`,
    duration: "~2 hours",
    sections: [
      {
        title: "Opening Hook",
        type: "readAloud",
        content: `The coastal road ends at a weathered signpost: THORNHAVEN — 1 MILE. The salt wind carries the smell of rotting kelp and something that might be bread, if someone were very bad at baking bread. You were sent by Lord Aldenmere to check on Magistrate Harlan Voss, who hasn't responded to three letters. Simple errand. Quick trip. The kind of job they give to people they don't want around the office for a week.`,
      },
      {
        title: "Arrival at Dusk",
        type: "notes",
        content: `The player arrives at dusk. Thornhaven is quiet — conspicuously, performatively quiet. Two fishermen see the player and immediately start whistling and looking at the sky.

**Running gag:** Every NPC uses the exact same cover story — "The magistrate? Oh, he's ill. Very ill. Terribly ill." — delivered with varying degrees of conviction. Old Tam just says "He's dead" then corrects himself: "ILL. I meant ill. Those words sound alike."`,
      },
      {
        title: "The Salted Eel (Tavern/Inn)",
        type: "location",
        content: `**Berta Gruun** runs the inn. She talks about weather with manic energy when asked about anything else. If Voss is mentioned, she pivots to a 4-minute monologue about cloud formations.

**Clue — Journal Page:** Torn page wedged under a floorboard in the player's room (DC 10 Investigation):
> "...the tides are wrong. V. knows. He's been down to the caves three times this week. I told Lira but she said to keep quiet or—" (torn)
>
> Different handwriting below: "Berta, this is YOUR room, stop leaving these lying around."`,
      },
      {
        title: "Magistrate's Manor",
        type: "location",
        content: `Front door locked. A note pinned in shaky handwriting: "GONE AWAY. VERY ILL. DO NOT ENTER. DEFINITELY NOT KIDNAPPED."

**Getting in:** DC 15 Thieves' Tools or DC 18 Strength.

**Inside:** Looks like someone left mid-sentence. Half-eaten meal. Letter to Lord Aldenmere: "My Lord, I write to warn you of a grave matter concerning the—" and stops. Ink everywhere.

**Clue:** A drawer holds a hand-drawn cave map with one chamber circled and labeled "DO NOT" (rest smudged).`,
      },
      {
        title: "The Docks",
        type: "location",
        content: `**Old Tam** — elderly fisherman, the only honest person in town. Delivers truth with such casual disinterest that it sounds made up.

"Oh aye, they've got a secret society. The Undertow, they call themselves. Meet on Tuesdays. Selen runs it. Terrible name if you ask me. Can I go back to my fish?"

The player may not believe him because of how easy that was. That's the joke. The truth is freely available; no one thinks to just ask Old Tam.`,
      },
      {
        title: "Maren Introduction",
        type: "notes",
        content: `Maren meets the player at the Salted Eel. She's annoyed — she's been waiting for weeks.

She knows:
- Voss has been "ill" for two months (aggressive air quotes)
- Lira Crenn supposedly "left" town
- Her brother Edric has been "going for walks" at 2am`,
      },
      {
        title: "Night Encounter",
        type: "combat",
        content: `**2 Thugs** follow the player — wearing dark cloaks with the spiral wave symbol. They are not stealthy. One sneezes. The other whispers "SHUT UP" loud enough to echo off the cliffs.

They attack if spotted, but fight with the energy of people who did NOT expect actual confrontation.

**If captured (DC 12 Intimidation):** "Look, I just joined for the meetings. Selen said there'd be gold. There has not been gold."

**Loot:** 8 sp each, potion of water breathing (pale blue), Undertow Member Handbook.`,
      },
      {
        title: "Session 1 Goals",
        type: "notes",
        content: `By the end, the player should:
- Know something is very wrong (and very funny) in Thornhaven
- Have leads pointing to the Saltworks, the caves, and Selen Dray
- Be thoroughly charmed by how bad this town is at conspiracy`,
      },
    ],
  },
  {
    id: 2,
    title: `Session 2: "It's Not a Cult, It's a Community Organization"`,
    duration: "~2-3 hours",
    sections: [
      {
        title: "Part 1: Finding Lira",
        type: "notes",
        content: `**Lira Crenn** is held in the basement of the **Old Saltworks**.

**Getting there:**
- Asking around (DC 12 Persuasion) → "Oh, the Saltworks? That's where the cul— the COMMUNITY ORGANIZATION meets."
- Following an Undertow member (DC 14 Stealth, but DC 10 because they keep tripping)
- Maren: "I bet it's the Saltworks. Everything shady in this town happens at the Saltworks."`,
      },
      {
        title: "The Saltworks",
        type: "location",
        content: `**Ground floor:** Dusty, abandoned. Trapdoor (DC 12 Perception) leads down.

**Basement:** Meeting room with table, chairs, and meeting minutes:
> 1. The Plan
> 2. Snack rotation dispute
> 3. Todd keeps telling his wife about meetings — FINAL WARNING TODD

A locked room (DC 13) holds Lira.`,
      },
      {
        title: "Lira Crenn",
        type: "readAloud",
        content: `"Oh wonderful, a rescue. Only three weeks late. I've been subsisting on salt crackers and resentment."`,
      },
      {
        title: "What Lira Knows",
        type: "notes",
        content: `- **Selen Dray** runs the Undertow. Found an ancient stone altar in sea caves.
- Lira was forced to brew water-breathing potions for a flooded chamber.
- "Harlan tried to stop them. He's either in the caves or... look, Selen isn't violent."
- **THE SERIOUS PART:** "But the thing in the caves? That's not a joke. The water moves on its own down there. The inscriptions... I couldn't read them, but they made my teeth ache. Whatever's sealed down there was sealed for a reason."`,
      },
      {
        title: "Saltworks Combat",
        type: "combat",
        content: `**3 Thugs + 1 Cult Fanatic** (Undertow lieutenant — the only competent one)

- One thug is mid-sandwich when the fight starts and fights one-handed for Round 1
- The Cult Fanatic is genuinely dangerous — this is where the tone shifts

**Lieutenant tactics:** Round 1: Spiritual Weapon (bonus) + Hold Person (action). Round 2: Spiritual Weapon + Inflict Wounds (3d10 necrotic!).

**WARNING:** Hold Person + Inflict Wounds can KO a level 3 PC. Pull the combo if unfun.`,
      },
      {
        title: "The Caves",
        type: "notes",
        content: `Sea caves accessible at low tide along the northern cliffs. The player has Voss's map.`,
      },
      {
        title: "Cave Map",
        type: "map",
        content: `ENTRANCE (tidal, wet, slippery)
    |
PASSAGE (60ft, bioluminescent algae)
    |
FORK ──── LEFT: Dead end. Voss is here.
    |
SLOPE DOWN (gets cold, carved symbols)
    |
ALTAR CHAMBER (large, partially flooded)`,
      },
      {
        title: "Finding Voss",
        type: "readAloud",
        content: `"I have been chained to a rock for six weeks by a woman who runs a fish-counting office. Do you have any idea how humiliating that is?"`,
      },
      {
        title: "The Altar Chamber",
        type: "notes",
        content: `**The comedy fades here. This room should feel different.**

- 40ft cavern, half-flooded. Water is unnaturally still — no ripples even when disturbed.
- A **black stone altar** covered in spiral carvings. It radiates cold that feels like loneliness.
- **Selen Dray** is here with **2 Thugs** and **Edric Ashwick** (the reveal).`,
      },
      {
        title: "The Confrontation",
        type: "readAloud",
        content: `"Thornhaven is dying. The fish are gone. The trade routes moved south. In five years this will be a ruin. What's in these caves could change that. Voss wanted to pretend the problem didn't exist. I chose to act."`,
      },
      {
        title: "Confrontation Key Beats",
        type: "notes",
        content: `1. **Selen offers a deal.** "Help me. Share in this. You could be a hero."
2. **Edric sees Maren.** "Maren, I can explain—" / Maren: "Can you? Can you *really*?"
3. **If refused:** Selen sighs like a disappointed manager and orders the attack.`,
      },
      {
        title: "Altar Chamber Combat",
        type: "combat",
        content: `| Enemy | Notes |
|-------|-------|
| **Selen Dray** (Bandit Captain) | Uses altar for cover (AC 17), kicks toward water |
| **2 Thugs** | One clearly doesn't want to be here |
| **Edric** (Guard) | Surrenders at half HP, especially if Maren talks |

**Terrain:** Waist-deep water = difficult terrain in half the room. Altar provides half cover.

**Maren:** Does NOT attack Round 1 (shocked). Player can talk Edric down: Action, DC 13 Persuasion (advantage invoking Maren).

**Reluctant thug:** Address directly with any Persuasion check → he sits down.`,
      },
      {
        title: "After the Fight",
        type: "notes",
        content: `The altar goes dormant. Water recedes. Cold fades to a chill, then nothing.

Selen, if alive, is deflated: "I really thought it would work."`,
      },
    ],
  },
  {
    id: 3,
    title: `Session 3 (Optional): "The Quiet After"`,
    duration: "~1 hour",
    sections: [
      {
        title: "Selen's Fate",
        type: "notes",
        content: `The player decides. No right answer.

- **Turn over to Lord Aldenmere** (Voss wants this) — formal justice, probably imprisonment
- **Let Thornhaven decide** (Maren wants this) — community justice, messy but authentic
- **Let her go** (player's choice) — she's broken, won't try again

Selen's last request: "Just... make sure the town gets help. That part was real. We're dying out here."`,
      },
      {
        title: "Edric's Fate",
        type: "notes",
        content: `Maren asks for leniency: "He's an idiot, but he's my idiot."

Genuine moral choice. No right answer.`,
      },
      {
        title: "Sealing the Cave",
        type: "notes",
        content: `Voss asks for help sealing the entrance.

**Skill Challenge:** 3 successes before 2 failures, DC 13.

Any relevant skill works: Athletics, Nature, Mason's Tools, Arcana, Persuasion, Investigation.

**Success:** Entrance collapses cleanly. Altar buried. Voss exhales.
**Failure:** Partial collapse. Sequel hook more urgent.`,
      },
      {
        title: "The Town Reacts",
        type: "notes",
        content: `- **Old Tam** brings fresh fish and says nothing. (Most touching moment in the campaign.)
- **Berta** apologizes while talking about weather: "I'm sorry I lied. It's supposed to rain Thursday."
- **Todd's wife** approaches the player: "I KNEW it was a cult."`,
      },
      {
        title: "Rewards",
        type: "notes",
        content: `From Voss:
- Letter of commendation
- 100 gp
- Offer of a house in Thornhaven

From Lira:
- 2 Potions of Healing
- 1 Potion of Clarity (advantage on WIS saves, immunity to frightened, 1 hour)`,
      },
      {
        title: "Ending",
        type: "readAloud",
        content: `The road out of Thornhaven is warmer than the road in. Maren walks you to the signpost. "You could stay," she says. Then: "But I'd have to find you housing, and there's paperwork, and honestly I've had enough paperwork for a lifetime." She hands you a carved wooden token — a wave, but not a spiral. "Don't be a stranger." Behind you, you can hear Berta shouting about a lovely sunset. The fishing boats are out again. All eight of them.`,
      },
      {
        title: "Sequel Hook",
        type: "notes",
        content: `The waterlogged tome references other sealed sites along the coast. Thornhaven was just one lock.

Old Tam, if asked: "Aye. There's more." And goes back to his fish.`,
      },
    ],
  },
];
