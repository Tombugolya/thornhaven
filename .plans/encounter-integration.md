# Encounter Integration: Real PC Stats + Multi-Player

## Goal
When players join a session with their characters, their real stats (HP, AC, level, abilities) 
should flow into the encounter tracker. Support up to 6 players.

## Current State
- PC combatant in encounters is hardcoded: `{ id: "player", name: "Player", hp: 25, maxHp: 25, ac: 15 }`
- Battle map has one "player" token with fixed position
- Player joins with `playerName` only — character data not sent to session

## Data Flow Design

### Player → Session → Encounter

1. **Player joins session**: `BroadcastProvider` already registers presence at 
   `rooms/{code}/presence/{playerId}` with `{ name, joinedAt }`.
   **Change**: Also store `characterId` and key stats in presence:
   ```
   rooms/{code}/presence/{playerId}: {
     name: "Kael",
     joinedAt: timestamp,
     characterId: "char-abc",
     character: { name, race, class, level, hp, maxHp, ac, speed, ... }
   }
   ```

2. **DM sees players**: `useBroadcast` already exposes `players` (from presence listener).
   **Change**: Include character data in the `PlayerInfo` type.

3. **Encounter starts**: `defaultCombatants()` in EncounterTracker currently hardcodes the PC.
   **Change**: Generate PC combatants from connected players' character data.
   Each connected player with a character becomes a combatant with real stats.

4. **Battle map tokens**: Currently one hardcoded "player" token per map.
   **Change**: Generate PC tokens dynamically from connected players.
   Each player gets their own token they can drag.

### Token Ownership
- Each player token ID: `pc-{playerId}` (e.g., `pc-p-a8f3k2m1`)
- Player can only drag their own token (check in `isDraggable`)
- DM can drag any token

### Key Changes

**`src/types/broadcast.ts`**:
- Expand `PlayerInfo` to include character stats
- Add character fields to presence data

**`src/hooks/useBroadcast.tsx`**:
- When registering player presence, include character data
- Pass character data through to `players` state

**`src/App.tsx`**:
- Pass selected `PlayerCharacter` to `BroadcastProvider`
- BroadcastProvider writes character to presence

**`src/components/EncounterTracker.tsx`**:
- `defaultCombatants()`: generate PC combatants from `players` (connected players with characters)
- Each PC combatant uses real HP, AC, level from character data
- Remove hardcoded "player" combatant from encounter data

**`src/components/BattleMap.tsx`**:
- Support multiple PC tokens (not just one "player" token)
- Each player drags only their own token
- DM drags any token

**`src/data/campaigns/thornhaven/maps.ts`**:
- Remove hardcoded `player` token from maps
- PC tokens are generated dynamically from connected players

## Open Questions
- Where do PC tokens spawn on the map? (DM places them? Fixed spawn point?)
- Should PC combatants auto-populate when encounter opens, or only when map is shown?
