import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  MapPin,
  Swords,
  ScrollText,
  MessageSquareQuote,
} from "lucide-react";
import { sessions } from "../data/story";
import ShowButton from "./ShowButton";

// Map section titles to visual IDs for the "Show to Player" buttons
const sectionVisualMap = {
  "Opening Hook": { type: "location", id: "thornhaven-approach" },
  "Arrival at Dusk": { type: "location", id: "thornhaven-approach" },
  "The Salted Eel (Tavern/Inn)": { type: "location", id: "salted-eel" },
  "Magistrate's Manor": { type: "location", id: "magistrates-manor" },
  "The Docks": { type: "location", id: "the-docks" },
  "Part 1: Finding Lira": { type: "location", id: "old-saltworks" },
  "The Saltworks": { type: "location", id: "old-saltworks" },
  "Lira Crenn": { type: "character", id: "lira" },
  "Saltworks Combat": { type: "combat", id: "saltworks-rescue" },
  "Cave Map": { type: "location", id: "cave-entrance" },
  "The Caves": { type: "location", id: "cave-entrance" },
  "Finding Voss": { type: "character", id: "voss" },
  "The Altar Chamber": { type: "location", id: "altar-chamber" },
  "The Confrontation": { type: "character", id: "selen" },
  "Altar Chamber Combat": { type: "combat", id: "altar-chamber" },
  "Night Encounter": { type: "combat", id: "night-encounter" },
};

const sectionIcons = {
  readAloud: MessageSquareQuote,
  location: MapPin,
  combat: Swords,
  notes: ScrollText,
  map: MapPin,
};

const sectionColors = {
  readAloud: "border-l-amber-700/60 bg-bg-readaloud",
  location: "border-l-info/40",
  combat: "border-l-danger/40",
  notes: "",
  map: "border-l-cave-cold/40",
};

function renderContent(content) {
  // Simple markdown-like rendering
  return content.split("\n").map((line, i) => {
    // Bold
    const rendered = line.replace(
      /\*\*(.+?)\*\*/g,
      '<strong class="text-parchment font-semibold">$1</strong>'
    );
    // Italic
    const rendered2 = rendered.replace(
      /\*(.+?)\*/g,
      '<em class="text-parchment-dim italic">$1</em>'
    );

    if (line.startsWith(">")) {
      return (
        <blockquote
          key={i}
          className="border-l-2 border-gold-dim/40 pl-3 my-1 text-parchment-dim italic"
          dangerouslySetInnerHTML={{ __html: rendered2.slice(1).trim() }}
        />
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li
          key={i}
          className="ml-4 list-disc text-parchment/80"
          dangerouslySetInnerHTML={{ __html: rendered2.slice(2) }}
        />
      );
    }
    if (line.startsWith("| ")) {
      return null; // Skip table syntax for now
    }
    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }
    return (
      <p
        key={i}
        className="text-parchment/80 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: rendered2 }}
      />
    );
  });
}

function Section({ section }) {
  const [open, setOpen] = useState(section.type === "readAloud");
  const Icon = sectionIcons[section.type] || ScrollText;
  const colorClass = sectionColors[section.type] || "";
  const visual = sectionVisualMap[section.title];

  return (
    <div
      className={`border-l-2 ${colorClass} rounded-r-lg overflow-hidden transition-all duration-200`}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors duration-150 ${
          open
            ? "bg-bg-surface/80"
            : "bg-bg-surface/40 hover:bg-bg-surface/60"
        }`}
      >
        {open ? (
          <ChevronDown className="w-4 h-4 text-gold-dim shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gold-dim shrink-0" />
        )}
        <Icon className="w-4 h-4 text-text-muted shrink-0" />
        <span className="font-medium text-parchment text-sm">
          {section.title}
        </span>
        <span className="ml-auto flex items-center gap-2">
          {visual && <ShowButton type={visual.type} id={visual.id} label={section.title} />}
          {section.type === "combat" && (
            <span className="text-xs bg-danger/20 text-danger-light px-2 py-0.5 rounded-full">
              Combat
            </span>
          )}
          {section.type === "readAloud" && (
            <span className="text-xs bg-amber-900/30 text-gold-light px-2 py-0.5 rounded-full">
              Read Aloud
            </span>
          )}
        </span>
      </button>

      {open && (
        <div className="px-5 py-4 space-y-2">
          {section.type === "readAloud" ? (
            <div className="bg-bg-readaloud/80 border border-gold-dim/20 rounded-lg p-4 space-y-2">
              <p className="text-gold-light/90 leading-relaxed italic font-[family-name:var(--font-display)] text-[15px]">
                {section.content}
              </p>
            </div>
          ) : section.type === "map" ? (
            <pre className="bg-bg-base rounded-lg p-4 text-parchment-dim font-[family-name:var(--font-mono)] text-sm leading-relaxed overflow-x-auto">
              {section.content}
            </pre>
          ) : (
            <div className="space-y-1">{renderContent(section.content)}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StoryTab() {
  const [activeSession, setActiveSession] = useState(1);

  const session = sessions.find((s) => s.id === activeSession);

  return (
    <div className="space-y-6">
      {/* Session Selector */}
      <div className="flex gap-3">
        {sessions.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSession(s.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeSession === s.id
                ? "bg-gold/15 text-gold border border-gold/30"
                : "bg-bg-surface/50 text-text-muted border border-transparent hover:bg-bg-surface hover:text-parchment-dim"
            }`}
          >
            Session {s.id}
          </button>
        ))}
      </div>

      {/* Session Header */}
      <div className="flex items-center gap-4">
        <BookOpen className="w-6 h-6 text-gold" />
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gold">
            {session.title}
          </h2>
          <p className="text-xs text-text-muted">{session.duration}</p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {session.sections.map((section, i) => (
          <Section key={i} section={section} />
        ))}
      </div>
    </div>
  );
}
