"use client";

import React from "react";
import { gardenStageInfo, getGardenStage } from "@/lib/game-utils";
import { GardenStage } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GardenDisplayProps {
  level: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Visual "digital garden" indicator that evolves with player level.
 * Shows animated garden emoji + stage info + decorative particles.
 */
export function GardenDisplay({ level, className, size = "md" }: GardenDisplayProps) {
  const stage: GardenStage = getGardenStage(level);
  const info = gardenStageInfo[stage];

  const emojiSizes = { sm: "text-4xl", md: "text-6xl", lg: "text-8xl" };
  const labelSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      {/* Animated garden stage */}
      <div className="relative flex items-center justify-center">
        {/* Glow ring */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-xl scale-150"
          style={{ background: info.color }}
        />

        {/* Floating particles */}
        <div className="absolute w-full h-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full opacity-60"
              style={{
                background: info.color,
                top: `${20 + Math.sin(i * 60) * 40}%`,
                left: `${20 + Math.cos(i * 60) * 40}%`,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* Main emoji */}
        <span
          className={cn(emojiSizes[size], "garden-element relative z-10 select-none")}
          style={{ animationDuration: `${3 + level * 0.1}s` }}
        >
          {stage === "ancient" ? "🌳" : info.emoji}
        </span>
      </div>

      {/* Stage label */}
      <div className="text-center space-y-1">
        <div
          className={cn("font-bold", labelSizes[size])}
          style={{ color: info.color }}
        >
          {info.label}
        </div>
        {size !== "sm" && (
          <div className="text-xs text-gray-500 max-w-[180px] leading-relaxed text-center">
            {info.description}
          </div>
        )}
      </div>
    </div>
  );
}

interface GardenMiniProps {
  level: number;
}

/**
 * Compact single-line garden display for the navbar.
 */
export function GardenMini({ level }: GardenMiniProps) {
  const stage = getGardenStage(level);
  const info = gardenStageInfo[stage];
  return (
    <span
      className="text-lg select-none"
      title={`${info.label} — Level ${level}`}
    >
      {info.emoji.split("")[0]}
    </span>
  );
}

/**
 * Full garden scene with ground, sky, and multiple garden elements.
 */
export function GardenScene({ level }: { level: number }) {
  const stage = getGardenStage(level);
  const info = gardenStageInfo[stage];

  const elements = getGardenElements(stage);

  return (
    <div
      className="relative w-full h-40 rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0f1a2e 0%, #1a2744 40%, #162035 70%, #12291a 100%)",
      }}
    >
      {/* Stars */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white opacity-60"
          style={{
            top: `${Math.random() * 50}%`,
            left: `${Math.random() * 100}%`,
            animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Garden elements */}
      <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-4 px-6">
        {elements.map((el, i) => (
          <span
            key={i}
            className="select-none"
            style={{
              fontSize: el.size,
              animation: `sway ${3 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
              opacity: el.opacity,
            }}
          >
            {el.emoji}
          </span>
        ))}
      </div>

      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0 h-6 rounded-b-2xl"
        style={{
          background: "linear-gradient(to right, #1a3a1a, #244a24, #1a3a1a)",
        }}
      />

      {/* Level badge */}
      <div
        className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full"
        style={{ background: `${info.color}20`, color: info.color, border: `1px solid ${info.color}40` }}
      >
        Lv. {level}
      </div>
    </div>
  );
}

function getGardenElements(stage: GardenStage) {
  const base = [
    { emoji: "🌱", size: "20px", opacity: 0.7 },
  ];

  const stageMap: Record<GardenStage, typeof base> = {
    seed: [{ emoji: "🌱", size: "28px", opacity: 1 }],
    sprout: [
      { emoji: "🌱", size: "22px", opacity: 0.8 },
      { emoji: "🌿", size: "32px", opacity: 1 },
      { emoji: "🌱", size: "20px", opacity: 0.6 },
    ],
    plant: [
      { emoji: "🌿", size: "24px", opacity: 0.7 },
      { emoji: "🌸", size: "36px", opacity: 1 },
      { emoji: "🌿", size: "28px", opacity: 0.8 },
      { emoji: "🌱", size: "18px", opacity: 0.5 },
    ],
    bush: [
      { emoji: "🌿", size: "28px", opacity: 0.8 },
      { emoji: "🌺", size: "40px", opacity: 1 },
      { emoji: "🌸", size: "32px", opacity: 0.9 },
      { emoji: "🌿", size: "26px", opacity: 0.7 },
      { emoji: "🦋", size: "20px", opacity: 0.8 },
    ],
    "small-tree": [
      { emoji: "🌿", size: "24px", opacity: 0.7 },
      { emoji: "🌲", size: "52px", opacity: 1 },
      { emoji: "🌸", size: "30px", opacity: 0.9 },
      { emoji: "🌺", size: "28px", opacity: 0.8 },
      { emoji: "🦋", size: "22px", opacity: 0.9 },
    ],
    tree: [
      { emoji: "🌿", size: "28px", opacity: 0.7 },
      { emoji: "🌳", size: "64px", opacity: 1 },
      { emoji: "🦋", size: "24px", opacity: 0.9 },
      { emoji: "🌸", size: "32px", opacity: 0.8 },
      { emoji: "🌺", size: "30px", opacity: 0.9 },
      { emoji: "🦜", size: "22px", opacity: 0.8 },
    ],
    ancient: [
      { emoji: "✨", size: "20px", opacity: 0.9 },
      { emoji: "🌳", size: "72px", opacity: 1 },
      { emoji: "🦋", size: "26px", opacity: 0.9 },
      { emoji: "🌺", size: "34px", opacity: 1 },
      { emoji: "⭐", size: "20px", opacity: 0.8 },
      { emoji: "🦚", size: "28px", opacity: 0.9 },
      { emoji: "✨", size: "18px", opacity: 0.7 },
    ],
  };

  return stageMap[stage] || base;
}
