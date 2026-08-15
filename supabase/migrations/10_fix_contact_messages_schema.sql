-- Migration 10: Fix contact_messages Schema and RLS Policies
-- Ensures status column exists, index performance, and complete RLS permissions for staff

-- 1. Ensure status and updated_at columns exist on contact_messages
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new';
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Add check constraint for valid status values
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'contact_messages_status_check'
    ) THEN
        ALTER TABLE public.contact_messages 
        ADD CONSTRAINT contact_messages_status_check 
        CHECK (status IN ('new', 'read', 'contacted', 'resolved', 'archived'));
    END IF;
END $$;

-- 2. Create index on status and created_at for fast admin querying
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- 3. Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 4. Drop old policies
DROP POLICY IF EXISTS "Allow anyone to insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow administrators to read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow anyone to insert contact submissions" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow staff to select contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow staff to update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow staff to delete contact messages" ON public.contact_messages;

-- 5. Create clean, secure RLS Policies

-- Public / Anonymous users can ONLY insert new contact messages
CREATE POLICY "Allow public insert to contact_messages"
ON public.contact_messages FOR INSERT
WITH CHECK (true);

-- Only authorized staff (owner, admin, editor, viewer) can SELECT / READ contact messages
CREATE POLICY "Allow staff select on contact_messages"
ON public.contact_messages FOR SELECT
USING (
    public.is_staff(auth.uid()) OR 
    (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('owner', 'admin', 'editor', 'viewer')))
);

-- Only authorized staff (owner, admin, editor) can UPDATE contact messages
CREATE POLICY "Allow staff update on contact_messages"
ON public.contact_messages FOR UPDATE
USING (
    public.is_staff(auth.uid()) OR 
    (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('owner', 'admin', 'editor')))
);

-- Only authorized staff (owner, admin) can DELETE contact messages
CREATE POLICY "Allow staff delete on contact_messages"
ON public.contact_messages FOR DELETE
USING (
    public.is_owner(auth.uid()) OR 
    (auth.uid() IN (SELECT id FROM public.profiles WHERE role IN ('owner', 'admin')))
);
