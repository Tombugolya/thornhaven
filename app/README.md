# The Silence of Thornhaven — DM Companion App

A real-time DM companion for running *The Silence of Thornhaven*, a 5e duet mystery campaign (2-3 sessions, levels 3-5).

The DM gets a full campaign toolkit. The player gets a cinematic second screen. Both sync in real-time.

## What's Inside

**DM View** — Story beats with inline DM tips, NPC stat blocks and dialogue, encounter tracker with HP/initiative, clue checklist with failsafes.

**Player View** — Full-screen atmospheric displays for locations, characters, and combat. Interactive battle maps with draggable tokens. The DM controls what the player sees.

**Real-time Sync** — WebSocket relay built into the dev server. The DM pushes locations, reveals enemies one-at-a-time, drags tokens around the battle map — the player sees it all instantly.

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm (comes with Node)

### Install and Run

```bash
cd app
npm install
npm run dev
```

The DM view opens at **http://localhost:5173/**

The player view opens at **http://localhost:5173/?player**

The dev server binds to all network interfaces, so the player URL also works with your local IP (e.g. `http://192.168.1.5:5173/?player`) if both devices are on the same network.

### Sharing Across Devices (Cloudflare Tunnel)

If the player is on a different device and direct LAN access doesn't work (e.g. corporate firewalls), use a Cloudflare tunnel:

```bash
# Install cloudflared (one time)
brew install cloudflared        # macOS
# or: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/

# Start the tunnel (run alongside `npm run dev`)
cloudflared tunnel --url http://localhost:5173
```

Cloudflare will print a public URL like:

```
https://something-random.trycloudflare.com
```

Give the player:

```
https://something-random.trycloudflare.com/?player
```

No account needed. Fully encrypted. WebSocket sync works through it. The tunnel stays up as long as the command is running.

## How to Use at the Table

### DM Side

1. **Story tab** — Walk through the campaign session by session. Read-aloud text is gold-highlighted. DM tips (amber) give you roleplay coaching, pacing cues, and rules reminders right where you need them.

2. **Characters tab** — Click any NPC to see their full stat block, attacks, dialogue lines, and what they know. Filter by role (Allies, Villains, Enemies, Flavor).

3. **Encounters tab** — Track initiative and HP for all three encounters. Enter initiative rolls, apply damage/healing, track rounds.

4. **Clues tab** — Check off clues as the player discovers them. Progress bar shows how much they've found. Failsafe section at the bottom tells you what to do if they get stuck.

### Pushing Content to the Player

When a player is connected, **"Show" buttons** appear throughout the DM view:

- **Story tab** — Show buttons on location, combat, and character sections
- **Characters tab** — Show button on each NPC card
- **Encounters tab** — "Show Map" opens the interactive battle map on the player's screen

The **"Clear Screen"** button in the header sends the player back to the idle title screen.

### Battle Maps

1. Open an encounter and click **"Show Map to Player"**
2. A DM map preview appears in the encounter panel — you can **drag tokens** on it
3. Use **"Reveal"** buttons to dramatically reveal enemies one at a time on the player's screen
4. Use **"Kill"** buttons to remove defeated enemies from the player's map
5. The player can drag their own PC token — you'll see it move on your map too

All token movement syncs in real-time between DM and player.

## Project Structure

```
thornhaven/
  app/                        # React app (Vite)
    src/
      components/
        App.jsx               # Root — routes DM vs player view
        StoryTab.jsx          # Session-by-session story with DM tips
        CharactersTab.jsx     # NPC grid and detail cards
        CharacterCard.jsx     # Full NPC stat block / dialogue view
        EncounterTracker.jsx  # Initiative, HP, map controls
        ClueTracker.jsx       # Clue checklist and failsafes
        PlayerView.jsx        # Player's cinematic display
        SceneDisplay.jsx      # Atmospheric location/character reveals
        BattleMap.jsx         # Interactive SVG battle maps
        ShowButton.jsx        # "Show to Player" button component
      data/
        npcs.js               # All NPC data (stats, dialogue, secrets)
        story.js              # Session content and DM tips
        encounters.js         # Encounter definitions
        clues.js              # Clue definitions and failsafes
        maps.js               # Battle map layouts and token positions
        visuals.js            # Player-facing scene/character visuals
      hooks/
        useBroadcast.jsx      # WebSocket context for DM-player sync
    vite.config.js            # Vite config + WebSocket relay plugin
  npc_*.md                    # Printable NPC reference documents
  the_silence_of_thornhaven.md  # Full campaign document
```

## Campaign Documents

The `npc_*.md` files and `the_silence_of_thornhaven.md` are standalone markdown documents with the complete campaign — stat blocks, dialogue, encounter tables, loot, and DM reference. You can print these or read them on a tablet if you want a backup that doesn't need a browser.

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS v4
- Lucide React (icons)
- WebSocket (`ws` package) relay via custom Vite plugin
- Cloudflare Tunnel for remote access (optional)
