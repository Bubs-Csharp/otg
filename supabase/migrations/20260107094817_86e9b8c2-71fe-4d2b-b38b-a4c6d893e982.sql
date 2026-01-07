-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  id_number TEXT,
  medical_aid_name TEXT,
  medical_aid_number TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on services (public read)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active services"
ON public.services FOR SELECT
USING (is_active = true);

-- Create locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on locations (public read)
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active locations"
ON public.locations FOR SELECT
USING (is_active = true);

-- Create practitioners table
CREATE TABLE public.practitioners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  specialization TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on practitioners (public read)
ALTER TABLE public.practitioners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active practitioners"
ON public.practitioners FOR SELECT
USING (is_active = true);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id),
  location_id UUID REFERENCES public.locations(id),
  practitioner_id UUID REFERENCES public.practitioners(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  group_size INTEGER NOT NULL DEFAULT 1,
  special_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
ON public.bookings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
ON public.bookings FOR UPDATE
USING (auth.uid() = user_id);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_id)
);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Insert sample services
INSERT INTO public.services (name, description, category, duration_minutes, price, is_active) VALUES
('Medical Surveillance Examination', 'Comprehensive occupational health assessment including physical examination, vision, and hearing tests', 'Medical Surveillance', 60, 850.00, true),
('Pre-Employment Medical', 'Complete health screening for new employees', 'Medical Surveillance', 45, 650.00, true),
('Exit Medical Examination', 'Health assessment when leaving employment', 'Medical Surveillance', 30, 450.00, true),
('Spirometry Test', 'Lung function testing for respiratory health', 'Medical Surveillance', 20, 250.00, true),
('Audiometry Test', 'Hearing assessment and screening', 'Medical Surveillance', 20, 200.00, true),
('Vision Screening', 'Comprehensive eye examination', 'Medical Surveillance', 15, 150.00, true),
('Drug & Alcohol Testing', 'Substance screening for workplace safety', 'Wellness', 15, 180.00, true),
('Executive Health Check', 'Premium comprehensive health assessment', 'Wellness', 120, 2500.00, true),
('Wellness Day Package', 'Group wellness screening for corporate teams', 'Corporate', 480, 150.00, true),
('First Aid Training', 'Certified first aid training course', 'Training', 480, 850.00, true),
('COVID-19 Vaccination', 'COVID-19 vaccination service', 'Wellness', 15, 0.00, true),
('Travel Health Consultation', 'Health advice and vaccinations for travelers', 'Wellness', 30, 350.00, true);

-- Insert sample locations
INSERT INTO public.locations (name, address, city, province, phone, is_active) VALUES
('Johannesburg Main', '123 Health Street, Sandton', 'Johannesburg', 'Gauteng', '011 123 4567', true),
('Cape Town Branch', '456 Wellness Ave, Century City', 'Cape Town', 'Western Cape', '021 987 6543', true),
('Durban Office', '789 Care Road, Umhlanga', 'Durban', 'KwaZulu-Natal', '031 456 7890', true),
('Pretoria Center', '321 Medical Lane, Menlyn', 'Pretoria', 'Gauteng', '012 345 6789', true);

-- Insert sample practitioners
INSERT INTO public.practitioners (name, title, specialization, is_active) VALUES
('Dr. Sarah Johnson', 'Occupational Health Physician', 'Medical Surveillance', true),
('Dr. Michael Naidoo', 'General Practitioner', 'Wellness & Prevention', true),
('Sister Grace Molefe', 'Registered Nurse', 'Clinical Assessments', true),
('Dr. James van der Berg', 'Audiologist', 'Hearing Conservation', true);