"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";

export interface UserStats {
  level: number;
  xp: number;
  coins: number;
  gamesPlayed: number;
  wins: number;
  username: string;
}

const DEFAULT_STATS: UserStats = {
  level: 1,
  xp: 0,
  coins: 0,
  gamesPlayed: 0,
  wins: 0,
  username: "Guest",
};

interface UserContextValue {
  stats: UserStats;
  updateStats: (updates: Partial<UserStats>) => void;
  user: any; // Supabase user
  loading: boolean;
  loginWithGithub: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage Only
  useEffect(() => {
    async function loadUser() {
      // 1. Optimistic load from localStorage immediately
      try {
        const localStats = localStorage.getItem("aura_chess_stats");
        if (localStats) {
          setStats(JSON.parse(localStats));
        }
      } catch (e) {
        console.error("Failed to parse local stats", e);
      }

      if (localStorage.getItem("mock_user_logged_in") === "true") {
        setUser({ id: "local-user", email: "player@example.com", user_metadata: { full_name: "Player" } });
      } else {
        setUser(null);
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  // Update stats (both memory, localStorage, and supabase if logged in)
  const updateStats = async (updates: Partial<UserStats>) => {
    setStats((prev) => {
      const newStats = { ...prev, ...updates };
      
      // Save locally
      localStorage.setItem("aura_chess_stats", JSON.stringify(newStats));
      
      return newStats;
    });

  };

  const loginWithGithub = async () => {
    setUser({ id: "local-user", email: "player@example.com", user_metadata: { full_name: "Player" } });
    localStorage.setItem("mock_user_logged_in", "true");
  };

  const loginWithGoogle = async () => {
    setUser({ id: "local-user", email: "player@example.com", user_metadata: { full_name: "Player" } });
    localStorage.setItem("mock_user_logged_in", "true");
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("mock_user_logged_in");
  };

  return (
    <UserContext.Provider value={{ stats, updateStats, user, loading, loginWithGithub, loginWithGoogle, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
