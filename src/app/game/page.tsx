"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ChessBoardComponent } from "@/components/chess/ChessBoard";
import { GameAnalysis } from "@/components/chess/GameAnalysis";
import { PlayerStatsCard } from "@/components/player/PlayerStatsCard";
import { LevelUpToast } from "@/components/player/LevelUpToast";
import { useStockfish } from "@/hooks/useStockfish";
import { buildPlayerStats, calculateXPGain, applyXPGain, xpForLevel } from "@/lib/game-utils";
import { AnalysisResult, GameResult, XPGain } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Cpu, Users, ChevronLeft, FlaskConical, Link2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

type GameMode = "vs-ai" | "vs-human" | "vs-online";
type ViewMode = "setup" | "game" | "analysis";

/**
 * Main Game page — orchestrates: mode selection → chess game → post-game analysis.
 * Manages local player state (XP, level) when Supabase is not configured.
 */
export default function GamePage() {
  const [gameMode, setGameMode] = useState<GameMode>("vs-ai");
  const [view, setView] = useState<ViewMode>("setup");
  const [matchId, setMatchId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [xpToast, setXpToast] = useState<{ xpGain: XPGain; newLevel: number; leveledUp: boolean } | null>(null);

  const { isReady, isAnalyzing, analyzePGN, getBestMove } = useStockfish();
  const { stats, updateStats } = useUser();

  const playerStats = buildPlayerStats(
    stats.level,
    stats.xp,
    stats.coins,
    stats.gamesPlayed,
    stats.wins
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const mId = searchParams.get("match");
      if (mId) {
        setMatchId(mId);
        setGameMode("vs-online");
        setView("game");
      }
    }
  }, []);

  /**
   * Called when a game ends. Triggers Stockfish analysis then shows analysis view.
   */
  const handleGameEnd = useCallback(
    async (pgn: string, result: GameResult) => {
      setView("analysis");

      const won = result === "white"; // assumed player is white

      // Start analysis
      const analysisResult = await analyzePGN(pgn);
      if (analysisResult) {
        setAnalysis(analysisResult);

        // Calculate and apply XP
        const gain = calculateXPGain(won, analysisResult.accuracy, analysisResult.blunders.length);
        const { newXp, newLevel, leveledUp } = applyXPGain(
          stats.xp,
          stats.level,
          gain.total
        );

        updateStats({
          level: newLevel,
          xp: newXp,
          coins: stats.coins + Math.floor(gain.total / 5),
          gamesPlayed: stats.gamesPlayed + 1,
          wins: won ? stats.wins + 1 : stats.wins,
        });

        setXpToast({ xpGain: gain, newLevel, leveledUp });
      }
    },
    [analyzePGN, stats, updateStats]
  );

  const handlePlayAgain = () => {
    setAnalysis(null);
    setView("game");
  };

  const handleBackToSetup = () => {
    setAnalysis(null);
    setMatchId(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, "", window.location.pathname);
    }
    setView("setup");
  };

  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === "vs-online") {
      const newMatchId = Math.random().toString(36).substring(2, 10);
      setMatchId(newMatchId);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, "", `?match=${newMatchId}`);
      }
    }
    setView("game");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Setup Screen ── */}
        {view === "setup" && (
          <SetupScreen
            gameMode={gameMode}
            onModeChange={setGameMode}
            onStart={() => handleStartGame(gameMode)}
            isEngineReady={isReady}
            playerStats={playerStats}
          />
        )}

        {/* ── Game Screen ── */}
        {view === "game" && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: board */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={handleBackToSetup}
                  className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-sm"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
                <div className="h-4 w-px bg-aura-border" />
                <span className="text-sm text-gray-400">
                  {gameMode === "vs-ai" ? (
                    <span className="flex items-center gap-1.5">
                      <Cpu size={13} className="text-garden-400" />
                      vs. AI Opponent
                    </span>
                  ) : gameMode === "vs-human" ? (
                    <span className="flex items-center gap-1.5">
                      <Users size={13} className="text-bloom-pink" />
                      Two Players (Local)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <Link2 size={13} />
                      Online Match
                    </span>
                  )}
                </span>
                {gameMode === "vs-online" && matchId && (
                  <ShareLinkButton matchId={matchId} />
                )}
              </div>

              <ChessBoardComponent
                onGameEnd={handleGameEnd}
                playAgainstAI={gameMode === "vs-ai"}
                engineMoveFetcher={getBestMove}
                matchId={gameMode === "vs-online" ? matchId : null}
              />
            </div>

            {/* Right sidebar: player stats */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">
              <PlayerStatsCard stats={playerStats} username="Strategist" />

              {/* Engine status */}
              <div
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs border",
                  isReady
                    ? "bg-garden-400/5 border-garden-400/20 text-garden-400"
                    : "bg-aura-card border-aura-border text-gray-500"
                )}
              >
                <FlaskConical size={12} />
                Stockfish {isReady ? "ready" : "loading..."}
              </div>
            </div>
          </div>
        )}

        {/* ── Analysis Screen ── */}
        {view === "analysis" && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: analysis panel */}
            <div className="flex-1 min-w-0">
              <GameAnalysis
                analysis={analysis}
                isAnalyzing={isAnalyzing}
                onPlayAgain={handlePlayAgain}
              />
            </div>

            {/* Right: updated stats */}
            <div className="w-full lg:w-64 shrink-0">
              <PlayerStatsCard stats={playerStats} username="Strategist" />
            </div>
          </div>
        )}
      </div>

      {/* XP Toast */}
      {xpToast && (
        <LevelUpToast
          newLevel={xpToast.newLevel}
          xpGain={xpToast.xpGain}
          leveledUp={xpToast.leveledUp}
          onClose={() => setXpToast(null)}
        />
      )}
    </div>
  );
}

