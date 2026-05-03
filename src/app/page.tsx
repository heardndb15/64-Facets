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
  Check,
  Crown,
} from "lucide-react";

const FEATURES = [
  {
    icon: <Sword size={22} className="text-garden-400" />,
    title: "Живая Шахматная Арена",
    desc: "Играйте в полностью валидируемые шахматы с плавным управлением. Только легальные ходы — работает на chess.js.",
    glow: "glow-green",
  },
  {
    icon: <Brain size={22} className="text-bloom-lavender" />,
    title: "ИИ-Тренер (Gemini)",
    desc: "После каждой партии Gemini превращает данные Stockfish в понятные метафоры: 'Вы потеряли центр, как сад без корней.'",
    glow: "glow-purple",
  },
  {
    icon: <TrendingUp size={22} className="text-bloom-pink" />,
    title: "RPG Прогрессия",
    desc: "Зарабатывайте опыт, повышайте уровень и наблюдайте, как ваш цифровой сад эволюционирует от семечка до древнего мифического древа.",
    glow: "glow-pink",
  },
  {
    icon: <Zap size={22} className="text-bloom-sun" />,
    title: "Глубокий Анализ",
    desc: "Каждый зевок и ошибка обнаруживаются Stockfish, сортируются по серьезности, с пошаговым разбором.",
    glow: "",
  },
];

