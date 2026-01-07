-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'practitioner', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create practitioner_availability table
CREATE TABLE public.practitioner_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID REFERENCES public.practitioners(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (practitioner_id, day_of_week)
);

-- Enable RLS on practitioner_availability
ALTER TABLE public.practitioner_availability ENABLE ROW LEVEL SECURITY;

-- Anyone can view availability
CREATE POLICY "Anyone can view practitioner availability"
ON public.practitioner_availability
FOR SELECT
USING (true);

-- Link practitioners to user accounts
ALTER TABLE public.practitioners ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Practitioners can update their own availability
CREATE POLICY "Practitioners can manage their availability"
ON public.practitioner_availability
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.practitioners 
    WHERE id = practitioner_id AND user_id = auth.uid()
  )
);

-- Add payment fields to bookings
ALTER TABLE public.bookings 
ADD COLUMN payment_reference TEXT,
ADD COLUMN payment_method TEXT,
ADD COLUMN paid_at TIMESTAMP WITH TIME ZONE;

-- Create payments table for tracking
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ZAR',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_reference TEXT,
  yoco_checkout_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view their own payments"
ON public.payments
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own payments
CREATE POLICY "Users can create their own payments"
ON public.payments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
ON public.payments
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update trigger for payments
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Allow practitioners to view bookings assigned to them
CREATE POLICY "Practitioners can view their assigned bookings"
ON public.bookings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.practitioners 
    WHERE id = practitioner_id AND user_id = auth.uid()
  )
);

-- Allow practitioners to update their assigned bookings
CREATE POLICY "Practitioners can update their assigned bookings"
ON public.bookings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.practitioners 
    WHERE id = practitioner_id AND user_id = auth.uid()
  )
);

-- Admins can view all bookings
CREATE POLICY "Admins can view all bookings"
ON public.bookings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update all bookings
CREATE POLICY "Admins can update all bookings"
ON public.bookings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage services
CREATE POLICY "Admins can manage services"
ON public.services
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage practitioners
CREATE POLICY "Admins can manage practitioners"
ON public.practitioners
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage locations
CREATE POLICY "Admins can manage locations"
ON public.locations
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Function to assign default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Trigger to assign default role
CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_role();