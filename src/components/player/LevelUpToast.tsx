"use client";

import React, { useEffect, useRef } from "react";
import { XPGain } from "@/lib/types";
import { Sparkles, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelUpToastProps {
  newLevel: number;
  xpGain: XPGain;
  leveledUp: boolean;
  onClose: () => void;
}

/**
 * Animated toast notification for XP gains and level-ups.
 */
export function LevelUpToast({ newLevel, xpGain, leveledUp, onClose }: LevelUpToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(onClose, 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 max-w-xs w-full rounded-2xl p-4 shadow-2xl",
        "border animate-bloom",
        leveledUp
          ? "bg-gradient-to-br from-garden-500/20 to-bloom-lavender/20 border-garden-400/40"
          : "bg-aura-card border-aura-border"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        {leveledUp ? (
          <div className="w-9 h-9 rounded-xl bg-garden-400/15 flex items-center justify-center level-up-anim">
            <Star size={18} className="text-garden-400" />
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-bloom-lavender/15 flex items-center justify-center">
            <TrendingUp size={18} className="text-bloom-lavender" />
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-white">
            {leveledUp ? `🎉 Level Up! → Level ${newLevel}` : "XP Earned!"}
          </p>
          <p className="text-xs text-gray-400">
            {leveledUp ? "Your garden grows stronger" : "Keep training"}
          </p>
        </div>
        <button onClick={onClose} className="ml-auto text-gray-600 hover:text-gray-400 text-xs">
          ✕
        </button>
      </div>

      {/* XP breakdown */}
      <div className="space-y-1.5 text-xs">
        <XPRow label="Game completed" value={xpGain.base} />
        {xpGain.winBonus > 0 && <XPRow label="Victory bonus" value={xpGain.winBonus} />}
        {xpGain.accuracyBonus > 0 && <XPRow label="Accuracy bonus" value={xpGain.accuracyBonus} />}
        <div className="pt-1.5 border-t border-aura-border flex items-center justify-between">
          <span className="font-semibold text-white flex items-center gap-1">
            <Sparkles size={12} className="text-bloom-sun" />
            Total XP
          </span>
          <span className="font-bold text-garden-400">+{xpGain.total} XP</span>
        </div>
      </div>
    </div>
  );
}

function XPRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-gray-500">
      <span>{label}</span>
      <span className="text-gray-300 font-medium">+{value}</span>
    </div>
  );
}
