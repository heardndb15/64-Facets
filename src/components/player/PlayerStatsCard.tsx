"use client";

import React from "react";
import { PlayerStats } from "@/lib/types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { XPBar } from "@/components/ui/progress-bars";
import { GardenDisplay } from "@/components/garden/GardenDisplay";
import { Coins, Trophy, Sword, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerStatsCardProps {
  stats: PlayerStats;
  username?: string;
  compact?: boolean;
}

/**
 * RPG-style player stats card showing level, XP, garden stage, and game metrics.
 */
export function PlayerStatsCard({ stats, username = "Strategist", compact = false }: PlayerStatsCardProps) {
  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.wins / stats.gamesPlayed) * 100)
    : 0;

  if (compact) {
    return (
      <Card variant="glass" className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <GardenDisplay level={stats.level} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm truncate">{username}</p>
            <p className="text-xs text-gray-500">Level {stats.level}</p>
          </div>
          <div className="flex items-center gap-1 text-bloom-sun text-sm font-bold">
            <Coins size={13} />
            {stats.coins}
          </div>
        </div>
        <XPBar xp={stats.xp} xpToNextLevel={stats.xpToNextLevel} level={stats.level} />
      </Card>
    );
  }

  return (
    <Card variant="glass" glow="green">
      <CardContent className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-display">{username}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full bg-garden-400/10 text-garden-400 border border-garden-400/20 font-medium">
                Level {stats.level}
              </span>
              <span className="text-xs text-gray-500">{stats.gamesPlayed} games played</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-bloom-sun/10 border border-bloom-sun/20 rounded-xl px-3 py-1.5">
            <Coins size={14} className="text-bloom-sun" />
            <span className="text-bloom-sun font-bold text-sm">{stats.coins.toLocaleString()}</span>
          </div>
        </div>

        {/* Garden display */}
        <GardenDisplay level={stats.level} size="md" />

        {/* XP bar */}
        <XPBar
          xp={stats.xp}
          xpToNextLevel={stats.xpToNextLevel}
          level={stats.level}
          showLabel
        />

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-aura-border">
          <MiniStat
            icon={<Trophy size={14} className="text-bloom-sun" />}
            value={stats.wins}
            label="Wins"
            color="text-bloom-sun"
          />
          <MiniStat
            icon={<Sword size={14} className="text-bloom-pink" />}
            value={stats.gamesPlayed}
            label="Games"
            color="text-bloom-pink"
          />
          <MiniStat
            icon={<TrendingUp size={14} className="text-garden-400" />}
            value={`${winRate}%`}
            label="Win Rate"
            color="text-garden-400"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="flex items-center gap-1">
        {icon}
        <span className={cn("text-lg font-bold", color)}>{value}</span>
      </div>
      <span className="text-xs text-gray-600 uppercase tracking-wide">{label}</span>
    </div>
  );
}
