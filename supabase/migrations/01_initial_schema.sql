-- INITIAL SCHEMA FOR THE OLDVERSE PLATFORM
-- This migration sets up the core tables and applies strict Row Level Security (RLS) policies.

-- 1. Create Custom Types
CREATE TYPE opportunity_type AS ENUM ('Full-Time', 'Part-Time', 'Contract', 'Collaboration');
CREATE TYPE opportunity_role_type AS ENUM ('casting', 'crew');
CREATE TYPE location_type AS ENUM ('Remote', 'On-Set', 'Hybrid');
CREATE TYPE application_status AS ENUM ('pending', 'approved', 'declined');

-- 2. Creators Table
CREATE TABLE creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    avatar TEXT,
    banner TEXT,
    bio TEXT,
    followers INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    categories TEXT[] DEFAULT '{}',
    links JSONB DEFAULT '{}'::jsonb,
    about TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for creators
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;

-- Creators Policies
CREATE POLICY "Allow public read access to creators" 
ON creators FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to insert their own creator profile" 
ON creators FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own creator profile" 
ON creators FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own creator profile" 
ON creators FOR DELETE 
USING (auth.uid() = user_id);


-- 3. Media Items Table
CREATE TABLE media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'movie', 'series', 'bts', 'original'
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    duration VARCHAR(50) NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 0.0,
    poster_url TEXT NOT NULL,
    banner_url TEXT,
    video_url TEXT NOT NULL,
    is_trending BOOLEAN DEFAULT false,
    is_original BOOLEAN DEFAULT false,
    release_date VARCHAR(100) DEFAULT 'Coming Soon',
    is_approved BOOLEAN DEFAULT false, -- requires admin approval
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for media_items
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

-- Media Items Policies
CREATE POLICY "Allow public read access to approved media items" 
ON media_items FOR SELECT 
USING (is_approved = true OR (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id)));

CREATE POLICY "Allow authenticated creators to upload media" 
ON media_items FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));

CREATE POLICY "Allow creators to update their own media" 
ON media_items FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));

CREATE POLICY "Allow creators to delete their own media" 
ON media_items FOR DELETE 
USING (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));


-- 4. Community Posts Table
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    likes INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    category VARCHAR(100) NOT NULL, -- 'behind-the-scenes', 'casting-call', 'announcement', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for community_posts
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Community Posts Policies
CREATE POLICY "Allow public read access to community posts" 
ON community_posts FOR SELECT 
USING (true);

CREATE POLICY "Allow creators to publish community posts" 
ON community_posts FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));

CREATE POLICY "Allow creators to update their own community posts" 
ON community_posts FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));

CREATE POLICY "Allow creators to delete their own community posts" 
ON community_posts FOR DELETE 
USING (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));


-- 5. Casting Calls / Job Listings Table
CREATE TABLE casting_calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    project VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    location VARCHAR(255) NOT NULL,
    type opportunity_type NOT NULL,
    role_type opportunity_role_type NOT NULL,
    budget VARCHAR(100) NOT NULL,
    location_type location_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for casting_calls
ALTER TABLE casting_calls ENABLE ROW LEVEL SECURITY;

-- Casting Calls Policies
CREATE POLICY "Allow public read access to opportunities" 
ON casting_calls FOR SELECT 
USING (true);

-- Only authenticated creators can post jobs/casting calls
CREATE POLICY "Allow creators to publish opportunities" 
ON casting_calls FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));

CREATE POLICY "Allow creators to modify their opportunities" 
ON casting_calls FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));

CREATE POLICY "Allow creators to remove their opportunities" 
ON casting_calls FOR DELETE 
USING (auth.uid() IN (SELECT user_id FROM creators WHERE id = creator_id));


-- 6. Job Applications Table
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES casting_calls(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    portfolio_url TEXT NOT NULL,
    cover_letter TEXT NOT NULL,
    status application_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for job_applications
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Job Applications Policies
-- 1. Applicants can see their own submissions.
-- 2. Job posters (creators) can see submissions to their listings.
CREATE POLICY "Allow applicants and listing owners to view submissions" 
ON job_applications FOR SELECT 
USING (
    auth.uid() = applicant_id 
    OR auth.uid() IN (
        SELECT c.user_id FROM creators c
        JOIN casting_calls cc ON cc.creator_id = c.id
        WHERE cc.id = job_id
    )
);

CREATE POLICY "Allow authenticated users to submit job applications" 
ON job_applications FOR INSERT 
WITH CHECK (auth.uid() = applicant_id);

-- Only the job poster (creator) can change the status (Approve/Decline) of an application
CREATE POLICY "Allow listing owners to update application status" 
ON job_applications FOR UPDATE 
USING (
    auth.uid() IN (
        SELECT c.user_id FROM creators c
        JOIN casting_calls cc ON cc.creator_id = c.id
        WHERE cc.id = job_id
    )
);


-- 7. Media Reviews Table
CREATE TABLE media_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID REFERENCES media_items(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
    review_text TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for media_reviews
ALTER TABLE media_reviews ENABLE ROW LEVEL SECURITY;

-- Media Reviews Policies
CREATE POLICY "Allow public read access to media reviews" 
ON media_reviews FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to submit reviews" 
ON media_reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to edit their own reviews" 
ON media_reviews FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own reviews" 
ON media_reviews FOR DELETE 
USING (auth.uid() = user_id);
