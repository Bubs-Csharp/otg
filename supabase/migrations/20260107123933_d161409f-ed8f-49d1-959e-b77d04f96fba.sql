-- Allow practitioners to access their own practitioner row even before activation
-- This fixes practitioner onboarding (inactive practitioners couldn't read/update their own record).

CREATE POLICY "Practitioners can view their own practitioner record"
ON public.practitioners
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Practitioners can update their own practitioner record"
ON public.practitioners
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
