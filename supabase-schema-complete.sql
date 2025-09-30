-- ==============================
-- Core Tables
-- ==============================

CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price INTEGER DEFAULT 0,
  image TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  image TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image TEXT,
  tasting_notes TEXT,
  vintage TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  room_id UUID REFERENCES rooms(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 2,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurant_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wine_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id UUID REFERENCES wines(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- Enable Row Level Security
-- ==============================

ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wine_inquiries ENABLE ROW LEVEL SECURITY;

-- ==============================
-- Public Policies
-- ==============================

DROP POLICY IF EXISTS "Public can read rooms" ON rooms;
CREATE POLICY "Public can read rooms" ON rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read events" ON events;
CREATE POLICY "Public can read events" ON events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can read wines" ON wines;
CREATE POLICY "Public can read wines" ON wines FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert bookings" ON bookings;
CREATE POLICY "Public can insert bookings" ON bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert reservations" ON restaurant_reservations;
CREATE POLICY "Public can insert reservations" ON restaurant_reservations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert contacts" ON contacts;
CREATE POLICY "Public can insert contacts" ON contacts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert wine inquiries" ON wine_inquiries;
CREATE POLICY "Public can insert wine inquiries" ON wine_inquiries FOR INSERT WITH CHECK (true);

-- ==============================
-- Admin Policies
-- ==============================

DROP POLICY IF EXISTS "Admins can manage rooms" ON rooms;
CREATE POLICY "Admins can manage rooms" ON rooms FOR ALL USING (auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "Admins can manage wines" ON wines;
CREATE POLICY "Admins can manage wines" ON wines FOR ALL USING (auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view bookings" ON bookings;
CREATE POLICY "Admins can view bookings" ON bookings FOR SELECT USING (auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view reservations" ON restaurant_reservations;
CREATE POLICY "Admins can view reservations" ON restaurant_reservations FOR SELECT USING (auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view contacts" ON contacts;
CREATE POLICY "Admins can view contacts" ON contacts FOR SELECT USING (auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "Admins can view inquiries" ON wine_inquiries;
CREATE POLICY "Admins can view inquiries" ON wine_inquiries FOR SELECT USING (auth.jwt()->>'role' = 'admin');

-- ==============================
-- Storage Policies (site-images bucket)
-- ==============================

-- ⚠️ Bucket 'site-images' already exists — no need to recreate it.
-- We only (re)create the policies.

DROP POLICY IF EXISTS "Public can view site images" ON storage.objects;
CREATE POLICY "Public can view site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Admins can upload site images" ON storage.objects;
CREATE POLICY "Admins can upload site images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-images' AND auth.jwt()->>'role' = 'admin');

DROP POLICY IF EXISTS "Admins can update site images" ON storage.objects;
CREATE POLICY "Admins can update site images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-images' AND auth.jwt()->>'role' = 'admin')
WITH CHECK (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Admins can delete site images" ON storage.objects;
CREATE POLICY "Admins can delete site images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-images' AND auth.jwt()->>'role' = 'admin');

-- ==============================
-- Update Existing User to Admin
-- ==============================

UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
      COALESCE(raw_app_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"',
      true
    ),
    raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"',
      true
    )
WHERE email = 'dirkawspy@gmail.com';
