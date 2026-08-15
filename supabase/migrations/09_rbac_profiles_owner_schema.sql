-- Migration 09: Database-Backed Authorization Hierarchy (owner, admin, editor, customer)
-- Enforces RBAC constraints and Row Level Security (RLS) across TheOldverse Productions

-- 1. Ensure profiles table has valid role & status columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Add check constraint for role values if not already present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check'
    ) THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_role_check 
        CHECK (role IN ('owner', 'admin', 'editor', 'customer', 'user', 'creator'));
    END IF;
END $$;

-- 2. Security Definer Helper Function to fetch user role safely
CREATE OR REPLACE FUNCTION public.get_auth_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = user_uuid;
    RETURN COALESCE(user_role, 'customer');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 3. Security Definer Helper Function to check if user has admin/owner/editor privileges
CREATE OR REPLACE FUNCTION public.is_staff(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    u_role TEXT;
    u_status TEXT;
BEGIN
    SELECT role, status INTO u_role, u_status FROM public.profiles WHERE id = user_uuid;
    RETURN (u_status = 'active' AND u_role IN ('owner', 'admin', 'editor'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_owner(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    u_role TEXT;
    u_status TEXT;
BEGIN
    SELECT role, status INTO u_role, u_status FROM public.profiles WHERE id = user_uuid;
    RETURN (u_status = 'active' AND u_role = 'owner');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4. Role Protection Trigger: Protect Owner & Admin roles from unauthorized tampering
CREATE OR REPLACE FUNCTION public.protect_profile_roles()
RETURNS TRIGGER AS $$
DECLARE
    executor_role TEXT;
BEGIN
    -- Only evaluate role/status changes if executed by an authenticated user
    IF auth.uid() IS NOT NULL THEN
        executor_role := public.get_auth_user_role(auth.uid());

        -- Rule 1: Nobody can demote or alter an 'owner' profile unless the executor is also an 'owner'
        IF OLD.role = 'owner' AND executor_role != 'owner' THEN
            RAISE EXCEPTION 'Unauthorized: Only an existing Owner can modify or demote an Owner account.';
        END IF;

        -- Rule 2: Only an 'owner' can assign the 'owner' role to anyone
        IF NEW.role = 'owner' AND OLD.role != 'owner' AND executor_role != 'owner' THEN
            RAISE EXCEPTION 'Unauthorized: Only an Owner can promote users to the Owner role.';
        END IF;

        -- Rule 3: Regular admins cannot alter another admin or owner profile
        IF executor_role = 'admin' AND OLD.role IN ('owner', 'admin') AND auth.uid() != OLD.id THEN
            RAISE EXCEPTION 'Unauthorized: Administrators cannot modify other Admin or Owner profiles.';
        END IF;

        -- Rule 4: Editors and Customers cannot modify roles at all
        IF executor_role NOT IN ('owner', 'admin') AND NEW.role IS DISTINCT FROM OLD.role THEN
            RAISE EXCEPTION 'Unauthorized: You do not have permission to modify user access roles.';
        END IF;
    END IF;

    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach role protection trigger
DROP TRIGGER IF EXISTS before_profile_role_update ON public.profiles;
CREATE TRIGGER before_profile_role_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_roles();

-- 5. RLS Policies on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles public read access" ON public.profiles;
CREATE POLICY "Profiles public read access"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Profiles update policy" ON public.profiles;
CREATE POLICY "Profiles update policy"
ON public.profiles FOR UPDATE
USING (
    auth.uid() = id OR public.is_staff(auth.uid())
)
WITH CHECK (
    auth.uid() = id OR public.is_staff(auth.uid())
);

DROP POLICY IF EXISTS "Profiles delete policy" ON public.profiles;
CREATE POLICY "Profiles delete policy"
ON public.profiles FOR DELETE
USING (
    public.is_owner(auth.uid()) OR (public.get_auth_user_role(auth.uid()) = 'admin' AND role NOT IN ('owner', 'admin'))
);

-- 6. Enforce RLS Policies for CMS & Production Tables
-- Helper macro: Public read for published/visible rows, full staff access for owner/admin/editor

-- PROJECTS RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Projects public read" ON public.projects;
CREATE POLICY "Projects public read" ON public.projects FOR SELECT
USING (is_published = true OR public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Projects staff write" ON public.projects;
CREATE POLICY "Projects staff write" ON public.projects FOR INSERT
WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Projects staff update" ON public.projects;
CREATE POLICY "Projects staff update" ON public.projects FOR UPDATE
USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Projects staff delete" ON public.projects;
CREATE POLICY "Projects staff delete" ON public.projects FOR DELETE
USING (public.is_staff(auth.uid()));

-- PRODUCTIONS RLS
ALTER TABLE public.productions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Productions staff read" ON public.productions;
CREATE POLICY "Productions staff read" ON public.productions FOR SELECT
USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Productions staff write" ON public.productions;
CREATE POLICY "Productions staff write" ON public.productions FOR INSERT
WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Productions staff update" ON public.productions;
CREATE POLICY "Productions staff update" ON public.productions FOR UPDATE
USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Productions staff delete" ON public.productions;
CREATE POLICY "Productions staff delete" ON public.productions FOR DELETE
USING (public.is_staff(auth.uid()));

-- TEAM MEMBERS RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Team public read" ON public.team_members;
CREATE POLICY "Team public read" ON public.team_members FOR SELECT
USING (is_visible = true OR public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Team staff write" ON public.team_members;
CREATE POLICY "Team staff write" ON public.team_members FOR INSERT
WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Team staff update" ON public.team_members;
CREATE POLICY "Team staff update" ON public.team_members FOR UPDATE
USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Team staff delete" ON public.team_members;
CREATE POLICY "Team staff delete" ON public.team_members FOR DELETE
USING (public.is_staff(auth.uid()));

-- MEDIA FILES RLS
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Media public read" ON public.media_files;
CREATE POLICY "Media public read" ON public.media_files FOR SELECT
USING (is_public = true OR public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Media staff write" ON public.media_files;
CREATE POLICY "Media staff write" ON public.media_files FOR INSERT
WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Media staff update" ON public.media_files;
CREATE POLICY "Media staff update" ON public.media_files FOR UPDATE
USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Media staff delete" ON public.media_files;
CREATE POLICY "Media staff delete" ON public.media_files FOR DELETE
USING (public.is_staff(auth.uid()));

-- JOB OPENINGS RLS
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Careers public read" ON public.job_openings;
CREATE POLICY "Careers public read" ON public.job_openings FOR SELECT
USING (status = 'open' OR public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Careers staff write" ON public.job_openings;
CREATE POLICY "Careers staff write" ON public.job_openings FOR INSERT
WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Careers staff update" ON public.job_openings;
CREATE POLICY "Careers staff update" ON public.job_openings FOR UPDATE
USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Careers staff delete" ON public.job_openings;
CREATE POLICY "Careers staff delete" ON public.job_openings FOR DELETE
USING (public.is_staff(auth.uid()));

-- APPLICATIONS RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Applications insert public" ON public.applications;
CREATE POLICY "Applications insert public" ON public.applications FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Applications staff read" ON public.applications;
CREATE POLICY "Applications staff read" ON public.applications FOR SELECT
USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Applications staff update" ON public.applications;
CREATE POLICY "Applications staff update" ON public.applications FOR UPDATE
USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Applications staff delete" ON public.applications;
CREATE POLICY "Applications staff delete" ON public.applications FOR DELETE
USING (public.is_staff(auth.uid()));
