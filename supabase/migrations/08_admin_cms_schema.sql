-- ==========================================
-- MIGRATION 08: ADMIN PANEL & CMS SCHEMA
-- ==========================================

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Film',
    status VARCHAR(50) NOT NULL DEFAULT 'Completed', -- 'Draft', 'In Production', 'Completed', 'Archived'
    poster_url TEXT NOT NULL,
    banner_url TEXT,
    trailer_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    release_date VARCHAR(100) DEFAULT '2026',
    instagram_url TEXT,
    youtube_url TEXT,
    credits JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to published projects" 
ON public.projects FOR SELECT 
USING (is_published = true OR (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor', 'viewer'))));

CREATE POLICY "Allow admins and editors to manage projects" 
ON public.projects FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor')));


-- 2. Productions Table
CREATE TABLE IF NOT EXISTS public.productions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    type VARCHAR(100) NOT NULL DEFAULT 'Short Film',
    director VARCHAR(255) NOT NULL,
    producer VARCHAR(255) NOT NULL,
    crew JSONB DEFAULT '[]'::jsonb,
    actors TEXT[] DEFAULT '{}',
    start_date DATE,
    end_date DATE,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Planning', -- 'Planning', 'Pre-production', 'Production', 'Post-production', 'Completed', 'On Hold'
    progress_percentage INTEGER DEFAULT 0,
    budget VARCHAR(100) DEFAULT '$0',
    notes TEXT,
    files JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.productions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admins, editors, and viewers to read productions" 
ON public.productions FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor', 'viewer')));

CREATE POLICY "Allow admins and editors to manage productions" 
ON public.productions FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor')));


-- 3. Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    instagram_url TEXT,
    linkedin_url TEXT,
    email VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to visible team members" 
ON public.team_members FOR SELECT 
USING (is_visible = true OR (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor', 'viewer'))));

CREATE POLICY "Allow admins and editors to manage team members" 
ON public.team_members FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor')));


-- 4. Website Content Table (CMS)
CREATE TABLE IF NOT EXISTS public.website_content (
    section VARCHAR(100) PRIMARY KEY,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to website content" 
ON public.website_content FOR SELECT 
USING (true);

CREATE POLICY "Allow admins and editors to modify website content" 
ON public.website_content FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor')));


-- 5. Media Files Catalog Table
CREATE TABLE IF NOT EXISTS public.media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL DEFAULT 'image', -- 'image', 'video', 'document'
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to media files catalog" 
ON public.media_files FOR SELECT 
USING (true);

CREATE POLICY "Allow admins and editors to manage media files catalog" 
ON public.media_files FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor')));


-- 6. Job Openings Table
CREATE TABLE IF NOT EXISTS public.job_openings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    type VARCHAR(50) NOT NULL DEFAULT 'Full-Time', -- 'Full-Time', 'Part-Time', 'Internship', 'Freelance', 'Contract', 'Collaboration'
    location VARCHAR(255) NOT NULL DEFAULT 'Remote',
    deadline DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'closed', 'draft'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to open job postings" 
ON public.job_openings FOR SELECT 
USING (status = 'open' OR (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor', 'viewer'))));

CREATE POLICY "Allow admins and editors to manage job openings" 
ON public.job_openings FOR ALL 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor')));


-- 7. Applications / Recruitment Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_openings(id) ON DELETE SET NULL,
    position VARCHAR(255) NOT NULL,
    applicant_name VARCHAR(255) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_phone VARCHAR(100),
    portfolio_url TEXT,
    resume_url TEXT,
    instagram_url TEXT,
    cover_letter TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new', -- 'new', 'reviewing', 'shortlisted', 'interview', 'selected', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to submit recruitment applications" 
ON public.applications FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow admins, editors, and viewers to view applications" 
ON public.applications FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor', 'viewer')));

CREATE POLICY "Allow admins and editors to update applications" 
ON public.applications FOR UPDATE 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor')));

CREATE POLICY "Allow admins to delete applications" 
ON public.applications FOR DELETE 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));


-- 8. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL DEFAULT 'System',
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admins, editors, and viewers to read activity logs" 
ON public.activity_logs FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor', 'viewer')));

CREATE POLICY "Allow system to insert activity logs" 
ON public.activity_logs FOR INSERT 
WITH CHECK (true);


-- 9. Admin Notifications Table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'general', -- 'message', 'application', 'project', 'system'
    is_read BOOLEAN DEFAULT false,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow admins, editors, and viewers to read admin notifications" 
ON public.admin_notifications FOR SELECT 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor', 'viewer')));

CREATE POLICY "Allow admins and editors to update admin notifications" 
ON public.admin_notifications FOR UPDATE 
USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('admin', 'editor')));

CREATE POLICY "Allow system to insert admin notifications" 
ON public.admin_notifications FOR INSERT 
WITH CHECK (true);


-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_productions_status ON public.productions(status);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON public.team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_job_openings_status ON public.job_openings(status);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_unread ON public.admin_notifications(is_read);
