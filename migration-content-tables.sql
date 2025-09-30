-- Content tables for dynamic public site sections
-- Run this once in your Supabase SQL editor.

-- ==============================
-- Tables
-- ==============================

CREATE TABLE IF NOT EXISTS hero_section (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  subtitle TEXT,
  description TEXT,
  backgroundImage TEXT,
  ctaText TEXT,
  ctaLink TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurant_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  heroImage TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT,
  phone TEXT,
  email_primary TEXT,
  email_secondary TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================
-- RLS
-- ==============================

ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;

-- ==============================
-- Policies
-- ==============================

-- Drop existing policies (idempotent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hero_section' AND policyname = 'Public can read hero') THEN
    DROP POLICY "Public can read hero" ON hero_section;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hero_section' AND policyname = 'Admins manage hero') THEN
    DROP POLICY "Admins manage hero" ON hero_section;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'amenities' AND policyname = 'Public can read amenities') THEN
    DROP POLICY "Public can read amenities" ON amenities;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'amenities' AND policyname = 'Admins manage amenities') THEN
    DROP POLICY "Admins manage amenities" ON amenities;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'restaurant_info' AND policyname = 'Public can read restaurant') THEN
    DROP POLICY "Public can read restaurant" ON restaurant_info;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'restaurant_info' AND policyname = 'Admins manage restaurant') THEN
    DROP POLICY "Admins manage restaurant" ON restaurant_info;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_info' AND policyname = 'Public can read contact') THEN
    DROP POLICY "Public can read contact" ON contact_info;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'contact_info' AND policyname = 'Admins manage contact') THEN
    DROP POLICY "Admins manage contact" ON contact_info;
  END IF;
END $$;

-- Public read
CREATE POLICY "Public can read hero" ON hero_section FOR SELECT USING (true);
CREATE POLICY "Public can read amenities" ON amenities FOR SELECT USING (true);
CREATE POLICY "Public can read restaurant" ON restaurant_info FOR SELECT USING (true);
CREATE POLICY "Public can read contact" ON contact_info FOR SELECT USING (true);

-- Admin manage
CREATE POLICY "Admins manage hero" ON hero_section FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admins manage amenities" ON amenities FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admins manage restaurant" ON restaurant_info FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admins manage contact" ON contact_info FOR ALL USING (auth.jwt()->>'role' = 'admin');
