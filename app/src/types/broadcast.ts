export type BroadcastRole = "dm" | "player"

export interface PlayerInfo {
  name: string
  joinedAt: number
}

// --- Messages ---

interface BaseMessage {
  _ts: number
}

interface LocationMessage extends BaseMessage {
  type: "location"
  id: string
}

interface CharacterMessage extends BaseMessage {
  type: "character"
  id: string
}

interface CombatMessage extends BaseMessage {
  type: "combat"
  id: string
}

interface HandoutMessage extends BaseMessage {
  type: "handout"
  id: string
}

interface MapMessage extends BaseMessage {
  type: "map"
  id: string
}

interface RevealMessage extends BaseMessage {
  type: "reveal"
  tokenId: string
}

interface MoveMessage extends BaseMessage {
  type: "move"
  tokenId: string
  x: number
  y: number
}

interface KillMessage extends BaseMessage {
  type: "kill"
  tokenId: string
}

interface ReviveMessage extends BaseMessage {
  type: "revive"
  tokenId: string
}

interface ConditionsMessage extends BaseMessage {
  type: "conditions"
  tokenId: string
  conditions: string[]
}

interface ActiveTurnMessage extends BaseMessage {
  type: "activeTurn"
  tokenId: string | null
}

interface MoodMessage extends BaseMessage {
  type: "mood"
  mood: string
}

interface ClearMessage extends BaseMessage {
  type: "clear"
}

interface BattleWonMessage extends BaseMessage {
  type: "battleWon"
  encounterName?: string
}

interface DamageMessage extends BaseMessage {
  type: "damage"
  tokenId: string
  value: number
}

interface PuzzleSolvedMessage extends BaseMessage {
  type: "puzzleSolved"
}

interface SelectCampaignMessage extends BaseMessage {
  type: "selectCampaign"
  campaignId: string
}

export type BroadcastMessage =
  | LocationMessage
  | CharacterMessage
  | CombatMessage
  | HandoutMessage
  | MapMessage
  | RevealMessage
  | MoveMessage
  | KillMessage
  | ReviveMessage
  | ConditionsMessage
  | ActiveTurnMessage
  | MoodMessage
  | ClearMessage
  | BattleWonMessage
  | DamageMessage
  | PuzzleSolvedMessage
  | SelectCampaignMessage

// --- Encounter State (persisted to Firebase) ---

export interface EncounterCombatantState {
  id: string
  name: string
  hp: number
  maxHp: number
  ac: number
  initiative: number | null
  conditions: string[]
  notes: string
  npcId?: string
  isAlly?: boolean
  isPC?: boolean
}

export interface EncounterState {
  id: string
  combatants: EncounterCombatantState[]
  round: number
  activeTurnId: string | null
  revealedTokenIds: string[]
  mapShowing: boolean
}

// --- Session State (persisted to Firebase) ---

export interface SessionState {
  currentDisplay?: { type: string; id: string } | null
  currentMap?: string | null
  mood?: string | null
  revealedTokens?: Record<string, true> | null
  killedTokens?: Record<string, true> | null
  tokenPositions?: Record<string, { x: number; y: number }> | null
  tokenConditions?: Record<string, string[]> | null
  activeTurnToken?: string | null
  revealedHandouts?: Record<string, true> | null
  completedEncounters?: Record<string, true> | null
  encounter?: EncounterState | null
}

// --- Context ---

export interface BroadcastContextValue {
  connected: boolean
  playerCount: number
  players: Record<string, PlayerInfo>
  lastMessage: BroadcastMessage | null
  sessionState: SessionState | null
  showToPlayer: (type: string, id: string | null, extra?: Record<string, unknown>) => void
  clearPlayer: () => void
  syncState: (updates: Record<string, unknown>) => void
  role: BroadcastRole
  roomCode: string
}
