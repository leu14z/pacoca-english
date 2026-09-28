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

-- 6. RLS Policies
CREATE POLICY "Users can manage their own profile"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Users can manage their own progress"
  ON public.user_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Allow public read access to modules"
  ON public.modules FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to missions"
  ON public.missions FOR SELECT
  USING (true);

-- 7. Public Read of Profiles for Realtime Leaderboard
CREATE POLICY "Allow authenticated read of profiles for leaderboard"
  ON public.profiles FOR SELECT
  USING (true);
