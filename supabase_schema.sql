-- ============================================================
-- PAÇOCA ENGLISH - SUPABASE DATABASE SCHEMA (POSTGRESQL)
-- ============================================================

-- 1. Profiles Table (Linked to Supabase Auth Google / Email)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  level TEXT DEFAULT 'A1' CHECK (level IN ('A1', 'A2', 'B1')),
  total_xp INTEGER DEFAULT 0,
  hearts INTEGER DEFAULT 5 CHECK (hearts >= 0 AND hearts <= 5),
  streak_count INTEGER DEFAULT 0,
  last_activity_date DATE,
  placement_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1')),
  order_index INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Missions Table
CREATE TABLE IF NOT EXISTS public.missions (
  id TEXT PRIMARY KEY,
  module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  xp_reward INTEGER DEFAULT 20,
  order_index INTEGER NOT NULL,
  exercises JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  score_percentage INTEGER DEFAULT 100,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, mission_id)
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- 6. Remove restrictive foreign key constraints for client-side generated UUIDs
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.user_progress DROP CONSTRAINT IF EXISTS user_progress_user_id_fkey;

-- 7. RLS Policies
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated read of profiles for leaderboard" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read of profiles for leaderboard" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert and update on profiles" ON public.profiles;

-- Allow anyone to read profiles for the real-time leaderboard
CREATE POLICY "Allow public read of profiles for leaderboard"
  ON public.profiles FOR SELECT
  USING (true);

-- Allow students to insert and update their profile progress
CREATE POLICY "Allow public insert and update on profiles"
  ON public.profiles FOR ALL
  USING (true)
  WITH CHECK (true);

-- User Progress policies
DROP POLICY IF EXISTS "Users can manage their own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Allow public manage user_progress" ON public.user_progress;

CREATE POLICY "Allow public manage user_progress"
  ON public.user_progress FOR ALL
  USING (true)
  WITH CHECK (true);

-- Modules & Missions public read
CREATE POLICY "Allow public read access to modules"
  ON public.modules FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to missions"
  ON public.missions FOR SELECT
  USING (true);

-- 8. Enable Supabase Realtime for live Leaderboard broadcasting
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
