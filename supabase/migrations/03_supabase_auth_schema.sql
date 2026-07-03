-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    username TEXT UNIQUE,
    email TEXT,
    avatar_url TEXT,
    bio TEXT,
    subscription_plan TEXT DEFAULT 'free',
    role TEXT DEFAULT 'user',
    notification_preferences JSONB DEFAULT '{"releases": true, "episodes": true, "security": true, "billing": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active'
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to read any profile"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Allow users to update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create trigger to automatically insert a profile row when a new auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    computed_username TEXT;
BEGIN
    computed_username := lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9]', '', 'g')) || '_' || floor(random() * 1000)::text;
    
    INSERT INTO public.profiles (id, full_name, username, email, avatar_url, subscription_plan, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'username', computed_username),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&fit=crop'),
        'free',
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create watchlist table
CREATE TABLE IF NOT EXISTS public.watchlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    media_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, media_id)
);

ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to select their own watchlist"
ON public.watchlist FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own watchlist"
ON public.watchlist FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own watchlist"
ON public.watchlist FOR DELETE
USING (auth.uid() = user_id);

-- Create continue_watching table
CREATE TABLE IF NOT EXISTS public.continue_watching (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    media_id TEXT NOT NULL,
    progress_seconds INTEGER DEFAULT 0,
    duration_seconds INTEGER DEFAULT 0,
    percentage INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, media_id)
);

ALTER TABLE public.continue_watching ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to select their own continue_watching"
ON public.continue_watching FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert their own continue_watching"
ON public.continue_watching FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own continue_watching"
ON public.continue_watching FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own continue_watching"
ON public.continue_watching FOR DELETE
USING (auth.uid() = user_id);

-- Create watch_history table
CREATE TABLE IF NOT EXISTS public.watch_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    media_id TEXT NOT NULL,
    percentage INTEGER DEFAULT 0,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, media_id)
);

ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to select their own watch_history"
ON public.watch_history FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to insert/update their own watch_history"
ON public.watch_history FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own watch_history"
ON public.watch_history FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own watch_history"
ON public.watch_history FOR DELETE
USING (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow users to select their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);
