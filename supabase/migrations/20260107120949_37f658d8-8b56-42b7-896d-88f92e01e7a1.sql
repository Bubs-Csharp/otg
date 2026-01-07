-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Public can view invitation by token for onboarding" ON public.practitioner_invitations;

-- Create a secure SECURITY DEFINER function to validate invitation tokens
-- This prevents token enumeration while still allowing valid token lookup
CREATE OR REPLACE FUNCTION public.validate_invitation_token(token_param UUID)
RETURNS TABLE (
  invitation_id UUID,
  practitioner_id UUID,
  name TEXT,
  email TEXT,
  title TEXT,
  specialization TEXT,
  status TEXT,
  expires_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pi.id,
    pi.practitioner_id,
    pi.name,
    pi.email,
    pi.title,
    pi.specialization,
    pi.status,
    pi.expires_at
  FROM practitioner_invitations pi
  WHERE pi.token = token_param
    AND pi.status = 'pending'
    AND pi.expires_at > now();
END;
$$;

-- Grant execute permission to authenticated users and anon (for pre-auth token validation)
GRANT EXECUTE ON FUNCTION public.validate_invitation_token(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_invitation_token(UUID) TO anon;