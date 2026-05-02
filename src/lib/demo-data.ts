import { GameResult } from "./types";

/** Demo game history entries used in the history page before Supabase is wired. */
export const DEMO_GAME_HISTORY: {
  result: GameResult;
  date: string;
  moves: number;
  accuracy: number;
  blunders: number;
  mistakes: number;
  xpEarned: number;
  opponent: string;
}[] = [
  {
    result: "white",
    date: "May 1, 2026",
    moves: 34,
    accuracy: 87,
    blunders: 0,
    mistakes: 1,
    xpEarned: 88,
    opponent: "AI (Easy)",
  },
  {
    result: "black",
    date: "Apr 30, 2026",
    moves: 42,
    accuracy: 64,
    blunders: 2,
    mistakes: 3,
    xpEarned: 30,
    opponent: "AI (Easy)",
  },
  {
    result: "draw",
    date: "Apr 29, 2026",
    moves: 58,
    accuracy: 78,
    blunders: 1,
    mistakes: 2,
    xpEarned: 42,
    opponent: "Friend",
  },
  {
    result: "white",
    date: "Apr 28, 2026",
    moves: 27,
    accuracy: 91,
    blunders: 0,
    mistakes: 0,
    xpEarned: 97,
    opponent: "AI (Easy)",
  },
  {
    result: "black",
    date: "Apr 27, 2026",
    moves: 31,
    accuracy: 55,
    blunders: 3,
    mistakes: 2,
    xpEarned: 30,
    opponent: "AI (Easy)",
  },
  {
    result: "white",
    date: "Apr 26, 2026",
    moves: 45,
    accuracy: 82,
    blunders: 0,
    mistakes: 2,
    xpEarned: 74,
    opponent: "Friend",
  },
];
