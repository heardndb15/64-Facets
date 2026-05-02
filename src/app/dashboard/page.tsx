"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { GardenDisplay, GardenScene } from "@/components/garden/GardenDisplay";
import { XPBar } from "@/components/ui/progress-bars";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gardenStageInfo, getGardenStage, xpForLevel } from "@/lib/game-utils";
import {
  Sword,
  Trophy,
  TrendingUp,
  Coins,
  Star,
  Shield,
  Leaf,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Demo stats for MVP (replace with Supabase data in production)
const DEMO_STATS = {
  level: 5,
  xp: 340,
  coins: 72,
  gamesPlayed: 12,
  wins: 7,
  username: "Strategist",
};

const MILESTONE_LEVELS = [1, 3, 5, 8, 10, 15, 20];

export default function DashboardPage() {
  const { level, xp, coins, gamesPlayed, wins, username } = DEMO_STATS;
  const xpNeeded = xpForLevel(level);
  const stage = getGardenStage(level);
  const stageInfo = gardenStageInfo[stage];
  const winRate = gamesPlayed > 0 ? Math.round((wins / gamesPlayed) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar level={level} xp={xp} xpToNextLevel={xpNeeded} username={username} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Header row ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold gradient-text-garden">
              Your Garden
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              A living reflection of your strategic mind.
            </p>
          </div>
          <Link href="/game">
            <Button variant="primary">
              <Sword size={16} />
              Play Now
              <ChevronRight size={14} />
            </Button>
          </Link>
        </div>

        {/* ── Two column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: garden + progression */}
          <div className="lg:col-span-2 space-y-6">
            {/* Garden scene */}
            <Card variant="glass" glow="green">
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{username}&apos;s Garden</p>
                    <p className="text-xs text-gray-500 mt-0.5" style={{ color: stageInfo.color }}>
                      ✦ {stageInfo.label} Stage
                    </p>
                  </div>
                  <span className="text-xs text-gray-600 border border-aura-border px-3 py-1 rounded-full">
                    Level {level}
                  </span>
                </div>

                <GardenScene level={level} />

                <p className="text-xs text-gray-500 text-center italic">
                  {stageInfo.description}
                </p>
              </CardContent>
            </Card>

            {/* XP Progress */}
            <Card>
              <CardContent className="space-y-4">
                <CardTitle>Experience Progress</CardTitle>
                <XPBar xp={xp} xpToNextLevel={xpNeeded} level={level} showLabel />
                <p className="text-xs text-gray-600">
                  {xpNeeded - xp} XP until Level {level + 1}
                </p>
              </CardContent>
            </Card>

            {/* Level milestones */}
            <Card>
              <CardContent className="space-y-4">
                <CardTitle>Milestones</CardTitle>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-aura-border" />

                  <div className="space-y-3 pl-10">
                    {MILESTONE_LEVELS.map((mlvl) => {
                      const mlStage = getGardenStage(mlvl);
                      const mlInfo = gardenStageInfo[mlStage];
                      const done = level >= mlvl;
                      const current = level === mlvl;
                      return (
                        <div
                          key={mlvl}
                          className={cn(
                            "flex items-center gap-3 relative",
                            !done && "opacity-40"
                          )}
                        >
                          {/* Dot */}
                          <div
                            className={cn(
                              "absolute -left-6 w-3 h-3 rounded-full border-2 transition-all",
                              done
                                ? "border-garden-400 bg-garden-400/30"
                                : "border-aura-border bg-aura-bg",
                              current && "ring-2 ring-garden-400/40 scale-125"
                            )}
                          />
                          <span className="text-lg">{mlInfo.emoji.split("")[0]}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">
                              Level {mlvl} — {mlInfo.label}
                            </p>
                            <p className="text-xs text-gray-600 truncate">{mlInfo.description}</p>
                          </div>
                          {done && (
                            <Star size={12} className="text-bloom-sun shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: stats */}
          <div className="space-y-5">
            {/* Coins */}
            <Card variant="glass">
              <CardContent className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-bloom-sun/10 flex items-center justify-center shrink-0">
                  <Coins size={22} className="text-bloom-sun" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{coins.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Garden Coins</p>
                </div>
              </CardContent>
            </Card>

            {/* Stat cards */}
            {[
              {
                icon: <Trophy size={18} className="text-bloom-sun" />,
                value: wins,
                label: "Total Wins",
                bg: "bg-bloom-sun/10",
              },
              {
                icon: <Sword size={18} className="text-bloom-pink" />,
                value: gamesPlayed,
                label: "Games Played",
                bg: "bg-bloom-pink/10",
              },
              {
                icon: <TrendingUp size={18} className="text-garden-400" />,
                value: `${winRate}%`,
                label: "Win Rate",
                bg: "bg-garden-400/10",
              },
              {
                icon: <Shield size={18} className="text-bloom-lavender" />,
                value: level,
                label: "Current Level",
                bg: "bg-bloom-lavender/10",
              },
            ].map((stat, i) => (
              <Card key={i}>
                <CardContent className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", stat.bg)}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Garden wisdom quote */}
            <Card variant="garden">
              <CardContent className="space-y-2">
                <Leaf size={16} className="text-garden-400" />
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  &ldquo;Every piece you move is a thought you plant. Tend your garden carefully.&rdquo;
                </p>
                <p className="text-xs text-gray-600">— Aura Chess</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
