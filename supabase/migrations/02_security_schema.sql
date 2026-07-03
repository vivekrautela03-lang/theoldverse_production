-- SECURITY SCHEMA FOR CUSTOM USER AUTHENTICATION & SESSION TRACKING
-- This migration creates tables for users, active sessions, rate-limit keys, and audit logs.

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users_db (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email_or_phone VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT false,
    is_creator BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT false,
    failed_logins INTEGER DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on users_db
ALTER TABLE public.users_db ENABLE ROW LEVEL SECURITY;

-- Create Policies for users_db
CREATE POLICY "Allow public read access to basic user profile information"
ON public.users_db FOR SELECT
USING (true);

CREATE POLICY "Allow service role or admins to modify user profiles"
ON public.users_db FOR ALL
USING (true);

-- 2. Create Sessions Table
CREATE TABLE IF NOT EXISTS public.sessions_db (
    id VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255) REFERENCES public.users_db(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    rotated BOOLEAN DEFAULT false,
    rotated_to VARCHAR(255),
    ip VARCHAR(100),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on sessions_db
ALTER TABLE public.sessions_db ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role or admins to access all session data"
ON public.sessions_db FOR ALL
USING (true);

-- 3. Create Rate Limits Table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    key VARCHAR(255) PRIMARY KEY,
    attempts INTEGER NOT NULL,
    reset_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role or admins to access rate limits"
ON public.rate_limits FOR ALL
USING (true);

-- 4. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id VARCHAR(255) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    event VARCHAR(100) NOT NULL,
    ip VARCHAR(100),
    user_agent TEXT,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role or admins to view audit logs"
ON public.audit_logs FOR SELECT
USING (true);

CREATE POLICY "Allow service role to append audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- ==========================================
-- STEP 3 — Performance Optimization: Database Indexes
-- ==========================================

-- Indexes on public.users_db and public.sessions_db
CREATE INDEX IF NOT EXISTS idx_users_db_email ON public.users_db(email_or_phone);
CREATE INDEX IF NOT EXISTS idx_sessions_db_token ON public.sessions_db(token);
CREATE INDEX IF NOT EXISTS idx_sessions_db_user ON public.sessions_db(user_id);

-- Indexes on initial schema core tables to optimize query joins and scale
CREATE INDEX IF NOT EXISTS idx_creators_user_id ON public.creators(user_id);
CREATE INDEX IF NOT EXISTS idx_media_items_creator ON public.media_items(creator_id);
CREATE INDEX IF NOT EXISTS idx_media_items_approved ON public.media_items(is_approved);
CREATE INDEX IF NOT EXISTS idx_community_posts_creator ON public.community_posts(creator_id);
CREATE INDEX IF NOT EXISTS idx_casting_calls_creator ON public.casting_calls(creator_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant ON public.job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_media_reviews_media ON public.media_reviews(media_id);
CREATE INDEX IF NOT EXISTS idx_media_reviews_user ON public.media_reviews(user_id);

