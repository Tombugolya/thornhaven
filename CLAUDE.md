# Thornhaven

D&D 5e campaign platform — DM tools, player character creation, and live session management.

## Tech Stack

- **Frontend**: React 19, TypeScript (strict), Vite 8, Tailwind CSS v4
- **Backend**: Firebase Realtime Database, Firebase Auth (Google for DM, email/password for players)
- **External API**: D&D 5e SRD API (dnd5eapi.co) for races, classes, traits, skills
- **Styling**: Dark fantasy theme with gold accents, Cinzel display font
- **Code style**: No semicolons, double quotes, Prettier formatted, no `as` type assertions

## Project Structure

```
app/
  src/
    components/           # React components (.tsx)
      character/          # Character creation wizard (RaceStep, ClassStep, etc.)
    hooks/                # Custom hooks (useBroadcast, useCampaign, usePersistedState)
    services/             # SRD API client (srd.ts), D&D calculations (calculations.ts)
    types/                # TypeScript types (campaign.ts, broadcast.ts, character.ts)
    data/                 # Campaign data (campaigns/thornhaven/)
    firebase.ts           # Firebase initialization (config from env vars)
.plans/                   # Feature plans and specs
```

## Key Architecture

- **Firebase as state**: Encounter/battle state lives in Firebase (`rooms/{code}/state`), not localStorage. Both DM and player use live `onValue` listeners for real-time sync.
- **Broadcast system**: `useBroadcast` hook provides `showToPlayer()` for DM→player messages, `syncState()` for direct Firebase writes. Messages are ephemeral (animations, damage numbers); state is persistent (positions, HP, conditions).
- **Character system**: Players create characters via SRD-assisted wizard. Characters stored at `players/{uid}/characters/{charId}`. Real PC stats flow into encounters via Firebase presence.
- **No `as` type assertions**: Use proper types, type guards, and nullish coalescing. Only acceptable at Firebase SDK boundaries (`snap.val()`). Context hooks throw on null instead of casting.

## Plans & Tracking

- `.plans/character-creation.md` — Character creation feature spec (layers 1-3)
- `.plans/encounter-integration.md` — Real PC stats in encounters design
- Long-task progress: `~/.claude/projects/-Users-tom-dev-thornhaven/memory/tasks/character-creation.json`

## Development

```bash
cd app
npm run dev        # Start dev server
npm run build      # Production build
npm run typecheck  # tsc --noEmit
npm run format     # Prettier
npm run lint       # ESLint
```

## Environment Variables

Firebase config is in `.env` (gitignored). Required vars:
`VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_DATABASE_URL`,
`VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
`VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`

## Deployment

GitHub Pages via `.github/workflows/deploy.yml`. Secrets set in repo settings.
Triggers on push to `main`.

## Firebase Security Rules

Players path requires auth: `players/{uid}` readable/writable only by that user.
Rooms are open for real-time sync. See Firebase Console for full rules.
