"use client";

import React, { useEffect, useState } from "react";
import { AnalysisResult, MoveAnalysis } from "@/lib/types";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { AccuracyBar } from "@/components/ui/progress-bars";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Zap,
  Target,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Leaf,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GameAnalysisProps {
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  onPlayAgain: () => void;
}

interface AICoachFeedback {
  mainFeedback: string;
  insights: string[];
  positiveNote: string;
}

/**
 * Post-game analysis screen.
 * Shows accuracy, mistakes, blunders, and Gemini AI coaching feedback.
 */
export function GameAnalysis({ analysis, isAnalyzing, onPlayAgain }: GameAnalysisProps) {
  const [aiFeedback, setAIFeedback] = useState<AICoachFeedback | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [expandedMove, setExpandedMove] = useState<number | null>(null);

  // Fetch Gemini AI feedback when analysis is ready
  useEffect(() => {
    if (!analysis) return;
    fetchAICoach(analysis);
  }, [analysis]);

  async function fetchAICoach(data: AnalysisResult) {
    setIsLoadingAI(true);
    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blunders: data.blunders.length,
          mistakes: data.mistakes.length,
          inaccuracies: data.inaccuracies.length,
          accuracy: data.accuracy,
          result: "completed",
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setAIFeedback(json);
      }
    } catch {
      // Silently fail — analysis still shows without AI feedback
    } finally {
      setIsLoadingAI(false);
    }
  }

  if (isAnalyzing) {
    return <AnalyzingLoader />;
  }

  if (!analysis) return null;

  const badMoves = [
    ...analysis.blunders.map((m) => ({ ...m, type: "blunder" as const })),
    ...analysis.mistakes.map((m) => ({ ...m, type: "mistake" as const })),
    ...analysis.inaccuracies.slice(0, 5).map((m) => ({ ...m, type: "inaccuracy" as const })),
  ].sort((a, b) => a.moveNumber - b.moveNumber);

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display gradient-text-garden">
            Game Analysis
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {analysis.totalMoves} moves · {analysis.blunders.length} blunders · {analysis.mistakes.length} mistakes
          </p>
        </div>
        <Button variant="primary" onClick={onPlayAgain}>
          Play Again
        </Button>
      </div>

      {/* Accuracy + Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="garden" glow="green" className="col-span-1 sm:col-span-2">
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold uppercase tracking-wider">
              <BarChart3 size={14} />
              Accuracy
            </div>
            <AccuracyBar accuracy={analysis.accuracy} />
          </CardContent>
        </Card>

        <StatCard
          icon={<Zap size={16} className="text-red-400" />}
          label="Blunders"
          value={analysis.blunders.length}
          color="text-red-400"
          bg="bg-red-400/10"
        />
        <StatCard
          icon={<AlertTriangle size={16} className="text-orange-400" />}
          label="Mistakes"
          value={analysis.mistakes.length}
          color="text-orange-400"
          bg="bg-orange-400/10"
        />
      </div>

      {/* AI Coach section */}
      <Card variant="glass" glow="purple">
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-bloom-lavender/10">
              <Brain size={16} className="text-bloom-lavender" />
            </div>
            <h3 className="font-semibold text-white">AI Coach</h3>
            {isLoadingAI && (
              <span className="text-xs text-gray-500 animate-pulse ml-1">Thinking...</span>
            )}
          </div>

          {isLoadingAI ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-aura-muted rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} />
              ))}
            </div>
          ) : aiFeedback ? (
            <div className="space-y-4">
              {/* Main feedback */}
              <p className="text-gray-300 leading-relaxed text-sm">{aiFeedback.mainFeedback}</p>

              {/* Insights list */}
              <div className="space-y-2">
                {aiFeedback.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-bloom-lavender/15 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-bloom-lavender text-xs font-bold">{i + 1}</span>
                    </div>
                    <p className="text-gray-400">{insight}</p>
                  </div>
                ))}
              </div>

              {/* Positive note */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-garden-400/5 border border-garden-400/15">
                <Leaf size={16} className="text-garden-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">{aiFeedback.positiveNote}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">AI coach feedback unavailable. Check your Gemini API key.</p>
          )}
        </CardContent>
      </Card>

      {/* Move-by-move bad moves */}
      {badMoves.length > 0 && (
        <Card>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Target size={14} className="text-garden-400" />
              <CardTitle>Critical Moments</CardTitle>
            </div>
            <div className="space-y-2">
              {badMoves.map((move, idx) => (
                <MoveRow
                  key={idx}
                  move={move}
                  isExpanded={expandedMove === idx}
                  onToggle={() => setExpandedMove(expandedMove === idx ? null : idx)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* XP Earned teaser */}
      <Card variant="garden">
        <CardContent className="flex items-center gap-4">
          <Sparkles size={20} className="text-bloom-sun" />
          <div>
            <p className="text-sm font-semibold text-white">XP Earned!</p>
            <p className="text-xs text-gray-400">Check your dashboard to see your progress.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ----- Sub-components -----

function StatCard({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-2">
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", bg)}>
          {icon}
        </div>
        <div className={cn("text-3xl font-bold", color)}>{value}</div>
        <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
      </CardContent>
    </Card>
  );
}

function MoveRow({
  move,
  isExpanded,
  onToggle,
}: {
  move: MoveAnalysis & { type: "blunder" | "mistake" | "inaccuracy" };
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const typeConfig = {
    blunder: { label: "Blunder", cls: "badge-blunder", icon: "⚡" },
    mistake: { label: "Mistake", cls: "badge-mistake", icon: "⚠️" },
    inaccuracy: { label: "Inaccuracy", cls: "badge-inaccuracy", icon: "△" },
  }[move.type];

  return (
    <div
      className="rounded-xl border border-aura-border overflow-hidden cursor-pointer hover:border-aura-muted transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-center gap-3 p-3">
        <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", typeConfig.cls)}>
          {typeConfig.icon} {typeConfig.label}
        </span>
        <span className="text-sm text-white font-mono">
          {Math.ceil(move.moveNumber / 2)}. {move.move}
        </span>
        <span className="ml-auto text-gray-600">
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </div>
      {isExpanded && move.explanation && (
        <div className="px-4 pb-3 text-xs text-gray-400 border-t border-aura-border pt-2">
          {move.explanation}
        </div>
      )}
    </div>
  );
}

function AnalyzingLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-2 border-garden-400/20 animate-spin border-t-garden-400" />
        <span className="absolute inset-0 flex items-center justify-center text-xl">♟</span>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-white font-semibold">Analyzing Your Game</h3>
        <p className="text-gray-500 text-sm">Stockfish is reviewing every position...</p>
      </div>
      <div className="flex gap-2">
        {["Evaluating positions", "Detecting mistakes", "Preparing insights"].map((step, i) => (
          <div
            key={step}
            className="text-xs text-gray-600 px-3 py-1 rounded-full bg-aura-card border border-aura-border animate-pulse"
            style={{ animationDelay: `${i * 0.4}s` }}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  );
}
