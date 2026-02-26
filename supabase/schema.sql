-- ============================================================================
-- TradeQuest — Supabase Database Schema
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================
-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  1. PROFILES — Extends Supabase Auth with gamification fields           ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR
SELECT USING (auth.uid() = id);
-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id);
-- Auto-create profile on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.profiles (id, username, display_name)
VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            'trader_' || LEFT(NEW.id::TEXT, 8)
        ),
        COALESCE(
            NEW.raw_user_meta_data->>'display_name',
            'New Trader'
        )
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  2. SCENARIOS — Catalog of trading scenarios                            ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS public.scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    asset_name TEXT NOT NULL,
    -- e.g. "ANON-TECH"
    news_headline TEXT NOT NULL,
    news_body TEXT,
    difficulty TEXT CHECK (
        difficulty IN ('beginner', 'intermediate', 'advanced')
    ) DEFAULT 'beginner',
    actual_outcome TEXT CHECK (actual_outcome IN ('UP', 'DOWN')) NOT NULL,
    xp_reward INTEGER DEFAULT 100,
    chart_days INTEGER DEFAULT 30,
    -- historical days shown
    reveal_days INTEGER DEFAULT 5,
    -- days revealed after prediction
    created_at TIMESTAMPTZ DEFAULT now()
);
-- Scenarios are public-readable
ALTER TABLE public.scenarios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Scenarios are publicly readable" ON public.scenarios FOR
SELECT USING (true);
-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  3. PREDICTIONS — Per-user prediction records                           ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
    user_prediction TEXT CHECK (user_prediction IN ('UP', 'DOWN')) NOT NULL,
    ml_prediction TEXT CHECK (ml_prediction IN ('UP', 'DOWN')),
    actual_outcome TEXT CHECK (actual_outcome IN ('UP', 'DOWN')),
    is_user_correct BOOLEAN,
    is_ml_correct BOOLEAN,
    xp_earned INTEGER DEFAULT 0,
    ai_explanation JSONB,
    -- Gemini response stored here
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
-- Users can read their own predictions
CREATE POLICY "Users can view own predictions" ON public.predictions FOR
SELECT USING (auth.uid() = user_id);
-- Users can insert their own predictions
CREATE POLICY "Users can create own predictions" ON public.predictions FOR
INSERT WITH CHECK (auth.uid() = user_id);
-- Unique constraint: one prediction per user per scenario
CREATE UNIQUE INDEX idx_unique_user_scenario ON public.predictions(user_id, scenario_id);
-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  4. LEARNING_PROGRESS — Tracks completed modules / takeaways            ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    scenario_id UUID NOT NULL REFERENCES public.scenarios(id) ON DELETE CASCADE,
    takeaway_read BOOLEAN DEFAULT false,
    notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own learning progress" ON public.learning_progress FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own learning progress" ON public.learning_progress FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own learning progress" ON public.learning_progress FOR
UPDATE USING (auth.uid() = user_id);
-- Unique constraint: one progress entry per user per scenario
CREATE UNIQUE INDEX idx_unique_user_learning ON public.learning_progress(user_id, scenario_id);
-- ╔═══════════════════════════════════════════════════════════════════════════╗
-- ║  5. SEED DATA — "The Zero-Day Vulnerability" scenario                   ║
-- ╚═══════════════════════════════════════════════════════════════════════════╝
INSERT INTO public.scenarios (
        slug,
        title,
        description,
        asset_name,
        news_headline,
        news_body,
        difficulty,
        actual_outcome,
        xp_reward,
        chart_days,
        reveal_days
    )
VALUES (
        'zero-day-vulnerability',
        'The Zero-Day Vulnerability',
        'A major cybersecurity breach rocks the tech industry. A zero-day exploit has been discovered in enterprise defense networks, compromising critical infrastructure worldwide. How will the market react?',
        'CYBERFORT (CBFT)',
        '🚨 BREAKING: Major cybersecurity breach. Hackers exploit a zero-day vulnerability, compromising enterprise defense networks.',
        'Security researchers have confirmed that a sophisticated threat actor has exploited a previously unknown vulnerability in CyberFort''s flagship enterprise defense platform. The breach has affected over 2,000 organizations globally, including Fortune 500 companies and government agencies. CyberFort''s stock is under intense scrutiny as investors assess the damage to the company''s reputation and the potential financial fallout from class-action lawsuits.',
        'beginner',
        'DOWN',
        150,
        30,
        5
    ) ON CONFLICT (slug) DO NOTHING;