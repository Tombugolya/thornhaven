# Thornhaven

D&D 5e campaign companion — DM tools and player experience for tabletop sessions.

## Tech Stack

- **Frontend**: React 19, TypeScript (strict), Vite 8, Tailwind CSS v4
- **Backend**: Firebase Realtime Database, Firebase Auth (Google)
- **Styling**: Dark fantasy theme with gold accents, Cinzel display font
- **Code style**: No semicolons, double quotes, Prettier formatted

## Project Structure

```
app/
  src/
    components/    # React components (.tsx)
    hooks/         # Custom hooks (useBroadcast, useCampaign, usePersistedState)
    types/         # TypeScript type definitions (campaign.ts, broadcast.ts)
    data/          # Campaign data (campaigns/thornhaven/)
    firebase.ts    # Firebase initialization (config from env vars)
```

## Key Architecture

- **Firebase as state**: Encounter/battle state lives in Firebase (`rooms/{code}/state`), not localStorage. Both DM and player use live `onValue` listeners for real-time sync.
- **Broadcast system**: `useBroadcast` hook provides `showToPlayer()` for DM→player messages and `syncState()` for direct Firebase writes. Messages are ephemeral (animations, damage numbers); state is persistent (positions, HP, conditions).
- **No `as` type assertions**: Use proper types, type guards, and nullish coalescing. Only acceptable at Firebase SDK boundaries (`snap.val()`). Context hooks throw on null instead of casting.

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
