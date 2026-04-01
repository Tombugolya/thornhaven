import type { BattleMap } from "../../../types/campaign"

export const battleMaps = {
  "night-encounter": {
    name: "Thornhaven Streets",
    subtitle: "A quiet street at night",
    width: 800,
    height: 600,
    background: {
      gradient: ["#06060f", "#0a0a1a", "#0e0e20"],
    },
    // Terrain features rendered as SVG
    features: [
      // Buildings (left side)
      { type: "building", x: 0, y: 0, w: 220, h: 250, label: "Fishmonger", color: "#141420" },
      { type: "building", x: 0, y: 310, w: 200, h: 290, label: "Cooper's\nShop", color: "#121218" },
      // Buildings (right side)
      { type: "building", x: 580, y: 0, w: 220, h: 200, label: "Chandler", color: "#131320" },
      { type: "building", x: 600, y: 270, w: 200, h: 330, label: "Sailmaker", color: "#111118" },
      // Road
      { type: "road", x: 220, y: 0, w: 360, h: 600 },
      // Alley
      { type: "alley", x: 0, y: 250, w: 220, h: 60, label: "Narrow Alley" },
      // Lanterns
      { type: "lantern", x: 240, y: 150, radius: 80, color: "#f0a030" },
      { type: "lantern", x: 560, y: 420, radius: 70, color: "#e89020" },
      // Barrels
      { type: "obstacle", x: 280, y: 380, w: 30, h: 30, label: "Barrels", shape: "circle" },
      { type: "obstacle", x: 520, y: 180, w: 25, h: 25, label: "Crate", shape: "rect" },
    ],
    terrainNotes: [
      { label: "Cobblestone Road", note: "Worn stone underfoot" },
      { label: "Narrow Alley", note: "Tight — hard to fight in" },
    ],
    tokens: {
      "thug-1": { x: 380, y: 160, label: "Thug", initials: "T1", color: "#95a5a6", ally: false },
      "thug-2": { x: 420, y: 200, label: "Thug", initials: "T2", color: "#95a5a6", ally: false },
      maren: {
        x: 380,
        y: 440,
        label: "Maren",
        initials: "MA",
        color: "#3498db",
        ally: true,
        autoReveal: true,
      },
      player: {
        x: 400,
        y: 480,
        label: "You",
        initials: "PC",
        color: "#c9a227",
        ally: true,
        autoReveal: true,
      },
    },
  },

  "saltworks-rescue": {
    name: "The Old Saltworks",
    subtitle: "Underground meeting room",
    width: 700,
    height: 600,
    background: {
      gradient: ["#0a0808", "#140e0a", "#0d0a08"],
    },
    features: [
      // Walls
      { type: "wall", x: 50, y: 50, w: 600, h: 500, color: "#1a1510" },
      // Meeting table
      {
        type: "furniture",
        x: 240,
        y: 180,
        w: 220,
        h: 100,
        label: "Meeting Table",
        color: "#2a1f15",
      },
      // Chairs around table
      { type: "obstacle", x: 260, y: 160, w: 15, h: 15, shape: "circle", label: "" },
      { type: "obstacle", x: 350, y: 160, w: 15, h: 15, shape: "circle", label: "" },
      { type: "obstacle", x: 440, y: 160, w: 15, h: 15, shape: "circle", label: "" },
      { type: "obstacle", x: 260, y: 295, w: 15, h: 15, shape: "circle", label: "" },
      { type: "obstacle", x: 350, y: 295, w: 15, h: 15, shape: "circle", label: "" },
      { type: "obstacle", x: 440, y: 295, w: 15, h: 15, shape: "circle", label: "" },
      // Trapdoor (entrance)
      { type: "entrance", x: 320, y: 60, w: 60, h: 60, label: "Trapdoor\n(entrance)" },
      // Locked room
      {
        type: "room",
        x: 50,
        y: 370,
        w: 200,
        h: 180,
        label: "Locked Room",
        color: "#1a1210",
        border: "#8a6e1a",
      },
      // Locked door
      { type: "door", x: 250, y: 420, w: 8, h: 40, label: "Locked" },
      // Lanterns
      { type: "lantern", x: 350, y: 230, radius: 120, color: "#d08020" },
      { type: "lantern", x: 130, y: 460, radius: 50, color: "#a06010" },
      // Supply crates
      { type: "obstacle", x: 540, y: 400, w: 40, h: 40, label: "Crates", shape: "rect" },
      { type: "obstacle", x: 540, y: 460, w: 40, h: 30, label: "", shape: "rect" },
    ],
    terrainNotes: [
      { label: "Meeting Room", note: "Tight quarters — close combat" },
      { label: "Locked Room", note: "A heavy iron door, shut tight" },
      { label: "Crates", note: "Stacked supplies" },
    ],
    tokens: {
      "thug-3": {
        x: 300,
        y: 350,
        label: "Thug (sandwich)",
        initials: "T1",
        color: "#95a5a6",
        ally: false,
      },
      "thug-4": { x: 500, y: 250, label: "Thug", initials: "T2", color: "#95a5a6", ally: false },
      "thug-5": { x: 480, y: 340, label: "Thug", initials: "T3", color: "#95a5a6", ally: false },
      "lt-1": {
        x: 150,
        y: 200,
        label: "Lieutenant",
        initials: "LT",
        color: "#c0392b",
        ally: false,
      },
      maren: {
        x: 340,
        y: 110,
        label: "Maren",
        initials: "MA",
        color: "#3498db",
        ally: true,
        autoReveal: true,
      },
      player: {
        x: 360,
        y: 110,
        label: "You",
        initials: "PC",
        color: "#c9a227",
        ally: true,
        autoReveal: true,
      },
    },
  },

  "altar-chamber": {
    name: "The Altar Chamber",
    subtitle: "Beneath the cliffs — where the comedy ends",
    width: 800,
    height: 700,
    background: {
      gradient: ["#020208", "#06061a", "#040414"],
    },
    features: [
      // Cave walls (irregular)
      {
        type: "cave",
        points: "0,0 800,0 800,700 0,700",
        innerPoints: "80,80 720,60 750,350 700,640 100,660 60,400",
        color: "#0a0a18",
      },
      // Water (lower half)
      { type: "water", x: 60, y: 350, w: 680, h: 310, label: "Waist-Deep Water", color: "#0c1e3a" },
      // Altar
      {
        type: "altar",
        x: 340,
        y: 160,
        w: 120,
        h: 80,
        label: "Black Stone Altar",
        color: "#0e0e20",
      },
      // Cave entrance
      { type: "entrance", x: 360, y: 640, w: 80, h: 60, label: "Passage\n(entrance)" },
      // Stalactites
      { type: "obstacle", x: 180, y: 120, w: 20, h: 20, shape: "circle", label: "" },
      { type: "obstacle", x: 620, y: 200, w: 25, h: 25, shape: "circle", label: "" },
      { type: "obstacle", x: 150, y: 400, w: 18, h: 18, shape: "circle", label: "" },
      // Altar glow
      { type: "glow", x: 400, y: 200, radius: 100, color: "#6a3fa5" },
      // Water shimmer
      { type: "shimmer", x: 400, y: 500, radius: 200, color: "#1a3050" },
    ],
    terrainNotes: [
      { label: "Waist-Deep Water", note: "Cold. Heavy. Slows movement." },
      { label: "Black Stone Altar", note: "Ancient. The carvings seem to shift." },
      { label: "Water Surface", note: "Unnaturally still. No ripples." },
    ],
    tokens: {
      "selen-1": {
        x: 400,
        y: 180,
        label: "Selen Dray",
        initials: "SD",
        color: "#8e44ad",
        ally: false,
      },
      "thug-6": { x: 280, y: 300, label: "Thug", initials: "T1", color: "#95a5a6", ally: false },
      "thug-7": { x: 520, y: 280, label: "Thug", initials: "T2", color: "#95a5a6", ally: false },
      "edric-1": { x: 450, y: 250, label: "Edric", initials: "EA", color: "#2980b9", ally: false },
      maren: {
        x: 380,
        y: 580,
        label: "Maren",
        initials: "MA",
        color: "#3498db",
        ally: true,
        autoReveal: true,
      },
      player: {
        x: 420,
        y: 600,
        label: "You",
        initials: "PC",
        color: "#c9a227",
        ally: true,
        autoReveal: true,
      },
    },
  },
} satisfies Record<string, BattleMap>
