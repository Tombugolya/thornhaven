import { sessions } from "./story";
import { npcs } from "./npcs";
import { encounters } from "./encounters";
import { clues, failsafes } from "./clues";
import { battleMaps } from "./maps";
import { locationVisuals, characterVisuals, combatVisuals, moods } from "./visuals";
import { handouts } from "./handouts";

export default {
  id: "thornhaven",
  title: "The Silence of Thornhaven",
  subtitle: "5e Duet Campaign",
  sessions,
  npcs,
  encounters,
  clues,
  failsafes,
  battleMaps,
  handouts,
  moods,
  visuals: {
    location: locationVisuals,
    character: characterVisuals,
    combat: combatVisuals,
  },
};
