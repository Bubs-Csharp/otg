-- Allow practitioners to update their own invitation status (for completing onboarding)
CREATE POLICY "Practitioners can update their own invitation"
ON public.practitioner_invitations
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM practitioners p
    WHERE p.id = practitioner_invitations.practitioner_id
    AND p.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM practitioners p
    WHERE p.id = practitioner_invitations.practitioner_id
    AND p.user_id = auth.uid()
  )
);