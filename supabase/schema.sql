-- ============================================================
-- AURA CHESS — Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables.
-- ============================================================

-- Enable UUID extension (usually already enabled on Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────
-- TABLE: users
-- Stores player profile, level, XP, and coins.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       TEXT UNIQUE NOT NULL,
  username    TEXT NOT NULL DEFAULT 'Strategist',
  level       INTEGER NOT NULL DEFAULT 1,
  xp          INTEGER NOT NULL DEFAULT 0,
  coins       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by email
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (email);

-- ─────────────────────────────────────────────────────────────
-- TABLE: games
-- Stores each completed chess game with PGN and result.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.games (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pgn         TEXT NOT NULL DEFAULT '',
  result      TEXT NOT NULL CHECK (result IN ('white', 'black', 'draw', 'abandoned')),
  opponent    TEXT NOT NULL DEFAULT 'AI',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup of games by user
CREATE INDEX IF NOT EXISTS games_user_id_idx ON public.games (user_id);
CREATE INDEX IF NOT EXISTS games_created_at_idx ON public.games (created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- TABLE: analysis
-- Stores post-game Stockfish + AI analysis for each game.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.analysis (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id            UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  mistakes_count     INTEGER NOT NULL DEFAULT 0,
  blunders_count     INTEGER NOT NULL DEFAULT 0,
  inaccuracies_count INTEGER NOT NULL DEFAULT 0,
  accuracy           INTEGER NOT NULL DEFAULT 0 CHECK (accuracy BETWEEN 0 AND 100),
  ai_feedback        TEXT NOT NULL DEFAULT '',
  moves_analysis     JSONB DEFAULT '[]'::jsonb,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup of analysis by game
CREATE INDEX IF NOT EXISTS analysis_game_id_idx ON public.analysis (game_id);

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- Users can only read/write their own data.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis ENABLE ROW LEVEL SECURITY;

-- Users: read/update own row
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Allow inserting new user on signup
CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Games: users manage their own games
CREATE POLICY "Users can read own games"
  ON public.games FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own games"
  ON public.games FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Analysis: readable if user owns the parent game
CREATE POLICY "Users can read own analysis"
  ON public.analysis FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.games
      WHERE games.id = analysis.game_id
        AND games.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own analysis"
  ON public.analysis FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.games
      WHERE games.id = analysis.game_id
        AND games.user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────────────────────
-- FUNCTION: auto-update `updated_at` on users
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- FUNCTION: create user profile on auth.users insert
-- (Triggered when a user signs up via Supabase Auth)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', 'Strategist')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
