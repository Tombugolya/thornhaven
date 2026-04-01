import { useState, useMemo, useEffect } from "react";
import {
  BookOpen,
  Users,
  Swords,
  Search,
  Map,
  Monitor,
  MonitorOff,
  Home,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { BroadcastProvider, useBroadcast } from "./hooks/useBroadcast";
import { CampaignProvider, useCampaign } from "./hooks/useCampaign";
import { usePersistedState } from "./hooks/usePersistedState";
import StoryTab from "./components/StoryTab";
import CharactersTab from "./components/CharactersTab";
import EncounterTracker from "./components/EncounterTracker";
import ClueTracker from "./components/ClueTracker";
import PlayerView from "./components/PlayerView";
import CampaignLanding from "./components/CampaignLanding";

const params = new URLSearchParams(window.location.search);
const isPlayerMode = params.has("player");
const initialCampaign = params.get("campaign");

const tabs = [
  { id: "story", label: "Story", icon: BookOpen },
  { id: "characters", label: "Characters", icon: Users },
  { id: "encounters", label: "Encounters", icon: Swords },
  { id: "clues", label: "Clues", icon: Search },
];

function DmApp() {
  const { campaign } = useCampaign();
  const [showLanding, setShowLanding] = useState(!initialCampaign);
  const [activeTab, setActiveTab] = usePersistedState(
    `dm:${campaign.id}:activeTab`,
    "story"
  );
  const { connected, playerCount, clearPlayer, showToPlayer, lastMessage } = useBroadcast();
  const [activeMood, setActiveMood] = useState("default");
  const [puzzleToast, setPuzzleToast] = useState(false);
  const moodEntries = campaign.moods ? Object.values(campaign.moods) : [];

  useEffect(() => {
    if (lastMessage?.type === "puzzleSolved") {
      setPuzzleToast(true);
      const t = setTimeout(() => setPuzzleToast(false), 5000);
      return () => clearTimeout(t);
    }
  }, [lastMessage]);

  const playerUrl = useMemo(() => {
    const loc = window.location;
    return `${loc.protocol}//${loc.host}/?player`;
  }, []);

  const enterCampaign = (campaignId) => {
    const url = new URL(window.location);
    url.searchParams.set("campaign", campaignId || campaign.id);
    window.history.pushState({}, "", url);
    setShowLanding(false);
  };

  const goToLanding = () => {
    const url = new URL(window.location);
    url.searchParams.delete("campaign");
    window.history.pushState({}, "", url);
    setShowLanding(true);
  };

  if (showLanding) {
    return (
      <CampaignLanding onEnterCampaign={enterCampaign} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-bg-base border-b border-gold-dim/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={goToLanding}
              className="p-1.5 rounded-lg text-text-muted hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer"
              title="Back to campaigns"
            >
              <Home className="w-5 h-5" />
            </button>
            <Map className="w-7 h-7 text-gold" />
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold text-gold tracking-wide">
                {campaign.title}
              </h1>
              <p className="text-xs text-text-muted tracking-wider uppercase">
                DM Companion — {campaign.subtitle}
              </p>
            </div>
          </div>

          {/* Player connection status + link */}
          <div className="flex items-center gap-3">
            {playerCount > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-bg-surface/60 border border-bg-elevated/50" title="Mood">
                {moodEntries.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      showToPlayer("mood", null, { mood: m.id });
                      setActiveMood(m.id);
                    }}
                    className="w-5 h-5 rounded-full cursor-pointer transition-all duration-200 shrink-0"
                    style={{
                      background: m.gradient[0],
                      border: `2px solid ${m.accentColor}`,
                      boxShadow: activeMood === m.id
                        ? `0 0 0 2px ${m.accentColor}60, 0 0 8px ${m.accentColor}40`
                        : "none",
                      opacity: activeMood === m.id ? 1 : 0.6,
                    }}
                    title={m.name}
                  />
                ))}
              </div>
            )}
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

      {puzzleToast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg text-sm font-medium"
          style={{
            background: "linear-gradient(135deg, #1a2e28, #16213e)",
            border: "1px solid rgba(39, 174, 96, 0.25)",
            color: "#2ecc71",
            boxShadow: "0 4px 20px rgba(39, 174, 96, 0.15)",
            animation: "inscriptionFade 0.4s ease-out",
          }}
        >
          The sealed door has been opened
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BroadcastProvider role={isPlayerMode ? "player" : "dm"}>
      <CampaignProvider>
        {isPlayerMode ? <PlayerView /> : <DmApp />}
      </CampaignProvider>
    </BroadcastProvider>
  );
}
