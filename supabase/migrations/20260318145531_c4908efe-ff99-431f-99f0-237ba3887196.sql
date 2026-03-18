
-- Org role enum
CREATE TYPE public.org_role AS ENUM ('owner', 'admin', 'store_manager', 'viewer');

-- Organizations (tenants)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  address TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  state_of_origin TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Organization members (roles)
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role org_role NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Parts table
CREATE TABLE public.parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  part_type TEXT NOT NULL,
  vehicle_model TEXT,
  year_range TEXT,
  local_nickname TEXT,
  sku TEXT,
  condition TEXT,
  category TEXT,
  display_name TEXT,
  price_naira NUMERIC,
  quantity_in_stock INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;

-- Security definer function for org access
CREATE OR REPLACE FUNCTION public.user_has_org_access(org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE user_id = auth.uid() AND organization_id = org_id
  )
$$;

-- RLS: profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());

-- RLS: organizations
CREATE POLICY "Members can view their org" ON public.organizations FOR SELECT USING (public.user_has_org_access(id));
CREATE POLICY "Owners can update org" ON public.organizations FOR UPDATE USING (public.user_has_org_access(id));
CREATE POLICY "Authenticated can create org" ON public.organizations FOR INSERT TO authenticated WITH CHECK (true);

-- RLS: organization_members
CREATE POLICY "Members can view members" ON public.organization_members FOR SELECT USING (public.user_has_org_access(organization_id));
CREATE POLICY "Authenticated can insert membership" ON public.organization_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- RLS: parts
CREATE POLICY "Members can view parts" ON public.parts FOR SELECT USING (public.user_has_org_access(organization_id));
CREATE POLICY "Members can insert parts" ON public.parts FOR INSERT WITH CHECK (public.user_has_org_access(organization_id));
CREATE POLICY "Members can update parts" ON public.parts FOR UPDATE USING (public.user_has_org_access(organization_id));
CREATE POLICY "Members can delete parts" ON public.parts FOR DELETE USING (public.user_has_org_access(organization_id));

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
