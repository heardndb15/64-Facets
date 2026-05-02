"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

  // Load from localStorage or Supabase
  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);

        if (session?.user) {
          // Fetch stats from Supabase
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (data && !error) {
            setStats({
              level: data.level || 1,
              xp: data.xp || 0,
              coins: data.coins || 0,
              gamesPlayed: data.gamesPlayed || 0,
              wins: data.wins || 0,
              username: session.user.user_metadata?.custom_claims?.global_name || session.user.email?.split("@")[0] || "Player",
            });
            return;
          }
        }
        
        // Fallback to localStorage
        const localStats = localStorage.getItem("aura_chess_stats");
        if (localStats) {
          setStats(JSON.parse(localStats));
        }

      } catch (err) {
        console.error("Error loading user:", err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (event === "SIGNED_IN") {
        loadUser();
      } else if (event === "SIGNED_OUT") {
        const localStats = localStorage.getItem("aura_chess_stats");
        setStats(localStats ? JSON.parse(localStats) : DEFAULT_STATS);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Update stats (both memory, localStorage, and supabase if logged in)
  const updateStats = async (updates: Partial<UserStats>) => {
    setStats((prev) => {
      const newStats = { ...prev, ...updates };
      
      // Save locally
      localStorage.setItem("aura_chess_stats", JSON.stringify(newStats));
      
      return newStats;
    });

    if (user) {
      // Sync with Supabase (fire and forget for UI responsiveness)
      supabase
        .from("users")
        .upsert({ 
          id: user.id, 
          email: user.email,
          updated_at: new Date().toISOString(),
          ...updates 
        })
        .then(({ error }) => {
          if (error) console.error("Error syncing to Supabase:", error);
        });
    }
  };

  const loginWithGithub = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'github' });
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
