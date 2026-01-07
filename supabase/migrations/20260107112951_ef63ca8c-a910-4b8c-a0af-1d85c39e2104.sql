-- Create practitioner invitations table
CREATE TABLE public.practitioner_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  title TEXT,
  specialization TEXT,
  token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  practitioner_id UUID REFERENCES public.practitioners(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  invited_by UUID NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create practitioner profiles table for detailed onboarding info
CREATE TABLE public.practitioner_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID NOT NULL REFERENCES public.practitioners(id) ON DELETE CASCADE UNIQUE,
  
  -- Personal info
  phone TEXT,
  date_of_birth DATE,
  id_number TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  
  -- Professional credentials
  qualifications TEXT[],
  license_number TEXT,
  license_expiry DATE,
  certifications TEXT[],
  years_of_experience INTEGER,
  professional_registration TEXT,
  
  -- Bio and preferences
  bio TEXT,
  profile_photo_url TEXT,
  languages TEXT[],
  contact_preference TEXT CHECK (contact_preference IN ('email', 'phone', 'both')),
  
  -- Services and availability
  services_offered UUID[],
  consultation_fee NUMERIC,
  
  -- Onboarding status
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  onboarding_completed_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.practitioner_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioner_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for practitioner_invitations
CREATE POLICY "Admins can manage invitations"
ON public.practitioner_invitations
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view invitation by token for onboarding"
ON public.practitioner_invitations
FOR SELECT
USING (true);

-- RLS Policies for practitioner_profiles
CREATE POLICY "Admins can manage practitioner profiles"
ON public.practitioner_profiles
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Practitioners can view their own profile"
ON public.practitioner_profiles
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM practitioners
  WHERE practitioners.id = practitioner_profiles.practitioner_id
  AND practitioners.user_id = auth.uid()
));

CREATE POLICY "Practitioners can update their own profile"
ON public.practitioner_profiles
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM practitioners
  WHERE practitioners.id = practitioner_profiles.practitioner_id
  AND practitioners.user_id = auth.uid()
));

-- Update triggers for updated_at
CREATE TRIGGER update_practitioner_invitations_updated_at
BEFORE UPDATE ON public.practitioner_invitations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_practitioner_profiles_updated_at
BEFORE UPDATE ON public.practitioner_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();