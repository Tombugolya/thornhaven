import { useState, useEffect } from "react";
import { ChevronRight, LogOut } from "lucide-react";
import { useCampaign } from "../hooks/useCampaign";
import Particles from "./Particles";

// Spiral wave + compass rose emblem for Thornhaven
function ThornhavenEmblem({ size = 120 }) {
  const c = size / 2;
  const r = size * 0.42;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="opacity-40">
      {/* Outer ring */}
      <circle cx={c} cy={c} r={r} fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.5" />
      <circle cx={c} cy={c} r={r * 0.85} fill="none" stroke="#c9a227" strokeWidth="0.5" opacity="0.3" />

      {/* Compass points */}
      {[0, 90, 180, 270].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const inner = r * 0.55;
        const outer = r * 0.95;
        return (
          <line
            key={angle}
            x1={c + Math.cos(rad) * inner}
            y1={c + Math.sin(rad) * inner}
            x2={c + Math.cos(rad) * outer}
            y2={c + Math.sin(rad) * outer}
            stroke="#c9a227"
            strokeWidth="1"
            opacity="0.4"
          />
        );
      })}

      {/* Diagonal ticks */}
      {[45, 135, 225, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const inner = r * 0.7;
        const outer = r * 0.9;
        return (
          <line
            key={angle}
            x1={c + Math.cos(rad) * inner}
            y1={c + Math.sin(rad) * inner}
            x2={c + Math.cos(rad) * outer}
            y2={c + Math.sin(rad) * outer}
            stroke="#c9a227"
            strokeWidth="0.5"
            opacity="0.3"
          />
        );
      })}

      {/* Central spiral — the Undertow symbol */}
      <path
        d={`M ${c} ${c}
          c 2,-8 10,-14 18,-12
          c 10,2 14,14 10,24
          c -5,12 -20,16 -30,10
          c -14,-7 -18,-26 -8,-38
          c 10,-16 32,-20 46,-8`}
        fill="none"
        stroke="#c9a227"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Waves at bottom */}
      <path
        d={`M ${c - r * 0.6} ${c + r * 0.55}
          q ${r * 0.15},-${r * 0.1} ${r * 0.3},0
          q ${r * 0.15},${r * 0.1} ${r * 0.3},0
          q ${r * 0.15},-${r * 0.1} ${r * 0.3},0`}
        fill="none"
        stroke="#c9a227"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d={`M ${c - r * 0.5} ${c + r * 0.65}
          q ${r * 0.12},-${r * 0.08} ${r * 0.25},0
          q ${r * 0.12},${r * 0.08} ${r * 0.25},0
          q ${r * 0.12},-${r * 0.08} ${r * 0.25},0`}
        fill="none"
        stroke="#c9a227"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.25"
      />
    </svg>
  );
}

const campaignEmblems = {
  thornhaven: ThornhavenEmblem,
};

function CampaignCard({ campaign, onEnter }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Use the first location visual's gradient for the card backdrop
  const firstVisual = campaign.visuals?.location
    ? Object.values(campaign.visuals.location)[0]
    : null;
  const gradient = firstVisual?.gradient || ["#0d1b2a", "#1a1035"];
  const Emblem = campaignEmblems[campaign.id];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-bg-elevated/50 bg-bg-surface/60 backdrop-blur-sm transition-all duration-700 ${
        entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ maxWidth: "480px", width: "100%" }}
    >
      {/* Gradient backdrop */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 50%, ${gradient[2] || gradient[0]} 100%)`,
        }}
      />

      <div className="relative z-10 p-6 space-y-5">
        {/* Emblem + Title */}
        <div className="flex items-center gap-5">
          {Emblem && (
            <div className="shrink-0">
              <Emblem size={80} />
            </div>
          )}
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-gold tracking-wide">
              {campaign.title}
            </h2>
            <p className="text-xs text-text-muted mt-1">{campaign.subtitle}</p>
          </div>
        </div>

        {/* Enter button */}
        <button
          onClick={() => onEnter(campaign.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold/15 border border-gold/30 text-gold font-medium text-sm hover:bg-gold/25 transition-colors cursor-pointer"
        >
          Enter Campaign
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CampaignLanding({ onEnterCampaign, onSignOut }) {
  const { campaigns, selectCampaign } = useCampaign();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = (campaignId) => {
    selectCampaign(campaignId);
    onEnterCampaign(campaignId);
  };

  return (
    <div className="min-h-screen bg-bg-deep flex flex-col items-center justify-center relative overflow-hidden">
      {/* Sign out */}
      {onSignOut && (
        <button
          onClick={onSignOut}
          className="absolute top-5 right-5 z-20 p-2 rounded-lg text-text-muted hover:text-gold hover:bg-gold/10 transition-colors cursor-pointer"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      )}

      {/* Particles */}
      <Particles type="dust" accentColor="#c9a227" />

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center px-6 py-12 w-full transition-all duration-1000 ${
          entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* App title */}
        <h1
          className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-bold tracking-wider text-center mb-2"
          style={{
            color: "#c9a227",
            textShadow: "0 0 40px rgba(201,162,39,0.15)",
          }}
        >
          Thornhaven
        </h1>
        <p className="text-text-muted text-sm tracking-widest uppercase mb-6">
          DM Companion
        </p>

        {/* Gold divider */}
        <div className="w-24 h-px bg-gold/40 mb-10" />

        {/* Campaign cards */}
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-3xl">
          {campaigns.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              onEnter={handleEnter}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
