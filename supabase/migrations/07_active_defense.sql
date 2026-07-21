-- ACTIVE DEFENSE SYSTEM TABLES
-- Stores security attack logs and blocked IPs.
-- RLS is enabled with no public policies, meaning only the Server (Service Role) can access them.

-- 1. Create IP Blocks Table
CREATE TABLE IF NOT EXISTS public.ip_blocks (
    ip VARCHAR(100) PRIMARY KEY,
    blocked_until TIMESTAMP WITH TIME ZONE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on ip_blocks
ALTER TABLE public.ip_blocks ENABLE ROW LEVEL SECURITY;

-- 2. Create Security Logs Table
CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ip VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_agent TEXT,
    endpoint TEXT,
    method VARCHAR(10) NOT NULL,
    attack_type VARCHAR(100) NOT NULL,
    risk_score INTEGER DEFAULT 0,
    action_taken VARCHAR(100) NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on security_logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Create Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_security_logs_timestamp ON public.security_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip ON public.security_logs(ip);
CREATE INDEX IF NOT EXISTS idx_ip_blocks_blocked_until ON public.ip_blocks(blocked_until);
