-- Role Protection Trigger for profiles table
CREATE OR REPLACE FUNCTION public.protect_profile_roles()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the role column is being modified
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        -- Only restrict if the query is executed by an authenticated user
        -- (Service Role or administrative scripts have auth.uid() as NULL)
        IF auth.uid() IS NOT NULL THEN
            -- Check if the executing user is an administrator
            IF NOT EXISTS (
                SELECT 1 FROM public.profiles
                WHERE id = auth.uid() AND role = 'admin'
            ) THEN
                RAISE EXCEPTION 'Unauthorized: Only administrators can modify roles.';
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS before_profile_role_update ON public.profiles;

-- Create trigger
CREATE TRIGGER before_profile_role_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_profile_roles();
