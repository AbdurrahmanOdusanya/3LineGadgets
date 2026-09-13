-- ==============================================================================
-- 3LINE GADGETS — FIX PROTECT_PROFILE_ROLE TRIGGER FOR SQL EDITOR
-- Migration: 003_fix_protect_profile_role.sql
-- ==============================================================================

-- Updates protect_profile_role() to permit direct role modifications
-- executed via the Supabase Dashboard SQL Editor, CLI, or backend service_role,
-- while continuing to block privilege escalation from authenticated client callers.

CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If role is changing, ensure current actor is super_admin or direct database admin
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        -- Allow updates executed directly via Supabase SQL Editor, service_role, or postgres superuser
        IF auth.uid() IS NULL OR auth.role() = 'service_role' OR current_user IN ('postgres', 'supabase_admin') THEN
            RETURN NEW;
        END IF;

        -- Otherwise, enforce that the authenticated caller is an active super_admin
        IF NOT public.is_super_admin() THEN
            RAISE EXCEPTION 'Unauthorized: Only super administrators can modify user roles';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;
