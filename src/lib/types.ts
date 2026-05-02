// Database table types matching our Supabase schema

export interface DbUser {
  id: string;
  email: string;
  level: number;
  xp: number;
  coins: number;
  created_at: string;
  updated_at: string;
}

export interface DbGame {
  id: string;
  user_id: string;
  pgn: string;
  result: "white" | "black" | "draw" | "abandoned";
  created_at: string;
}

export interface DbAnalysis {
  id: string;
  game_id: string;
  mistakes_count: number;
  blunders_count: number;
  inaccuracies_count: number;
  ai_feedback: string;
  moves_analysis: MoveAnalysis[];
  created_at: string;
}

// App-level types

export interface MoveAnalysis {
  moveNumber: number;
  move: string;
  fen: string;
  evaluation: number; // centipawns
  type: "blunder" | "mistake" | "inaccuracy" | "good" | "excellent";
  explanation?: string;
}

export interface GameState {
  fen: string;
  pgn: string;
  turn: "w" | "b";
  isGameOver: boolean;
  result: GameResult | null;
  moveHistory: string[];
  capturedPieces: { white: string[]; black: string[] };
}

export type GameResult = "white" | "black" | "draw" | "abandoned";

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  gamesPlayed: number;
  wins: number;
  gardenStage: GardenStage;
}

export type GardenStage =
  | "seed"        // level 1-2
  | "sprout"      // level 3-4
  | "plant"       // level 5-6
  | "bush"        // level 7-8
  | "small-tree"  // level 9-10
  | "tree"        // level 11-15
  | "ancient";    // level 16+

export interface AnalysisResult {
  mistakes: MoveAnalysis[];
  blunders: MoveAnalysis[];
  inaccuracies: MoveAnalysis[];
  totalMoves: number;
  accuracy: number;   // 0-100
  aiFeedback: string;
  keyInsights: string[];
}

export interface XPGain {
  base: number;
  winBonus: number;
  accuracyBonus: number;
  total: number;
}
