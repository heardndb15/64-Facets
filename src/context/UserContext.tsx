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
  loginLocal: (email: string, pass: string) => Promise<void>;
  registerLocal: (email: string, pass: string) => Promise<void>;
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

      const loggedEmail = localStorage.getItem("mock_user_logged_in");
      if (loggedEmail) {
        const users = JSON.parse(localStorage.getItem("aura_users") || "{}");
        const fullName = users[loggedEmail]?.fullName || loggedEmail.split("@")[0];
        setUser({ id: loggedEmail, email: loggedEmail, user_metadata: { full_name: fullName } });
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

  const registerLocal = async (email: string, pass: string) => {
    const existing = JSON.parse(localStorage.getItem("aura_users") || "{}");
    if (existing[email]) {
      throw new Error("Пользователь с таким email уже существует");
    }
    const fullName = email.split("@")[0];
    existing[email] = { password: pass, fullName };
    localStorage.setItem("aura_users", JSON.stringify(existing));
    
    setUser({ id: email, email, user_metadata: { full_name: fullName } });
    localStorage.setItem("mock_user_logged_in", email);
  };

  const loginLocal = async (email: string, pass: string) => {
    const existing = JSON.parse(localStorage.getItem("aura_users") || "{}");
    const foundUser = existing[email];
    if (!foundUser || foundUser.password !== pass) {
      throw new Error("Неверный email или пароль");
    }
    setUser({ id: email, email, user_metadata: { full_name: foundUser.fullName } });
    localStorage.setItem("mock_user_logged_in", email);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("mock_user_logged_in");
  };

  return (
    <UserContext.Provider value={{ stats, updateStats, user, loading, loginLocal, registerLocal, logout }}>
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
