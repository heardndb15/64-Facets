"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface XPBarProps {
  xp: number;
  xpToNextLevel: number;
  level: number;
  className?: string;
  showLabel?: boolean;
}

/**
 * Animated XP progress bar with shimmer effect.
 */
export function XPBar({ xp, xpToNextLevel, level, className, showLabel = true }: XPBarProps) {
  const percentage = Math.min(100, Math.round((xp / xpToNextLevel) * 100));

  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400 font-medium">Level {level}</span>
          <span className="text-gray-500">
            {xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
          </span>
        </div>
      )}
      <div className="h-2 bg-aura-muted rounded-full overflow-hidden relative">
        {/* Background glow */}
        <div
          className="absolute inset-0 rounded-full opacity-30"
          style={{
            background: "linear-gradient(90deg, #4ade80, #f9a8d4)",
            filter: "blur(4px)",
          }}
        />
        {/* Fill */}
        <div
          className="h-full rounded-full xp-bar-fill relative z-10"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-right text-xs text-gray-500">{percentage}%</div>
      )}
    </div>
  );
}

interface AccuracyBarProps {
  accuracy: number;
  className?: string;
}

/**
 * Accuracy bar with color coding (high = green, low = red).
 */
export function AccuracyBar({ accuracy, className }: AccuracyBarProps) {
  const color =
    accuracy >= 80
      ? "from-garden-400 to-garden-500"
      : accuracy >= 60
      ? "from-bloom-sun to-bloom-peach"
      : "from-red-400 to-rose-500";

  const label =
    accuracy >= 90 ? "Excellent" : accuracy >= 75 ? "Good" : accuracy >= 60 ? "Fair" : "Needs work";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">{accuracy}%</span>
        <span
          className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            accuracy >= 80
              ? "bg-garden-400/15 text-garden-400"
              : accuracy >= 60
              ? "bg-yellow-400/15 text-yellow-400"
              : "bg-red-400/15 text-red-400"
          )}
        >
          {label}
        </span>
      </div>
      <div className="h-3 bg-aura-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-1000", color)}
          style={{ width: `${accuracy}%` }}
        />
      </div>
    </div>
  );
}
