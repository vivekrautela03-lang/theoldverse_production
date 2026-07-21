-- Hardening security tables by dropping permissive public policies.
-- ServerDb queries these tables via Service Role Key (supabaseAdmin), which bypasses RLS.
-- This ensures no anonymous or authenticated users can directly query or modify this data from the client side.

-- 1. users_db table
DROP POLICY IF EXISTS "Allow public read access to basic user profile information" ON public.users_db;
DROP POLICY IF EXISTS "Allow service role or admins to modify user profiles" ON public.users_db;

-- 2. sessions_db table
DROP POLICY IF EXISTS "Allow service role or admins to access all session data" ON public.sessions_db;

-- 3. rate_limits table
DROP POLICY IF EXISTS "Allow service role or admins to access rate limits" ON public.rate_limits;

-- 4. audit_logs table
DROP POLICY IF EXISTS "Allow service role or admins to view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow service role to append audit logs" ON public.audit_logs;

-- Confirm RLS is enabled on all custom security tables
ALTER TABLE public.users_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions_db ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
