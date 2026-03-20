import { useState } from "react";
import {
  Search,
  Check,
  Circle,
  MapPin,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { clues, failsafes } from "../data/clues";

function ClueCard({ clue, onToggle }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-bg-surface/60 border rounded-xl overflow-hidden transition-all duration-200 ${
        clue.found ? "border-success/30 bg-success/5" : "border-bg-elevated/50"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Found Toggle */}
        <button
          onClick={() => onToggle(clue.id)}
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
            clue.found
              ? "bg-success border-success text-white"
              : "border-text-muted/30 hover:border-gold-dim"
          }`}
        >
          {clue.found && <Check className="w-3.5 h-3.5" />}
        </button>

        {/* Clue Info */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 text-left cursor-pointer flex items-center gap-2"
        >
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-gold-dim shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-gold-dim shrink-0" />
          )}
          <div className="min-w-0">
            <h4
              className={`text-sm font-medium ${
                clue.found
                  ? "text-success-light"
                  : "text-parchment"
              }`}
            >
              {clue.name}
            </h4>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
              <MapPin className="w-3 h-3" />
              {clue.location}
            </div>
          </div>
        </button>

        {/* Session Badge */}
        <span className="text-[10px] bg-bg-base text-text-muted px-2 py-0.5 rounded-full shrink-0">
          S{clue.session}
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-4 ml-9 space-y-3">
          <p className="text-sm text-parchment/80 leading-relaxed">
            {clue.description}
          </p>

          {clue.dc && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-text-muted">Check:</span>
              <span className="text-gold bg-gold/10 px-2 py-0.5 rounded">
                {clue.dc}
              </span>
            </div>
          )}

          <div>
            <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">
              Leads to
            </div>
            <div className="flex flex-wrap gap-1.5">
              {clue.leadsTo.map((lead, i) => (
                <span
                  key={i}
                  className="text-xs bg-info/10 text-info px-2 py-0.5 rounded-full"
                >
                  {lead}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClueTracker() {
  const [clueState, setClueState] = useState(clues);
  const [sessionFilter, setSessionFilter] = useState("all");

  const toggleClue = (id) => {
    setClueState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, found: !c.found } : c))
    );
  };

  const filtered =
    sessionFilter === "all"
      ? clueState
      : clueState.filter((c) => c.session === parseInt(sessionFilter));

  const foundCount = clueState.filter((c) => c.found).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Search className="w-6 h-6 text-info" />
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-gold">
            Clue Tracker
          </h2>
          <p className="text-xs text-text-muted">
            {foundCount} of {clueState.length} clues discovered
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-bg-surface rounded-full overflow-hidden">
        <div
          className="h-full bg-gold transition-all duration-500 rounded-full"
          style={{
            width: `${(foundCount / clueState.length) * 100}%`,
          }}
        />
      </div>

      {/* Session Filter */}
      <div className="flex gap-2">
        {["all", "1", "2"].map((s) => (
          <button
            key={s}
            onClick={() => setSessionFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              sessionFilter === s
                ? "bg-gold/15 text-gold border border-gold/30"
                : "bg-bg-surface/50 text-text-muted border border-transparent hover:bg-bg-surface"
            }`}
          >
            {s === "all" ? "All Sessions" : `Session ${s}`}
          </button>
        ))}
      </div>

      {/* Clue List */}
      <div className="space-y-2">
        {filtered.map((clue) => (
          <ClueCard key={clue.id} clue={clue} onToggle={toggleClue} />
        ))}
      </div>

      {/* Failsafes */}
      <div className="bg-bg-surface/40 border border-warning/15 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-warning" />
          <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold text-gold">
            If the Player Gets Stuck
          </h3>
        </div>
        <p className="text-xs text-parchment-dim mb-3 italic">
          Every important clue is available in at least 3 ways. Use these
          failsafes in order:
        </p>
        <div className="space-y-3">
          {failsafes.map((f) => (
            <div key={f.order} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-warning/15 text-warning flex items-center justify-center text-xs font-bold shrink-0">
                {f.order}
              </span>
              <div>
                <div className="text-xs text-warning font-medium">
                  {f.trigger}
                </div>
                <p className="text-sm text-parchment/80 mt-0.5">{f.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
