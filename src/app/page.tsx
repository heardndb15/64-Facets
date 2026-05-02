"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GardenScene } from "@/components/garden/GardenDisplay";
import {
  Brain,
  Sword,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Leaf,
  Zap,
  Star,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Sword size={22} className="text-garden-400" />,
    title: "Live Chess Arena",
    desc: "Play fully validated chess with smooth drag-and-drop. Legal moves only — powered by chess.js.",
    glow: "glow-green",
  },
  {
    icon: <Brain size={22} className="text-bloom-lavender" />,
    title: "AI Coach (Gemini)",
    desc: "After each game, Gemini turns Stockfish data into human metaphors: 'You lost the center like a garden without roots.'",
    glow: "glow-purple",
  },
  {
    icon: <TrendingUp size={22} className="text-bloom-pink" />,
    title: "RPG Progression",
    desc: "Earn XP, level up, and watch your digital garden evolve from a seed to an ancient mythical tree.",
    glow: "glow-pink",
  },
  {
    icon: <Zap size={22} className="text-bloom-sun" />,
    title: "Deep Analysis",
    desc: "Every blunder and mistake detected by Stockfish, ranked by severity, with move-by-move review.",
    glow: "",
  },
];

const GARDEN_STAGES = [
  { level: 1, emoji: "🌱", label: "Seed", desc: "Your first steps" },
  { level: 5, emoji: "🌸", label: "Bloom", desc: "Growing patterns" },
  { level: 10, emoji: "🌲", label: "Tree", desc: "Deep roots" },
  { level: 16, emoji: "✨🌳", label: "Mythic", desc: "Legendary" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* ─── Hero ─── */}
      <section
        className="relative min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(74,222,128,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(196,181,253,0.06) 0%, transparent 60%), #0f1117",
        }}
      >
        {/* Floating background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          {[
            { top: "12%", left: "8%", size: 6, color: "#4ade80", delay: 0 },
            { top: "20%", left: "88%", size: 4, color: "#f9a8d4", delay: 1.2 },
            { top: "65%", left: "5%",  size: 5, color: "#c4b5fd", delay: 2.1 },
            { top: "72%", left: "92%", size: 7, color: "#fde68a", delay: 0.7 },
            { top: "40%", left: "95%", size: 4, color: "#6ee7b7", delay: 1.8 },
            { top: "85%", left: "20%", size: 5, color: "#f9a8d4", delay: 0.4 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-50"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                background: p.color,
                animation: `float 6s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
                filter: "blur(1px)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-garden-400/20 text-xs font-medium text-garden-400">
            <Sparkles size={12} />
            AI-Powered Chess Training Platform
            <Sparkles size={12} />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight tracking-tight">
            <span className="text-white">Aura</span>
            {" "}
            <span className="gradient-text-garden">Chess</span>
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-400 font-normal italic">
              The Garden of Strategy
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Every match is a{" "}
            <span className="text-garden-400">thinking session</span>.
            Every mistake is a{" "}
            <span className="text-bloom-pink">lesson</span>.
            Watch your mind{" "}
            <span className="text-bloom-lavender">bloom</span>{" "}
            into a garden of mastery.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center flex-wrap gap-4">
            <Link href="/game">
              <Button variant="primary" size="lg">
                <Sword size={18} />
                Start Playing
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg">
                <Leaf size={18} />
                My Garden
              </Button>
            </Link>
          </div>

          {/* Mini chess icon row */}
          <div className="flex items-center justify-center gap-4 pt-4">
            {["♟", "♞", "♝", "♜", "♛", "♚"].map((piece, i) => (
              <span
                key={i}
                className="text-2xl opacity-20 hover:opacity-60 transition-opacity cursor-default select-none"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {piece}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-bold gradient-text-aura">
            More Than Chess
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            A cognitive training system that gamifies every move you make.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <Card key={i} variant="glass" hover className={f.glow ? `shadow-${f.glow}` : ""}>
              <CardContent className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-aura-muted flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Garden Progression ─── */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Watch Your Garden <span className="gradient-text-garden">Grow</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Your level reflects your growth. From a tiny seed to an ancient tree of wisdom.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {GARDEN_STAGES.map((stage) => (
            <Card key={stage.level} variant="glass" hover className="text-center">
              <CardContent className="space-y-3">
                <span className="text-4xl select-none block">{stage.emoji}</span>
                <div>
                  <p className="font-bold text-white text-sm">{stage.label}</p>
                  <p className="text-xs text-gray-500">Lv. {stage.level}+</p>
                  <p className="text-xs text-gray-600 mt-1">{stage.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live garden preview */}
        <div className="mt-10 max-w-sm mx-auto space-y-3">
          <p className="text-center text-xs text-gray-600 uppercase tracking-widest">
            Preview — Level 10 Garden
          </p>
          <GardenScene level={10} />
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl font-display font-bold text-white">How It Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: <Sword size={20} className="text-garden-400" />,
              title: "Play a Game",
              desc: "Challenge the AI or a friend. Every move is tracked.",
              color: "text-garden-400",
              border: "border-garden-400/20",
            },
            {
              step: "02",
              icon: <Brain size={20} className="text-bloom-lavender" />,
              title: "Get Analyzed",
              desc: "Stockfish evaluates every position. Gemini translates it into plain English.",
              color: "text-bloom-lavender",
              border: "border-bloom-lavender/20",
            },
            {
              step: "03",
              icon: <Star size={20} className="text-bloom-sun" />,
              title: "Grow & Level Up",
              desc: "Earn XP, grow your garden, and build your inner grandmaster.",
              color: "text-bloom-sun",
              border: "border-bloom-sun/20",
            },
          ].map((item) => (
            <div key={item.step} className={`relative p-6 rounded-2xl border ${item.border} bg-aura-card space-y-4`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${item.color} opacity-60`}>
                Step {item.step}
              </span>
              <div className={`w-10 h-10 rounded-xl bg-aura-muted flex items-center justify-center`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="py-24 px-4">
        <div
          className="max-w-3xl mx-auto text-center rounded-3xl p-12 space-y-6"
          style={{
            background: "linear-gradient(135deg, rgba(74,222,128,0.08) 0%, rgba(196,181,253,0.06) 50%, rgba(249,168,212,0.08) 100%)",
            border: "1px solid rgba(74,222,128,0.15)",
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Ready to grow?
          </h2>
          <p className="text-gray-400 text-lg">
            Plant your first game. Your garden is waiting.
          </p>
          <Link href="/game">
            <Button variant="garden" size="lg">
              <Leaf size={18} />
              Begin Your Journey
              <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-aura-border py-8 px-4 text-center text-gray-700 text-xs">
        <p>Aura Chess — The Garden of Strategy &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Built with Next.js · chess.js · Stockfish · Gemini AI</p>
      </footer>
    </main>
  );
}
