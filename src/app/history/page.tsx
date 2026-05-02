"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEMO_GAME_HISTORY } from "@/lib/demo-data";
import {
  Trophy,
  Flag,
  Handshake,
  Clock,
  BarChart3,
  Sword,
  ChevronRight,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { GameResult } from "@/lib/types";

const LEVEL = 5;
const XP = 340;
const XP_NEEDED = 317;

export default function HistoryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold gradient-text-aura">Game History</h1>
            <p className="text-gray-500 text-sm mt-1">
              Every game is a chapter of your growth.
            </p>
          </div>
          <Link href="/game">
            <Button variant="primary" size="sm">
              <Sword size={14} />
              New Game
            </Button>
          </Link>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Played", value: DEMO_GAME_HISTORY.length, icon: <Calendar size={15} />, color: "text-gray-300" },
            { label: "Wins", value: DEMO_GAME_HISTORY.filter(g => g.result === "white").length, icon: <Trophy size={15} />, color: "text-bloom-sun" },
            { label: "Draws", value: DEMO_GAME_HISTORY.filter(g => g.result === "draw").length, icon: <Handshake size={15} />, color: "text-blue-400" },
            { label: "Losses", value: DEMO_GAME_HISTORY.filter(g => g.result === "black").length, icon: <Flag size={15} />, color: "text-red-400" },
          ].map((s, i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-3 py-4">
                <span className={s.color}>{s.icon}</span>
                <div>
                  <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                  <p className="text-xs text-gray-600">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game list */}
        <Card>
          <CardContent className="p-0">
            <div className="px-5 py-4 border-b border-aura-border flex items-center gap-2">
              <BarChart3 size={14} className="text-garden-400" />
              <CardTitle>Recent Games</CardTitle>
            </div>

            {DEMO_GAME_HISTORY.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <span className="text-4xl">♟️</span>
                <p className="text-gray-500 text-sm">No games yet — play your first game!</p>
                <Link href="/game">
                  <Button variant="primary" size="sm" className="mt-2">Play Now</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-aura-border">
                {DEMO_GAME_HISTORY.map((game, idx) => (
                  <GameRow key={idx} game={game} idx={idx} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface DemoGame {
  result: GameResult;
  date: string;
  moves: number;
  accuracy: number;
  blunders: number;
  mistakes: number;
  xpEarned: number;
  opponent: string;
}

function GameRow({ game, idx }: { game: DemoGame; idx: number }) {
  const resultConfig: Record<GameResult, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
    white: {
      icon: <Trophy size={13} />,
      label: "Victory",
      color: "text-bloom-sun",
      bg: "bg-bloom-sun/10",
    },
    black: {
      icon: <Flag size={13} />,
      label: "Defeat",
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
    draw: {
      icon: <Handshake size={13} />,
      label: "Draw",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    abandoned: {
      icon: <Flag size={13} />,
      label: "Resigned",
      color: "text-gray-500",
      bg: "bg-gray-500/10",
    },
  };

  const r = resultConfig[game.result];
  const accuracyColor =
    game.accuracy >= 80
      ? "text-garden-400"
      : game.accuracy >= 60
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div
      className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-aura-muted/40 transition-colors group analysis-card"
      style={{ animationDelay: `${idx * 0.07}s` }}
    >
      {/* Result badge */}
      <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit", r.bg)}>
        <span className={r.color}>{r.icon}</span>
        <span className={cn("text-xs font-semibold", r.color)}>{r.label}</span>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {game.date}
        </span>
        <span>{game.moves} moves</span>
        <span>vs. {game.opponent}</span>
        <span className={cn("font-medium", accuracyColor)}>
          {game.accuracy}% accuracy
        </span>
        {game.blunders > 0 && (
          <span className="text-red-400">{game.blunders} blunder{game.blunders > 1 ? "s" : ""}</span>
        )}
      </div>

      {/* XP earned */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-bold text-garden-400">+{game.xpEarned} XP</span>
        <ChevronRight
          size={14}
          className="text-gray-700 group-hover:text-gray-400 transition-colors"
        />
      </div>
    </div>
  );
}
