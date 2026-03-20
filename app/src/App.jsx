import { useState, useMemo } from "react";
import {
  BookOpen,
  Users,
  Swords,
  Search,
  Map,
  Monitor,
  MonitorOff,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { BroadcastProvider, useBroadcast } from "./hooks/useBroadcast";
import StoryTab from "./components/StoryTab";
import CharactersTab from "./components/CharactersTab";
import EncounterTracker from "./components/EncounterTracker";
import ClueTracker from "./components/ClueTracker";
import PlayerView from "./components/PlayerView";

const isPlayerMode = new URLSearchParams(window.location.search).has("player");

const tabs = [
  { id: "story", label: "Story", icon: BookOpen },
  { id: "characters", label: "Characters", icon: Users },
  { id: "encounters", label: "Encounters", icon: Swords },
  { id: "clues", label: "Clues", icon: Search },
];

function DmApp() {
  const [activeTab, setActiveTab] = useState("story");
  const { connected, playerCount, clearPlayer } = useBroadcast();

  const playerUrl = useMemo(() => {
    const loc = window.location;
    return `${loc.protocol}//${loc.host}/?player`;
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-bg-base border-b border-gold-dim/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Map className="w-7 h-7 text-gold" />
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-gold tracking-wide">
                The Silence of Thornhaven
              </h1>
              <p className="text-xs text-text-muted tracking-wider uppercase">
                DM Companion — 5e Duet Campaign
              </p>
            </div>
          </div>

          {/* Player connection status + link */}
          <div className="flex items-center gap-3">
            <button
              onClick={clearPlayer}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-bg-surface/60 border border-bg-elevated/50 text-text-muted hover:text-parchment hover:bg-bg-surface transition-colors cursor-pointer"
              title="Clear player screen"
            >
              <X className="w-3 h-3" />
              Clear Screen
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-surface/60 border border-bg-elevated/50">
              {connected ? (
                <Wifi className="w-3.5 h-3.5 text-success-light" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-danger" />
              )}
              <span className="text-xs text-text-muted">
                {playerCount > 0 ? (
                  <span className="text-success-light">{playerCount} player{playerCount > 1 ? "s" : ""} connected</span>
                ) : (
                  "No players"
                )}
              </span>
            </div>
            <a
              href={playerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 transition-colors"
              title="Open player view in new tab"
            >
              <Monitor className="w-3.5 h-3.5" />
              Player View
            </a>
          </div>
        </div>
      </header>

      {/* Tab Bar */}
      <nav className="bg-bg-base/80 backdrop-blur-sm border-b border-gold-dim/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all duration-200 border-b-2 cursor-pointer
                  ${
                    isActive
                      ? "border-gold text-gold bg-gold/5"
                      : "border-transparent text-text-muted hover:text-parchment hover:border-gold-dim/40 hover:bg-white/[0.02]"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 bg-bg-deep">
        <div className="max-w-7xl mx-auto p-6">
          {activeTab === "story" && <StoryTab />}
          {activeTab === "characters" && <CharactersTab />}
          {activeTab === "encounters" && <EncounterTracker />}
          {activeTab === "clues" && <ClueTracker />}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BroadcastProvider role={isPlayerMode ? "player" : "dm"}>
      {isPlayerMode ? <PlayerView /> : <DmApp />}
    </BroadcastProvider>
  );
}
