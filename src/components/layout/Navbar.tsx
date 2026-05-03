"use client";

import React, { useState } from "react";
import { GardenMini } from "@/components/garden/GardenDisplay";
import { XPBar } from "@/components/ui/progress-bars";
import { Sword, LayoutDashboard, History, Settings, Crown, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { useUser } from "@/context/UserContext";
import { ProModal } from "@/components/ui/pro-modal";

export function Navbar() {
  const pathname = usePathname();
  const { stats, user, loginWithGithub, logout } = useUser();
  const { level, xp, username } = stats;
  // Fallback next level calc for navbar display
  const xpToNextLevel = level * 100;
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { href: "/game", label: "Играть", icon: Sword },
    { href: "/dashboard", label: "Сад", icon: LayoutDashboard },
    { href: "/history", label: "История", icon: History },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-aura-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl" aria-hidden>♟️</span>
            <span className="font-display font-bold text-aura-fg group-hover:gradient-text-garden transition-all duration-300 text-lg hidden sm:block">
              Aura<span className="gradient-text-garden"> Chess</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === href
                    ? "bg-garden-400/10 text-garden-400 border border-garden-400/20"
                    : "text-gray-500 dark:text-gray-400 hover:text-aura-fg hover:bg-aura-muted"
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:block">{label}</span>
              </Link>
            ))}
          </div>

          {/* Player stats & Auth */}
          <div className="flex items-center gap-3">
            {/* XP mini bar */}
            <div className="hidden md:flex flex-col gap-1 w-28">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Ур. {level}</span>
                <span className="text-gray-600 font-medium">{xp}/{xpToNextLevel}</span>
              </div>
              <div className="h-1.5 bg-aura-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full xp-bar-fill"
                  style={{ width: `${Math.min(100, (xp / xpToNextLevel) * 100)}%` }}
                />
              </div>
            </div>

            {/* Garden stage + username */}
            <div className="flex items-center gap-2 bg-aura-card border border-aura-border rounded-xl px-3 py-1.5">
              <GardenMini level={level} />
              <span className="text-sm font-medium text-aura-fg hidden sm:block">{username}</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-aura-muted hover:text-aura-fg transition-colors hidden sm:block"
              title="Переключить тему"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Pro Button */}
            <button 
              onClick={() => setIsProModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 ml-1 text-xs font-bold text-white bg-gradient-to-r from-garden-500 to-garden-400 hover:from-garden-400 hover:to-garden-300 rounded-lg shadow-glow-green transition-all"
            >
              <Crown size={14} /> PRO
            </button>

            {/* Auth Button */}
            {user ? (
              <button onClick={logout} className="text-xs ml-2 text-gray-500 dark:text-gray-400 hover:text-aura-fg transition-colors">
                Выйти
              </button>
            ) : (
              <button 
                onClick={loginWithGithub} 
                className="text-xs ml-2 bg-garden-500 hover:bg-garden-400 text-white px-2 py-1 rounded transition-colors"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </div>
      <ProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
    </nav>
  );
}
