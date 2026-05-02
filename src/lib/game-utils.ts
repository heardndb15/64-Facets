import { GardenStage, PlayerStats, XPGain } from "./types";

/**
 * XP required to reach each level.
 * Uses a quadratic curve for early levels, slowing down later.
 */
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * Calculate total XP accumulated across all levels up to `level`.
 */
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

/**
 * Determine garden stage from player level.
 */
export function getGardenStage(level: number): GardenStage {
  if (level <= 2) return "seed";
  if (level <= 4) return "sprout";
  if (level <= 6) return "plant";
  if (level <= 8) return "bush";
  if (level <= 10) return "small-tree";
  if (level <= 15) return "tree";
  return "ancient";
}

/**
 * Garden stage display metadata.
 */
export const gardenStageInfo: Record<GardenStage, { emoji: string; label: string; description: string; color: string }> = {
  seed: {
    emoji: "🌱",
    label: "Seed",
    description: "Your journey begins. A tiny seed of potential.",
    color: "#86efac",
  },
  sprout: {
    emoji: "🌿",
    label: "Sprout",
    description: "You're growing. The first leaves of wisdom emerge.",
    color: "#4ade80",
  },
  plant: {
    emoji: "🌸",
    label: "Plant",
    description: "Blooming with knowledge. Strategy becomes clearer.",
    color: "#f9a8d4",
  },
  bush: {
    emoji: "🌺",
    label: "Bush",
    description: "Flourishing strategist. Your garden thrives.",
    color: "#fb7185",
  },
  "small-tree": {
    emoji: "🌲",
    label: "Young Tree",
    description: "Standing tall. Your roots run deep.",
    color: "#22c55e",
  },
  tree: {
    emoji: "🌳",
    label: "Ancient Tree",
    description: "A master of the board. Wisdom in every branch.",
    color: "#16a34a",
  },
  ancient: {
    emoji: "✨🌳✨",
    label: "Mythical Grove",
    description: "Legendary status. Few have walked this path.",
    color: "#c4b5fd",
  },
};

/**
 * Calculate XP gained from finishing a game.
 */
export function calculateXPGain(
  won: boolean,
  accuracy: number,
  blunders: number
): XPGain {
  const base = 30; // base XP for completing a game
  const winBonus = won ? 50 : 0;
  const accuracyBonus = Math.floor((accuracy / 100) * 20) - blunders * 5;

  return {
    base,
    winBonus,
    accuracyBonus: Math.max(0, accuracyBonus),
    total: base + winBonus + Math.max(0, accuracyBonus),
  };
}

/**
 * Calculate player stats from raw DB data and game history.
 */
export function buildPlayerStats(
  level: number,
  xp: number,
  coins: number,
  gamesPlayed: number,
  wins: number
): PlayerStats {
  const xpToNextLevel = xpForLevel(level);
  const gardenStage = getGardenStage(level);

  return {
    level,
    xp,
    xpToNextLevel,
    coins,
    gamesPlayed,
    wins,
    gardenStage,
  };
}

/**
 * Apply XP gain and return new level + XP (handles level ups).
 */
export function applyXPGain(
  currentXp: number,
  currentLevel: number,
  gain: number
): { newXp: number; newLevel: number; leveledUp: boolean } {
  let xp = currentXp + gain;
  let level = currentLevel;
  let leveledUp = false;

  // Check for level up
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level++;
    leveledUp = true;
  }

  return { newXp: xp, newLevel: level, leveledUp };
}

/**
 * Simple chess accuracy estimate based on move count and mistake count.
 * Returns 0-100.
 */
export function estimateAccuracy(
  totalMoves: number,
  blunders: number,
  mistakes: number,
  inaccuracies: number
): number {
  if (totalMoves === 0) return 100;

  const penaltyPoints = blunders * 3 + mistakes * 1.5 + inaccuracies * 0.5;
  const raw = Math.max(0, 100 - (penaltyPoints / totalMoves) * 30);
  return Math.round(raw);
}

/**
 * Classify a centipawn evaluation change as a move type.
 */
export function classifyMove(
  evalBefore: number,
  evalAfter: number,
  isWhiteTurn: boolean
): "blunder" | "mistake" | "inaccuracy" | "good" | "excellent" {
  // From white's perspective, higher eval is better for white
  const loss = isWhiteTurn ? evalBefore - evalAfter : evalAfter - evalBefore;

  if (loss >= 300) return "blunder";
  if (loss >= 100) return "mistake";
  if (loss >= 50) return "inaccuracy";
  if (loss >= -20) return "good";
  return "excellent";
}