const GARDEN_STAGES = [
  { level: 1, emoji: "🌱", label: "Семя", desc: "Ваши первые шаги" },
  { level: 5, emoji: "🌸", label: "Цветок", desc: "Растущие узоры" },
  { level: 10, emoji: "🌲", label: "Дерево", desc: "Глубокие корни" },
  { level: 16, emoji: "✨🌳", label: "Миф", desc: "Легендарность" },
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
            Платформа Тренировки на базе ИИ
            <Sparkles size={12} />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight tracking-tight">
            <span className="text-aura-fg">Aura</span>
            {" "}
            <span className="gradient-text-garden">Chess</span>
            <br />
            <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-500 font-normal italic">
              Сад Стратегий
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Каждая партия — это{" "}
            <span className="text-garden-500 dark:text-garden-400">сессия размышлений</span>.
            Каждая ошибка — это{" "}
            <span className="text-bloom-rose dark:text-bloom-pink">урок</span>.
            Наблюдайте, как ваш разум{" "}
            <span className="text-bloom-purple dark:text-bloom-lavender">расцветает</span>{" "}
            в сад мастерства.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center justify-center flex-wrap gap-4">
            <Button variant="primary" size="lg" asChild>
              <Link href="/game">
                <Sword size={18} />
                Начать Игру
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/dashboard">
                <Leaf size={18} />
                Мой Сад
              </Link>
            </Button>
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
            Больше, чем просто шахматы
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Система когнитивной тренировки, геймифицирующая каждый ваш ход.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <Card key={i} variant="glass" hover className={f.glow ? `shadow-${f.glow}` : ""}>
              <CardContent className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-aura-muted flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-aura-fg text-sm">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Garden Progression ─── */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-aura-fg">
            Наблюдайте, как <span className="gradient-text-garden">растет</span> ваш сад
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Ваш уровень отражает ваш рост. От крошечного семечка до древнего древа мудрости.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {GARDEN_STAGES.map((stage) => (
            <Card key={stage.level} variant="glass" hover className="text-center">
              <CardContent className="space-y-3">
                <span className="text-4xl select-none block">{stage.emoji}</span>
                <div>
                  <p className="font-bold text-aura-fg text-sm">{stage.label}</p>
                  <p className="text-xs text-gray-500">Ур. {stage.level}+</p>
                  <p className="text-xs text-gray-600 mt-1">{stage.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Live garden preview */}
        <div className="mt-10 max-w-sm mx-auto space-y-3">
          <p className="text-center text-xs text-gray-500 uppercase tracking-widest">
            Предпросмотр — Сад 10 уровня
          </p>
          <GardenScene level={10} />
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl font-display font-bold text-aura-fg">Как это работает</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: <Sword size={20} className="text-garden-400" />,
              title: "Сыграйте партию",
              desc: "Бросьте вызов ИИ или другу. Каждый ход отслеживается.",
              color: "text-garden-400",
              border: "border-garden-400/20",
            },
            {
              step: "02",
              icon: <Brain size={20} className="text-bloom-lavender" />,
              title: "Получите анализ",
              desc: "Stockfish оценивает позицию. Gemini переводит это на понятный язык.",
              color: "text-bloom-lavender",
              border: "border-bloom-lavender/20",
            },
            {
              step: "03",
              icon: <Star size={20} className="text-bloom-sun" />,
              title: "Растите и улучшайтесь",
              desc: "Зарабатывайте опыт, растите свой сад и становитесь гроссмейстером.",
              color: "text-bloom-sun",
              border: "border-bloom-sun/20",
            },
          ].map((item) => (
            <div key={item.step} className={`relative p-6 rounded-2xl border ${item.border} bg-aura-card space-y-4`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${item.color} opacity-60`}>
                Шаг {item.step}
              </span>
              <div className={`w-10 h-10 rounded-xl bg-aura-muted flex items-center justify-center`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-aura-fg">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Pro Version (Aura Premium) ─── */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-aura-fg">
            Откройте <span className="gradient-text-garden">Aura Premium</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Поднимите тренировки на новый уровень с эксклюзивными биомами и безлимитным ИИ анализом.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl border border-aura-border bg-aura-card/50 space-y-6">
            <h3 className="text-2xl font-bold text-aura-fg">Росток (Бесплатно)</h3>
            <p className="text-gray-500 text-sm">Идеально для новичков, делающих первые шаги.</p>
            <div className="text-3xl font-bold text-aura-fg mt-4">$0 <span className="text-lg text-gray-500 font-normal">/ навсегда</span></div>
            <ul className="space-y-4 mt-8">
              {[
                "Базовый ИИ-тренер (1 персонаж)", 
                "Стандартный лесной сад", 
                "1 глубокий анализ игры в день", 
                "Стандартные ежедневные задачи"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-500">
                  <Check size={16} className="text-gray-400" /> {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button variant="secondary" className="w-full bg-aura-muted/50 hover:bg-aura-muted text-aura-fg transition-colors duration-200" asChild>
                <Link href="/game" className="block w-full">Играть бесплатно</Link>
              </Button>
            </div>
          </div>

          {/* Pro Tier */}
          <div className="relative p-8 rounded-3xl border border-garden-400/30 bg-aura-card glass shadow-glow-green space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 bg-garden-400/20 text-garden-400 text-xs font-bold px-4 py-2 rounded-bl-xl border-b border-l border-garden-400/30 flex items-center gap-1.5 backdrop-blur-sm">
              <Crown size={14} /> PRO
            </div>
            <h3 className="text-2xl font-bold gradient-text-garden flex items-center gap-2">Гроссмейстер</h3>
            <p className="text-gray-400 text-sm">Для преданных игроков, желающих глубоких инсайтов.</p>
            <div className="text-3xl font-bold text-aura-fg mt-4">$9.99 <span className="text-lg text-gray-500 font-normal">/ месяц</span></div>
            <ul className="space-y-4 mt-8">
              {[
                "Несколько ИИ-персонажей (Дзен-мастер, Агрессор)", 
                "Эксклюзивные биомы (Дзен-сад, Сакура, Киберпанк)", 
                "Безлимитный анализ Stockfish + Gemini", 
                "Задачи на основе ваших ошибок",
                "Продвинутая аналитика"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <Check size={16} className="text-garden-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" /> {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button variant="garden" className="w-full" asChild>
                <Link href="/pricing" className="block w-full">Улучшить до Premium</Link>
              </Button>
            </div>
          </div>
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
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-aura-fg">
            Готовы расти?
          </h2>
          <p className="text-gray-500 text-lg">
            Посадите вашу первую игру. Сад ждет.
          </p>
          <Button variant="garden" size="lg" asChild>
            <Link href="/game">
              <Leaf size={18} />
              Начать Путешествие
              <ChevronRight size={16} />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-aura-border py-8 px-4 text-center text-gray-500 text-xs">
        <p>Aura Chess — Сад Стратегий &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Создано с Next.js · chess.js · Stockfish · Gemini AI</p>
      </footer>
    </main>
  );
}
