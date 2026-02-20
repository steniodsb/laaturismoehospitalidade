
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'prefeitura', 'anunciante');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Cities table
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  population TEXT,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cities are viewable by everyone" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Admins can manage cities" ON public.cities FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are viewable by everyone" ON public.tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage tags" ON public.tags FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Establishments table
CREATE TABLE public.establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT,
  category_id UUID REFERENCES public.categories(id),
  city_id UUID REFERENCES public.cities(id),
  description TEXT,
  short_description TEXT,
  image_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  address TEXT,
  rating NUMERIC(2,1),
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  amenities TEXT[] DEFAULT '{}',
  details JSONB DEFAULT '{}',
  owner_id UUID REFERENCES auth.users(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.establishments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active establishments are viewable by everyone" ON public.establishments FOR SELECT USING (true);
CREATE POLICY "Admins can manage establishments" ON public.establishments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners can update own establishments" ON public.establishments FOR UPDATE TO authenticated
  USING (owner_id = auth.uid());
CREATE POLICY "Owners can insert own establishments" ON public.establishments FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Establishment tags junction
CREATE TABLE public.establishment_tags (
  establishment_id UUID NOT NULL REFERENCES public.establishments(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (establishment_id, tag_id)
);

ALTER TABLE public.establishment_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Establishment tags viewable by everyone" ON public.establishment_tags FOR SELECT USING (true);
CREATE POLICY "Admins can manage establishment tags" ON public.establishment_tags FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city_id UUID REFERENCES public.cities(id),
  establishment_id UUID REFERENCES public.establishments(id),
  description TEXT,
  image_url TEXT,
  event_type TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON public.cities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_establishments_updated_at BEFORE UPDATE ON public.establishments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
