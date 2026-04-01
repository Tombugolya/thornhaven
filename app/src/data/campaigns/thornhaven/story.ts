import type { Session } from "../../../types/campaign"

export const sessions = [
  {
    id: 1,
    title: `Session 1: "Nobody Here Is Acting Suspicious"`,
    duration: "~2 hours",
    sections: [
      {
        title: "Before You Start",
        type: "dmtip",
        content: `**Take a breath.** Your first session as DM is about setting the mood and having fun — not getting every rule right. Here's what matters tonight:

- **You control the pace.** If a scene is landing, let it breathe. If it's dragging, skip ahead. You'll feel it.
- **Your player's name matters.** Ask them what their character's name is, what they look like, and why they took this job. Even 2 minutes of this makes the whole campaign feel more personal.
- **You will forget rules.** That's fine. If you don't know a ruling, say "Let's say it works like this for now" and move on. Look it up between sessions.
- **The NPCs are your instruments.** You don't need to do perfect voices — just give each one a *feeling*. Berta is nervous. Tam is bored. Maren is tired. That's enough.`,
      },
      {
        title: "Opening Hook",
        type: "readAloud",
        visual: { type: "location", id: "thornhaven-approach" },
        content: `The coastal road ends at a weathered signpost: THORNHAVEN — 1 MILE. The salt wind carries the smell of rotting kelp and something that might be bread, if someone were very bad at baking bread. You were sent by Lord Aldenmere to check on Magistrate Harlan Voss, who hasn't responded to three letters. Simple errand. Quick trip. The kind of job they give to people they don't want around the office for a week.`,
      },
      {
        title: "Setting the Scene",
        type: "dmtip",
        content: `**After reading the hook, pause.** Let the player react. Ask: "What does your character do as they approach the town?" This tells you a lot about how they want to play — cautious, bold, curious.

**Describe with senses, not just sight.** The salt spray on their face. The creak of the signpost. The distant sound of waves. Two or three sensory details are more immersive than a paragraph of visual description.

**The whistling fishermen:** When you describe them, *actually whistle badly* and look at the ceiling. Physical comedy lands harder than describing it. If that feels silly, lean into the silliness — that's the tone of this session.`,
      },
      {
        title: "Arrival at Dusk",
        type: "notes",
        visual: { type: "location", id: "thornhaven-approach" },
        content: `The player arrives at dusk. Thornhaven is quiet — conspicuously, performatively quiet. Two fishermen see the player and immediately start whistling and looking at the sky.

**The natural flow:** The player walks into town → asks around about Voss → gets the "he's ill" runaround → heads to the Salted Eel (the only inn) for the night. They were sent here by Lord Aldenmere with a letter of introduction and enough coin for lodging. They're expected — Maren was told someone was coming.

**Running gag:** Every NPC uses the exact same cover story — "The magistrate? Oh, he's ill. Very ill. Terribly ill." — delivered with varying degrees of conviction. Old Tam just says "He's dead" then corrects himself: "ILL. I meant ill. Those words sound alike."`,
      },
      {
        title: "How to Play the Cover Story",
        type: "dmtip",
        content: `**Commit to the bit.** Every single NPC uses the exact same phrase: "He's ill. Very ill. Terribly ill." The humor comes from repetition. Tips:

- **NPC #1 (any random townsperson):** Delivers it nervously but somewhat convincingly. The player might buy it.
- **NPC #2 (Berta):** Delivers it with manic cheerfulness, then immediately talks about weather. The player starts to suspect.
- **NPC #3 (another townsperson):** Delivers it while visibly sweating. The player knows it's a lie.
- **Old Tam:** "He's dead." Beat. "ILL. I meant ill."

**By NPC #3, the player should be laughing.** That's the signal that the tone is working. If they're not laughing, you might be playing it too straight — push the absurdity further.

**Don't call for Insight checks on the lies.** They're obviously lies. Calling for a roll makes it feel like a puzzle. The comedy is that *everyone is terrible at this* — let the player just see it.`,
      },
      {
        title: "The Salted Eel (Tavern/Inn)",
        type: "location",
        visual: { type: "location", id: "salted-eel" },
        handout: "journal-page",
        content: `The Salted Eel is Thornhaven's only inn. **Berta Gruun** runs it. She's delighted to have a guest — the inn has been virtually empty for months (no visitors in a dying town). She talks about weather with manic energy when asked about anything else. If Voss is mentioned, she pivots to a 4-minute monologue about cloud formations.

**The Room:** Berta gives the player her own room — it's the nicest one, and nobody else is staying here. "Take my room, I insist! I'll sleep in the kitchen. I like the kitchen. It's warm. Anyway, lovely barometric pressure tonight." This matters because the clue below is there *because it's Berta's room* — she's been careless with her own notes.

**Clue — Journal Page:** Torn page wedged under a floorboard in the player's room (DC 10 Investigation):
> "...the tides are wrong. V. knows. He's been down to the caves three times this week. I told Lira but she said to keep quiet or—" (torn)
>
> Different handwriting below: "Berta, this is YOUR room, stop leaving these lying around."`,
      },
      {
        title: "Playing Berta",
        type: "dmtip",
        content: `**Berta's voice:** Bright, too loud, slightly breathless. She's the friend who talks faster when they're nervous. When she pivots to weather, she should sound *relieved* — like a swimmer reaching shore.

**The weather monologue:** Have actual weather facts ready. Say things like "Did you know that cumulonimbus clouds can reach 40,000 feet?" with the enthusiasm of someone who genuinely finds this fascinating. The more specific and passionate, the funnier the deflection.

**If the player pushes her (DC 12 Persuasion or DC 14 Intimidation):** She breaks down fast. She's not brave — she's scared. Play the crack in her voice. "Fine! FINE. I know things. I know *terrible* things..."

**The journal page:** Don't hand it to them. Have the floorboard creak when they step on it. If they don't investigate, Maren can mention the room "has a loose board — watch your step." The second handwriting ("Berta, this is YOUR room") is the comedy kicker — let them discover it.`,
      },
      {
        title: "Magistrate's Manor",
        type: "location",
        visual: { type: "location", id: "magistrates-manor" },
        handout: [
          { id: "manor-note", buttonText: "Note" },
          { id: "unfinished-letter", buttonText: "Letter" },
          { id: "cave-map", buttonText: "Map" },
        ],
        content: `Front door locked. A note pinned in shaky handwriting: "GONE AWAY. VERY ILL. DO NOT ENTER. DEFINITELY NOT KIDNAPPED."

**Getting in:** DC 15 Thieves' Tools or DC 18 Strength.

**Inside:** Looks like someone left mid-sentence. Half-eaten meal. Letter to Lord Aldenmere: "My Lord, I write to warn you of a grave matter concerning the—" and stops. Ink everywhere.

**Clue:** A drawer holds a hand-drawn cave map with one chamber circled and labeled "DO NOT" (rest smudged).`,
      },
      {
        title: "When the Player Can't Get In",
        type: "dmtip",
        handout: "unfinished-letter",
        content: `**If they fail the lock/strength check:** Don't dead-end them. Options:
- A window in the back is cracked open (DC 10 Athletics to climb through)
- Maren knows where the spare key is hidden ("Under the third flowerpot. Everyone knows.")
- They can come back later — the clues inside are useful but not essential

**General rule for DCs:** If failing a check would stop the story, don't ask for a roll. Rolls are for *how well* something goes, or for things that *could* go either way. The player *will* eventually get into this house — the question is just how.

**Reading the "DEFINITELY NOT KIDNAPPED" note aloud:** Deadpan delivery. Let the player process it. Then just wait. The comedy is in the silence after.`,
      },
      {
        title: "The Docks",
        type: "location",
        visual: { type: "location", id: "the-docks" },
        content: `**Old Tam** — elderly fisherman, the only honest person in town. Delivers truth with such casual disinterest that it sounds made up.

"Oh aye, they've got a secret society. The Undertow, they call themselves. Meet on Tuesdays. Selen runs it. Terrible name if you ask me. Can I go back to my fish?"

The player may not believe him because of how easy that was. That's the joke. The truth is freely available; no one thinks to just ask Old Tam.`,
      },
      {
        title: "Playing Old Tam",
        type: "dmtip",
        content: `**Tam's voice:** Low, flat, unhurried. He speaks like he's ordering lunch. There should be zero emotion in his delivery of earth-shattering information. Think of the most bored person you've ever met, then make them 30% more bored.

**The irony:** Tam gives the player *everything they need* for free. Name, location, schedule. Most players won't believe it because they expect mysteries to be hard. If they dismiss it, that's perfect — they'll feel brilliantly stupid when they realize later that Tam was right.

**If they DO believe him:** Great! They're ahead of schedule. That's fine. Knowing the Undertow exists doesn't mean they know where Voss is or what the altar does. The mystery has layers.

**End every Tam interaction with him trying to go back to fishing.** "Can I go back to my fish?" should be his exit line every single time.`,
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
        title: "Establishing Maren",
        type: "dmtip",
        content: `**Maren is your most important NPC.** She's with the player the entire campaign. Getting her right early matters.

**Her voice:** Flat and dry. She states absurd things without inflection. Imagine someone texting "lol" with a straight face. That's Maren.

**How to use her in play:**
- **She follows, she doesn't lead.** Ask the player "Where do you want to go?" not "Maren suggests going to..."
- **She reacts.** When something absurd happens, Maren sighs. When combat starts, she draws her sword without comment. Her reactions validate the player's experience.
- **She drops hints when the player is stuck.** But make them sound like complaints, not directions: "I wonder what's in the Saltworks. Besides salt. And crime."

**Don't make her too competent.** She's the sidekick, not the protagonist. She should make the player feel smart, not carried.

**The air quotes are important.** When Maren says Voss is "ill," physically make air quotes. It's a character beat that establishes she doesn't buy any of this.`,
      },
      {
        title: "Night Encounter",
        type: "combat",
        visual: { type: "combat", id: "night-encounter" },
        handout: "thug-handbook",
        content: `**2 Thugs** follow the player — wearing dark cloaks with the spiral wave symbol. They are not stealthy. One sneezes. The other whispers "SHUT UP" loud enough to echo off the cliffs.

They attack if spotted, but fight with the energy of people who did NOT expect actual confrontation.

**If captured (DC 12 Intimidation):** "Look, I just joined for the meetings. Selen said there'd be gold. There has not been gold."

**Loot:** 8 sp each, potion of water breathing (pale blue), Undertow Member Handbook.`,
      },
      {
        title: "Running Your First Combat",
        type: "dmtip",
        content: `**Combat in D&D goes like this:**
1. **Roll Initiative.** Everyone rolls a d20 + DEX modifier. Highest goes first. Write the order down.
2. **On each turn:** The creature can **Move** (up to their speed) and take one **Action** (usually Attack) and possibly a **Bonus Action**.
3. **To attack:** Roll d20 + attack bonus. If it meets or beats the target's AC, it hits. Roll damage.
4. **Repeat** until one side is down or flees.

**For THIS fight specifically:**
- It should take 2-3 rounds. These thugs are not tough.
- Maren fights alongside the player. On her turns: she attacks the nearest thug with her longsword (+4 to hit, 1d8+2 damage). Keep her simple.
- **Don't forget Pack Tactics** — thugs get advantage if an ally is near the target. But also, these thugs are incompetent, so it's okay to "forget" sometimes for comedy.

**Keep it fast.** Narrate the hits cinematically but briefly: "Your sword catches the thug across the shoulder — he yelps and stumbles back." Don't spend 30 seconds on every swing.

**When a thug drops to 10 HP or below:** Have them try to surrender or flee. "Wait wait wait — I yield! I YIELD!" This is funnier than fighting to the death and gives the player a chance to interrogate.

**If the player is struggling:** Maren uses her Defender reaction (impose disadvantage on an attack against the player). Describe it: "Maren steps in front of you, shield raised — the mace glances off it."`,
      },
      {
        title: "Session 1 Goals",
        type: "notes",
        content: `By the end, the player should:
- Know something is very wrong (and very funny) in Thornhaven
- Have leads pointing to the Saltworks, the caves, and Selen Dray
- Be thoroughly charmed by how bad this town is at conspiracy`,
      },
      {
        title: "Ending Session 1",
        type: "dmtip",
        content: `**How to close:** After the night encounter (or whenever energy is fading), find a natural stopping point. Good options:
- The player returns to the Salted Eel to rest. Berta anxiously asks about the noise outside. "Was that... fighting? In MY town? Anyway, lovely evening. Stars are out."
- Maren says goodnight with "Get some sleep. Tomorrow we figure out what this town is actually hiding." (She says it like she already knows it'll be exhausting.)

**Between sessions:** Think about what the player seemed most interested in. Did they love talking to NPCs? Give them more of that in Session 2. Did they charge straight for clues? Front-load the Saltworks. **Follow their energy.**`,
      },
    ],
  },
  {
    id: 2,
    title: `Session 2: "It's Not a Cult, It's a Community Organization"`,
    duration: "~2-3 hours",
    sections: [
      {
        title: "Session 2 Pacing",
        type: "dmtip",
        content: `**This is the big session.** It has three acts:
1. **Investigation** (~45 min) — Finding and rescuing Lira from the Saltworks
2. **Exploration** (~30 min) — Entering the sea caves, finding Voss
3. **Climax** (~45 min) — The altar chamber confrontation

**Key pacing note:** The tone shifts from comedy to genuine tension during this session. The Saltworks rescue is still funny (sandwich thug, meeting minutes). The caves are where things get serious. **Don't rush the transition** — let the player feel the atmosphere change.

**Start Session 2 by asking:** "Last time, you discovered [recap what they found]. Where do you want to go first?" This reminds them of their leads and puts them in the driver's seat.`,
      },
      {
        title: "Part 1: Finding Lira",
        type: "notes",
        visual: { type: "location", id: "old-saltworks" },
        content: `**Lira Crenn** is held in the basement of the **Old Saltworks**.

**Getting there:**
- Asking around (DC 12 Persuasion) → "Oh, the Saltworks? That's where the cul— the COMMUNITY ORGANIZATION meets."
- Following an Undertow member (DC 14 Stealth, but DC 10 because they keep tripping)
- Maren: "I bet it's the Saltworks. Everything shady in this town happens at the Saltworks."`,
      },
      {
        title: "The Saltworks",
        type: "location",
        visual: { type: "location", id: "old-saltworks" },
        handout: "meeting-minutes",
        content: `**Ground floor:** Dusty, abandoned. Trapdoor (DC 12 Perception) leads down.

**Basement:** Meeting room with table, chairs, and meeting minutes:
> 1. The Plan
> 2. Snack rotation dispute
> 3. Todd keeps telling his wife about meetings — FINAL WARNING TODD

A locked room (DC 13) holds Lira.`,
      },
      {
        title: "The Meeting Minutes",
        type: "dmtip",
        handout: [
          { id: "meeting-minutes", buttonText: "Minutes" },
          { id: "coded-notes", buttonText: "Cipher" },
        ],
        content: `**Read the meeting minutes aloud like a bored secretary.** Monotone voice. "Item one: The Plan. Item two: Snack rotation dispute. Item three: Todd keeps telling his wife about meetings — FINAL WARNING TODD."

This is one of the biggest comedy moments in the campaign. The contrast between "secret evil society" and "HOA with meeting minutes about snack disputes" is the whole joke. Sell it.

**If the player searches the room:** They can also find a coded note (the alphabet shifted by 1 — A=B, B=C, etc.) and a lockbox with 25 gp. The code is intentionally trivial. These people are not criminal masterminds.`,
      },
      {
        title: "Saltworks Combat",
        type: "combat",
        visual: { type: "combat", id: "saltworks-rescue" },
        content: `**3 Thugs + 1 Cult Fanatic** (Undertow lieutenant — the only competent one)

- One thug is mid-sandwich when the fight starts and fights one-handed for Round 1
- The Cult Fanatic is genuinely dangerous — this is where the tone shifts

**Lieutenant tactics:** Round 1: Spiritual Weapon (bonus) + Hold Person (action). Round 2: Spiritual Weapon + Inflict Wounds (3d10 necrotic!).

**WARNING:** Hold Person + Inflict Wounds can KO a level 3 PC. Pull the combo if unfun.`,
      },
      {
        title: "Running the Saltworks Fight",
        type: "dmtip",
        content: `**The sandwich thug:** Describe him mid-bite when combat starts. "A thug sitting on a crate freezes, half a sandwich in his mouth. He slowly reaches for his mace with his free hand, still chewing." On Round 1, he has disadvantage because he's fighting one-handed. On Round 2, he drops the sandwich (describe the reluctant look on his face) and fights properly.

**The Lieutenant is the real threat.** Play her differently from the thugs — calm voice, deliberate movements. While the thugs panic, she just... assesses.

**If Hold Person lands on the PC:** This is scary. The player is paralyzed and the lieutenant is moving in for Inflict Wounds (3d10!). You have a choice:
- **If the player is having fun and has enough HP:** Let it hit. It's a dramatic moment. Maren can heal them next turn.
- **If it would knock them unconscious:** Have the lieutenant use Command (Flee) instead. "She points at you and speaks a single word: *KNEEL.*" Still dramatic, less lethal.

**The thugs should drop fast.** They're distractions. Focus the drama on the lieutenant.`,
      },
      {
        title: "Lira Crenn",
        type: "readAloud",
        visual: { type: "character", id: "lira" },
        content: `"Oh wonderful, a rescue. Only three weeks late. I've been subsisting on salt crackers and resentment."`,
      },
      {
        title: "Playing Lira",
        type: "dmtip",
        content: `**Lira's voice:** Fast, sharp, clipped. She talks like she's giving a lecture that's already running over. Every sentence is a complaint wrapped in expertise.

**The key moment with Lira is the tonal shift.** She's sarcastic and funny for the first few lines. Then you ask about the altar, and her demeanor changes. She gets quiet. She stops joking.

**How to play the shift:** Slow down your speaking speed. Drop the rapid-fire delivery. Look the player in the eye (or at the camera if online). When she says "The water moves on its own down there," say it simply. No dramatic voice. Just... a person who is scared and trying not to show it.

**That quiet moment is what makes the caves feel dangerous later.** If the scariest NPC — the angry, sarcastic scientist — is genuinely afraid, the player will be too.`,
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
        title: "Transition to the Caves",
        type: "dmtip",
        content: `**After the Saltworks fight, the player needs to go to the caves.** Lira provides the motivation: Voss is down there, and whatever Selen is doing needs to stop.

**Let the player rest first if they want.** A short rest (1 hour) lets them spend Hit Dice and recover abilities. Narratively: they sit in the Saltworks, Lira brews them a Potion of Clarity, Maren sharpens her sword. It's a calm before the storm.

**The walk to the caves should feel different.** Describe the change: the town noise fading, the path getting rougher, the air getting colder. You're transitioning from comedy to something else. **Take your time with descriptions here.** No jokes. Just atmosphere.`,
      },
      {
        title: "The Caves",
        type: "notes",
        visual: { type: "location", id: "cave-entrance" },
        content: `Sea caves accessible at low tide along the northern cliffs. The player has Voss's map.`,
      },
      {
        title: "Cave Map",
        type: "map",
        visual: { type: "location", id: "cave-entrance" },
        content: `ENTRANCE (tidal, wet, slippery)
    |
PASSAGE (60ft, bioluminescent algae)
    |
FORK ──── LEFT: Dead end. Voss is here.
    |
SEALED DOOR (carved spirals, partially breached)
    |
SLOPE DOWN (gets cold, carved symbols)
    |
ALTAR CHAMBER (large, partially flooded)`,
      },
      {
        title: "Making the Caves Feel Real",
        type: "dmtip",
        content: `**Use sensory details to build dread:**
- **Entrance:** The player's boots splash in tidal pools. The cave mouth is dark. Their torch/light catches on wet stone. The sound of the sea becomes muffled, then disappears.
- **Passage:** Bioluminescent algae gives everything a pale blue glow. It's beautiful but wrong — the light pulses slowly, like breathing. Describe the algae on the walls, on the ceiling, reflecting in standing water.
- **Fork:** The player has the map. Left path or continue down. Let them choose. If they go left, they find Voss first (good — he provides context before the climax).
- **Slope down:** It gets colder. Not temperature cold — *lonely* cold. The carved symbols on the walls are spirals. They seem to continue when you're not looking at them.

**No skill checks in the caves unless something specific happens.** Don't ask for Perception rolls every 30 seconds — it kills the atmosphere. Just describe what they see and feel. Let the tension build through narration, not dice.

**Speak more quietly.** Literally lower your voice when describing the caves. The player will lean in. That's immersion.`,
      },
      {
        title: "The Sealed Door",
        type: "readAloud",
        handout: "spiral-puzzle",
        content: `The passage narrows and then stops. A circular stone door fills the tunnel from floor to ceiling, carved with three concentric rings of symbols. The rings sit in grooves worn smooth by time. At the top of the door, a wedge-shaped keystone juts from the rock. Something about the symbols makes your eyes want to slide past them.

The Undertow has been here — pry marks score the edges where someone tried to force the door. One section of the wall beside it has been crudely broken through, barely wide enough to squeeze past.`,
      },
      {
        title: "Running the Door Puzzle",
        type: "dmtip",
        content: `**The sealed door is an interactive puzzle the player solves on their screen.** Click the "Handout" button above to send it. Each ring rotates when clicked — the player needs to align the three water-themed runes at the keystone marker.

**Solution:** Wave (outer), Spiral (middle), Droplet (inner) — all aligned at the top.

**If the player struggles:** Hint that "the sea-themed markings seem more deeply carved than the others" or "the keystone at the top looks like it's meant to receive something."

**This puzzle is optional.** The Undertow already broke through the wall beside the door. If the player wants to skip it, they can squeeze through the breach — but they miss the inscription, the reward item, and a strong piece of evidence against Selen.

**The flow:**
1. Read the Sealed Door description aloud
2. Send the puzzle to the player's screen (Handout button above)
3. Let them work it out — correct runes glow faintly blue-green when aligned at the keystone
4. When they solve it, you'll get a notification and the inscription appears on their screen
5. Read "After the Door Opens" below, then show the inscription handout for reference`,
      },
      {
        title: "After the Door Opens",
        type: "readAloud",
        handout: "door-inscription",
        content: `The rings grind into alignment with a sound like the sea dragging across shingle. The door doesn't swing open — it sinks into the floor, one ring at a time, outer to inner, grinding stone against stone until only a dark archway remains.

Above the opening, carved deep into the lintel, words glow with the same pale blue-green light as the algae — but steadier, brighter, as if the stone itself is remembering something it was told to say.

In a small alcove to the right of the doorway, set into a carved niche like it was left there on purpose, a flat disc of dark stone hangs from a leather cord on a stone hook. The spiral carved into it turns the wrong way — counter to every other spiral in these caves.`,
      },
      {
        title: "The Founders' Warning",
        type: "dmtip",
        content: `**Show the inscription handout** to the player (button above) so they can read it in full. The smaller text below the main warning is the real payoff — it reveals that Thornhaven was built *on purpose* above the caves, not just nearby by coincidence.

**The Tideward Amulet** is the reward for solving the puzzle. When the player picks it up:
- It's a flat dark stone disc on a leather cord, carved with a counter-spiral (opposite to the altar's spirals)
- While wearing it in the sea caves: advantage on Wisdom saving throws, immunity to the frightened condition
- The cold from the altar doesn't reach them — describe it as steady warmth spreading from the stone against their chest
- **This matters in the confrontation.** If the altar reacts, the amulet shields the wearer. Selen doesn't have one. That gap is the point — the founders prepared defenses for those who understood the danger, not for those who ignored it
- Consider granting **Inspiration** for solving the puzzle

**The lore (for your reference — share as much or as little as you want):**

Thornhaven wasn't founded as a fishing village. It was built as a watchtower. Centuries ago, a group of coastal scholars discovered what lay beneath the caves — not a creature exactly, but a presence. A vast, patient awareness in the deep water that had been there since before the land was land. They couldn't destroy it. They couldn't move it. So they sealed it.

The altar is the lock. The caves are the vault. The town is the guard post. Generation after generation, the founding families kept watch — until they didn't. The knowledge faded into folklore. The folklore became superstition. The superstition became nothing. By the time Selen found the caves, no one in Thornhaven remembered why the town was really there.

**You don't need to explain all of this.** The inscription, the amulet, and the cave itself tell the story. But knowing it helps you improvise if the player asks — like "What is it?" Answer: nobody knows. Not even the founders. They just knew enough to be afraid.`,
      },
      {
        title: "Finding Voss",
        type: "readAloud",
        visual: { type: "character", id: "voss" },
        handout: "voss-complaints",
        content: `"I have been chained to a rock for six weeks by a woman who runs a fish-counting office. Do you have any idea how humiliating that is?"`,
      },
      {
        title: "Playing Voss",
        type: "dmtip",
        content: `**Voss is comic relief in a dark place — and that's the point.** His outrage is absurd and dignified and exactly what the player needs before the serious climax. He lightens the mood just enough that the contrast with the altar hits harder.

**His voice:** Clipped, precise, indignant. Think of a professor who's been asked to wait in line. He enunciates every word.

**Key lines to deliver:**
- "I have written three formal complaints. On rocks. With a smaller rock. They were not acknowledged."
- "She gave me a blanket. She actually said 'It's not inhumane.'"

**He can walk but barely.** Three levels of exhaustion. He's slow, woozy, and insists on coming anyway. He should be a liability in combat, not an asset — don't let him steal the player's thunder.`,
      },
      {
        title: "The Altar Chamber",
        type: "notes",
        visual: { type: "location", id: "altar-chamber" },
        content: `**The comedy fades here. This room should feel different.**

- 40ft cavern, half-flooded. Water is unnaturally still — no ripples even when disturbed.
- A **black stone altar** covered in spiral carvings. It radiates cold that feels like loneliness.
- **Selen Dray** is here with **2 Thugs** and **Edric Ashwick** (the reveal).`,
      },
      {
        title: "Describing the Altar Chamber",
        type: "dmtip",
        content: `**This is the most important description in the campaign.** Take your time. Read this slowly:

"You step into a cavern. It's large — forty feet across at least. Half of it is flooded with dark water. The water... doesn't move. You can see your torchlight reflected in it, but the surface is perfectly still. No ripples. Nothing.

At the far end, rising from the stone floor, is an altar. Black stone. Covered in spiral carvings that seem to continue at the edge of your vision. It's cold in here — not the cold of a cave. Something else. Like the feeling you get in an empty house. Like the room itself is lonely."

**Then pause.** Let the player sit with that for a moment before you introduce Selen.

**The water detail matters.** If the player tries to touch the water or throw something in, it *doesn't ripple.* Describe the object sinking without disturbing the surface. Don't explain why. The not-knowing is scarier than any explanation.`,
      },
      {
        title: "The Confrontation",
        type: "readAloud",
        visual: { type: "character", id: "selen" },
        content: `"Thornhaven is dying. The fish are gone. The trade routes moved south. In five years this will be a ruin. What's in these caves could change that. Voss wanted to pretend the problem didn't exist. I chose to act."`,
      },
      {
        title: "Selen Addresses the Danger",
        type: "readAloud",
        content: `"I know what the inscriptions say. 'Do not wake.' 'The patient tide.' Warnings carved by people who were afraid of what they didn't understand. I've studied this altar for months. It's not a monster — it's a source. Power that the founders were too cowardly to use. I'm not afraid of it. And neither should you be."`,
      },
      {
        title: "The Pushback",
        type: "notes",
        content: `**Voss** (if freed at the fork): "She's found a lock and she's trying to open it. The founders built this entire town to keep people *away* from what's below. That's not cowardice — that's a warning we're too arrogant to hear."

**Maren** (looking at the water): "Selen. Look at the water. It doesn't move. Whatever's down here — does that look like something you *control*?"

**Selen's response:** "The water has been like that for centuries. Nothing has happened. Nothing will happen — unless we waste this chance arguing about superstition."

The player now has both sides. Selen's argument: it's dormant, it's safe, the town needs this. The counter-argument: the founders sealed it for a reason, and the cave itself feels deeply wrong. **Let the player decide.**`,
      },
      {
        title: "Playing the Confrontation",
        type: "dmtip",
        content: `**Selen is NOT giving a villain speech.** She's making a case. She's calm, reasonable, and — here's the kicker — she's *right* about the problem. Thornhaven IS dying. She's just wrong about the solution.

**Deliver her lines like a town council presentation.** Not dramatic. Not threatening. Just... a tired woman explaining why she did what she did. The player should feel uncomfortable because she makes *sense*.

**The key difference from a typical D&D villain:** Selen genuinely doesn't believe the altar is dangerous. She's not reckless — she's convinced. She's done her research (badly). She's rationalized every warning sign. That's what makes her tragic, not evil.

**Then the offer:** "Help me. Share in this. You could be a hero — the person who saved Thornhaven." Pause. Let the player respond. **Do not rush past this.** Some players will genuinely consider it. That's good. That means Selen worked.

**The Edric reveal:** After Selen's pitch, describe: "And behind her, holding a spear with the posture of someone trying very hard to look brave... you see a young man with Maren's jawline." Then look at the player and wait. Maren's reaction: "...Oh. Oh, you *absolute* —"

**This is the emotional climax.** The altar is scary, but Maren seeing her brother on the wrong side is what makes it *personal*. Give it space.`,
      },
      {
        title: "If the Player Agrees with Selen",
        type: "dmtip",
        content: `**This can happen — and that's fine.** Selen is persuasive. If the player says "OK, let's try it" or even hesitates, here's what happens:

**The altar reacts.** The moment anyone moves toward it with intent, the cave responds:
- The still water *shudders* — not ripples, a single convulsive movement, like something beneath the surface turned over in its sleep.
- The temperature drops sharply. Breath becomes visible.
- The spiral carvings on the altar glow faintly — not warm light, but cold, like bioluminescence draining of color.
- Everyone feels it: a pressure in their chest, a ringing in their ears, a sudden certainty that something *noticed them*.

Then it stops. Everything goes still again. But the message is clear: **this thing is aware, and approaching it is waking it up.**

**Selen's reaction:** She hesitates — for the first time all campaign, she looks uncertain. Then she sets her jaw: "That's... it's a defense mechanism. It's trying to scare us away. We push through." She's doubling down because admitting she's wrong means everything she did — the kidnapping, the cult, the crimes — was for nothing.

**Maren:** "That wasn't a defense mechanism. That was something *breathing.*"

**This gives the player a clear, visceral reason to refuse** even if they sympathized with Selen. The cave itself just told them no. If they STILL want to proceed, Maren refuses and draws her sword — "I'm not letting you open that thing." Combat begins with Maren on the player's... well, on the side of not ending the world.

**Most players will change their mind after the altar reacts.** That's the design — give them a way to agree, then show them why they shouldn't, then let them choose again. No one feels railroaded because the *world* argued back, not the DM.`,
      },
      {
        title: "Confrontation Key Beats",
        type: "notes",
        content: `1. **Selen makes her case.** The town is dying. The altar is the answer. The warnings are just fear.
2. **Voss/Maren push back.** The founders sealed this for a reason. The water doesn't move. This feels wrong.
3. **Selen offers a deal.** "Help me. Share in this. You could be a hero."
4. **Edric sees Maren.** "Maren, I can explain—" / Maren: "Can you? Can you *really*?"
5. **If refused:** Selen shakes her head — "Then I'll do it without you." She turns back toward the altar. The player must stop her physically. Combat begins.
6. **If agreed:** The altar reacts (see DM tip above). The cave itself vetoes the plan. Selen doubles down. The player must now choose again with new information.`,
      },
      {
        title: "Altar Chamber Combat",
        type: "combat",
        visual: { type: "combat", id: "altar-chamber" },
        content: `| Enemy | Notes |
|-------|-------|
| **Selen Dray** (Bandit Captain) | Uses altar for cover (AC 17), kicks toward water |
| **2 Thugs** | One clearly doesn't want to be here |
| **Edric** (Guard) | Surrenders at half HP, especially if Maren talks |

**Terrain:** Waist-deep water = difficult terrain in half the room. Altar provides half cover.

**Maren:** Does NOT attack Round 1 (shocked). Player can talk Edric down: Action, DC 13 Persuasion (advantage invoking Maren).

**One thug can be talked down:** Address directly with any Persuasion check → he sits down.`,
      },
      {
        title: "Running the Final Fight",
        type: "dmtip",
        content: `**This fight has three layers happening at once.** Don't worry — just track them in order:

**Layer 1 — The tactical fight:** Selen is dangerous (3 attacks per turn, Parry reaction). She uses the altar for cover and kicks people into the water. Focus her aggression on the PC, not Maren.

**Layer 2 — The social fight:** Edric can be talked down. The reluctant thug can be persuaded. Mid-combat Persuasion is an Action (the player gives up their attack to try talking). Reward this — it's more interesting than just hitting things.

**Layer 3 — The emotional fight:** Maren is frozen Round 1. She's watching her brother in a cave with criminals. On Round 2, she starts fighting but avoids Edric. If the player talks to Edric, Maren is visibly grateful.

**How combat starts:** Selen turns back toward the altar — "Then I'll do it without you." The player has to physically stop her. If they grab her or move to block her, she draws her cutlass. It's not a rage — it's a decision. She's choosing the altar over reason. The thugs and Edric follow her lead, uncertainly.

**Round-by-round suggestions:**
- **Round 1:** Selen attacks (she committed to this path). Edric hesitates. Maren freezes. Thug attacks. Set the scene.
- **Round 2:** Player should have a chance to talk to Edric or the reluctant thug. Selen shoves someone toward the water.
- **Round 3+:** Things resolve. Edric surrenders. The reluctant thug sits down. It comes down to Selen.

**Selen surrenders only when:** Edric is down AND she's below 20 HP. She says it with dignity: "Enough. This is over."

**After the fight:** Slow way down. Describe the altar going quiet. The water receding. The cold fading. Let the player catch their breath. Then Selen, if alive: "I really thought it would work." Say it softly.`,
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
        title: "Session 3 Tone",
        type: "dmtip",
        content: `**This session is quiet.** No combat. No puzzles. Just consequences, conversations, and closure. It matters more than you'd think.

**Your job here:** Present choices, not answers. The player decides what happens to Selen and Edric. You present the options and the arguments on each side. Then you wait.

**Don't rush.** If the player wants to think for five minutes, let them. If they want to talk to every NPC, let them. This is the payoff for everything they've built.`,
      },
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
        title: "Presenting the Choice",
        type: "dmtip",
        content: `**Have Voss and Maren argue — gently.** Not a shouting match. Two reasonable people who disagree:

**Voss:** "She kidnapped a magistrate. That's a crime. There are laws, and those laws exist for a reason. Lord Aldenmere needs to know."

**Maren:** "Aldenmere takes six weeks to answer a letter. You think he'll care about a fishing village? Let the town handle this. We know Selen. We know what she did and why."

**Neither is wrong.** Make sure the player feels that. Then ask: "What do you want to do?" And wait.

**Selen's line — "Just... make sure the town gets help"** — should land as genuine. She's not bargaining. She's asking for the one thing she actually cared about. Deliver it quietly, sincerely, with no manipulation in the voice.`,
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
        title: "How Skill Challenges Work",
        type: "dmtip",
        content: `**A skill challenge is a series of rolls toward a goal.** The player needs 3 successes before 2 failures, all DC 13.

**How to run it:**
1. Describe the task: "Voss leads you to the cave entrance. The rock here is cracked and unstable. He needs help bringing it down safely."
2. Ask the player: "How do you want to help?" Let them choose their approach.
3. They describe what they do, you tell them what to roll.

**Example approaches:**
- "I push the loose boulders" → Athletics check
- "I look for structural weak points" → Investigation or Nature
- "I use magic to reinforce the collapse" → Arcana
- "I convince nervous townspeople to help carry stones" → Persuasion
- Maren can assist (giving advantage) on one roll

**Narrate each roll.** Success: "The boulder shifts and falls exactly where you aimed — dust clouds, rumbling, but controlled." Failure: "The rock slips sideways, crashing in the wrong direction. Voss winces."

**On final success:** The cave mouth collapses in a satisfying rumble. The air goes still. Voss puts his hand on the sealed stone and exhales like he's been holding his breath for six weeks. Because he has.`,
      },
      {
        title: "The Town Reacts",
        type: "notes",
        content: `- **Old Tam** brings fresh fish and says nothing. (Most touching moment in the campaign.)
- **Berta** apologizes while talking about weather: "I'm sorry I lied. It's supposed to rain Thursday."
- **Todd's wife** approaches the player: "I KNEW it was a cult."`,
      },
      {
        title: "Landing the Emotional Beats",
        type: "dmtip",
        content: `**Old Tam's fish:** Don't narrate this with fanfare. Just say: "Old Tam walks up. He's carrying a basket of fresh fish. He sets it down in front of you. He nods. Then he walks back to the docks." That's it. No words. The player will feel it because of everything Tam *didn't* say all campaign.

**Berta's apology:** She should still be Berta. The weather comment isn't a joke — it's who she is. She processes the world through weather. "I'm sorry I lied. It's supposed to rain Thursday." She means both equally.

**Todd's wife:** Pure comedy. Deliver with vindicated fury. "I TOLD him. I TOLD him it was a cult. 'Community organization,' he said. It had a SPIRAL WAVE LOGO, Todd!"`,
      },
      {
        title: "Rewards",
        type: "notes",
        handout: "voss-commendation",
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
        title: "After the Last Line",
        type: "dmtip",
        content: `**Read the ending text. Then stop.** Don't explain it. Don't add to it. "All eight of them" is the last line because it means the town is alive again. Let the player sit with it.

**Then break character.** Smile. Ask them what they thought. Ask what surprised them, what they loved, what they'd change. This is the debrief — and it's where you'll learn the most about being a better DM.

**You did it.** You ran a whole campaign. The first one is always the hardest. Everything after this is easier because now you know the secret: **the story isn't in your notes. It's in the space between you and the player.** You brought Thornhaven to life. That's real.`,
      },
      {
        title: "Sequel Hook",
        type: "notes",
        content: `The waterlogged tome references other sealed sites along the coast. Thornhaven was just one lock.

Old Tam, if asked: "Aye. There's more." And goes back to his fish.`,
      },
    ],
  },
] satisfies Session[]
