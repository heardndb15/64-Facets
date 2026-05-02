"use client";

import React from "react";
import { GardenMini } from "@/components/garden/GardenDisplay";
import { XPBar } from "@/components/ui/progress-bars";
import { Sword, LayoutDashboard, History, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavbarProps {
  level?: number;
  xp?: number;
  xpToNextLevel?: number;
  username?: string;
}

/**
 * Top navigation bar with player level, XP, and garden stage.
 */
export function Navbar({
  level = 1,
  xp = 0,
  xpToNextLevel = 100,
  username = "Strategist",
}: NavbarProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/game", label: "Play", icon: Sword },
    { href: "/dashboard", label: "Garden", icon: LayoutDashboard },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-aura-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl" aria-hidden>♟️</span>
            <span className="font-display font-bold text-white group-hover:gradient-text-garden transition-all duration-300 text-lg hidden sm:block">
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
                    : "text-gray-400 hover:text-white hover:bg-aura-muted"
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:block">{label}</span>
              </Link>
            ))}
          </div>

          {/* Player stats */}
          <div className="flex items-center gap-3">
            {/* XP mini bar */}
            <div className="hidden md:flex flex-col gap-1 w-28">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Lv. {level}</span>
                <span className="text-gray-600">{xp}/{xpToNextLevel}</span>
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
              <span className="text-sm font-medium text-white hidden sm:block">{username}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