// ─── Setup Screen sub-component ───

interface SetupScreenProps {
  gameMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onStart: () => void;
  isEngineReady: boolean;
  playerStats: ReturnType<typeof buildPlayerStats>;
}

function SetupScreen({ gameMode, onModeChange, onStart, isEngineReady, playerStats }: SetupScreenProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-8 page-transition">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-display font-bold gradient-text-garden">
          Ready to Play?
        </h1>
        <p className="text-gray-400">Choose your mode and begin your thinking session.</p>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            id: "vs-ai" as GameMode,
            icon: <Cpu size={28} className="text-garden-400" />,
            title: "vs. AI",
            desc: "Practice against a simple computer opponent.",
            tag: "Solo training",
          },
          {
            id: "vs-human" as GameMode,
            icon: <Users size={28} className="text-bloom-pink" />,
            title: "vs. Friend",
            desc: "Pass and play locally with another person.",
            tag: "Same device",
          },
          {
            id: "vs-online" as GameMode,
            icon: <Link2 size={28} className="text-blue-400" />,
            title: "Play Online",
            desc: "Generate link & play peer-to-peer via Network.",
            tag: "Remote play",
          },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={cn(
              "text-left p-5 rounded-2xl border transition-all duration-200 space-y-3 cursor-pointer",
              gameMode === mode.id
                ? "border-garden-400/40 bg-garden-400/8 shadow-glow-green"
                : "border-aura-border bg-aura-card hover:border-aura-muted hover:bg-aura-muted"
            )}
          >
            <div className="flex items-start justify-between">
              {mode.icon}
              {gameMode === mode.id && (
                <span className="text-xs text-garden-400 font-medium border border-garden-400/30 px-2 py-0.5 rounded-full">
                  Selected
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-white">{mode.title}</p>
              <p className="text-sm text-gray-500 mt-0.5">{mode.desc}</p>
            </div>
            <span className="text-xs text-gray-600">{mode.tag}</span>
          </button>
        ))}
      </div>

      {/* Player mini stats */}
      <PlayerStatsCard stats={playerStats} username="Strategist" compact />

      {/* Start button */}
      <Button
        variant="primary"
        size="lg"
        onClick={onStart}
        className="w-full"
        disabled={!isEngineReady}
      >
        {isEngineReady ? (
          <>
            <ChevronLeft size={0} />
            {gameMode === "vs-ai" ? "Play vs AI" : gameMode === "vs-human" ? "Start Local Game" : "Create Link & Play"}
          </>
        ) : (
          "Loading Engine..."
        )}
      </Button>
    </div>
  );
}

function ShareLinkButton({ matchId }: { matchId: string }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    const link = `${window.location.origin}/game?match=${matchId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copyLink}
      className={cn(
        "ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
        copied
          ? "bg-garden-400/20 text-garden-400 border-garden-400/30"
          : "bg-aura-card text-gray-400 border-aura-border hover:text-white"
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied!" : "Copy Invite Link"}
    </button>
  );
}
