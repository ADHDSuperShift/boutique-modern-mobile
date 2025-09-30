-- Sync schema to match application expectations
-- Run this in Supabase SQL Editor, then rerun `npm run seed`.

-- Rooms columns
ALTER TABLE IF EXISTS rooms ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE IF EXISTS rooms ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE IF EXISTS rooms ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS rooms ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE IF EXISTS rooms ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS rooms ADD COLUMN IF NOT EXISTS sort_order INT;

-- Events columns
ALTER TABLE IF EXISTS events ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE IF EXISTS events ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE IF EXISTS events ADD COLUMN IF NOT EXISTS sort_order INT;

-- Wines columns
ALTER TABLE IF EXISTS wines ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE IF EXISTS wines ADD COLUMN IF NOT EXISTS tasting_notes TEXT;
ALTER TABLE IF EXISTS wines ADD COLUMN IF NOT EXISTS vintage TEXT;
ALTER TABLE IF EXISTS wines ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE IF EXISTS wines ADD COLUMN IF NOT EXISTS sort_order INT;

-- Hero section (single row)
CREATE TABLE IF NOT EXISTS hero_section (
		id TEXT PRIMARY KEY DEFAULT 'hero',
		title TEXT,
		subtitle TEXT,
		description TEXT
);
-- Ensure snake_case columns exist
ALTER TABLE IF EXISTS hero_section ADD COLUMN IF NOT EXISTS background_image TEXT;
ALTER TABLE IF EXISTS hero_section ADD COLUMN IF NOT EXISTS cta_text TEXT;
ALTER TABLE IF EXISTS hero_section ADD COLUMN IF NOT EXISTS cta_link TEXT;
-- Migrate from previous folded columns if present (backgroundimage, ctatext, ctalink)
DO $$ BEGIN
	IF EXISTS (
		SELECT 1 FROM information_schema.columns 
		WHERE table_name = 'hero_section' AND column_name = 'backgroundimage'
	) THEN
		EXECUTE 'UPDATE hero_section SET background_image = COALESCE(background_image, backgroundimage)';
	END IF;
	IF EXISTS (
		SELECT 1 FROM information_schema.columns 
		WHERE table_name = 'hero_section' AND column_name = 'ctatext'
	) THEN
		EXECUTE 'UPDATE hero_section SET cta_text = COALESCE(cta_text, ctatext)';
	END IF;
	IF EXISTS (
		SELECT 1 FROM information_schema.columns 
		WHERE table_name = 'hero_section' AND column_name = 'ctalink'
	) THEN
		EXECUTE 'UPDATE hero_section SET cta_link = COALESCE(cta_link, ctalink)';
	END IF;
END $$;

-- Ensure a default hero row exists (idempotent)
INSERT INTO hero_section (id, title, subtitle, description)
SELECT 'hero', 'Barrydale Karoo Lodge', 'Boutique comfort in the heart of Route 62', 'Discover a haven of relaxation, fine dining, and authentic Karoo charm'
WHERE NOT EXISTS (SELECT 1 FROM hero_section WHERE id = 'hero');

-- RLS and public read for hero_section
ALTER TABLE IF EXISTS hero_section ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'hero_section' AND policyname = 'hero_section_public_read'
	) THEN
		EXECUTE 'CREATE POLICY hero_section_public_read ON hero_section FOR SELECT TO anon, authenticated USING (true)';
	END IF;
END $$;

-- Restaurant info (single row)
CREATE TABLE IF NOT EXISTS restaurant_info (
		id TEXT PRIMARY KEY DEFAULT 'restaurant',
		title TEXT,
		subtitle TEXT,
		description TEXT,
		features TEXT[] DEFAULT ARRAY[]::TEXT[]
);
-- Ensure snake_case columns exist
ALTER TABLE IF EXISTS restaurant_info ADD COLUMN IF NOT EXISTS background_image TEXT;
ALTER TABLE IF EXISTS restaurant_info ADD COLUMN IF NOT EXISTS menu_sections JSONB DEFAULT '[]'::jsonb;
-- Migrate from previous folded columns if present (backgroundimage, menusections)
DO $$ BEGIN
	IF EXISTS (
		SELECT 1 FROM information_schema.columns 
		WHERE table_name = 'restaurant_info' AND column_name = 'backgroundimage'
	) THEN
		EXECUTE 'UPDATE restaurant_info SET background_image = COALESCE(background_image, backgroundimage)';
	END IF;
	IF EXISTS (
		SELECT 1 FROM information_schema.columns 
		WHERE table_name = 'restaurant_info' AND column_name = 'menusections'
	) THEN
		EXECUTE 'UPDATE restaurant_info SET menu_sections = COALESCE(menu_sections, menusections)';
	END IF;
END $$;

-- Ensure a default restaurant row exists (idempotent)
INSERT INTO restaurant_info (id, title, subtitle, description, features)
SELECT 'restaurant', 'Karoo Kitchen & Wine', 'Seasonal flavors, local ingredients', 'Our restaurant blends Karoo heritage with modern techniques for memorable dining.', ARRAY[]::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM restaurant_info WHERE id = 'restaurant');

-- RLS and public read for restaurant_info
ALTER TABLE IF EXISTS restaurant_info ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'restaurant_info' AND policyname = 'restaurant_info_public_read'
	) THEN
		EXECUTE 'CREATE POLICY restaurant_info_public_read ON restaurant_info FOR SELECT TO anon, authenticated USING (true)';
	END IF;
END $$;

-- Public forms
CREATE TABLE IF NOT EXISTS restaurant_reservations (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	date DATE NOT NULL,
	time TEXT NOT NULL,
	guests INT NOT NULL DEFAULT 2,
	created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS wine_inquiries (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	wine_id TEXT,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	message TEXT NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_inquiries (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	event_id TEXT,
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	message TEXT NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now()
);

-- Optional: reload PostgREST schema cache (hosted Supabase supports this)
NOTIFY pgrst, 'reload schema';

-- Optional indexes to improve ordering and filtering performance (safe to re-run)
-- Rooms: order by sort_order and filter by amenities
CREATE INDEX IF NOT EXISTS idx_rooms_sort_order ON rooms (sort_order);
CREATE INDEX IF NOT EXISTS idx_rooms_amenities_gin ON rooms USING GIN (amenities);

-- Events: order by sort_order and date
CREATE INDEX IF NOT EXISTS idx_events_sort_order ON events (sort_order);
-- Date column expected to exist from base schema
DO $$ BEGIN
	PERFORM 1 FROM information_schema.columns
	WHERE table_name = 'events' AND column_name = 'date';
	IF FOUND THEN
		EXECUTE 'CREATE INDEX IF NOT EXISTS idx_events_date ON events (date)';
	END IF;
END $$;

-- Wines: order by sort_order
CREATE INDEX IF NOT EXISTS idx_wines_sort_order ON wines (sort_order);

-- Bar info (single row)
CREATE TABLE IF NOT EXISTS bar_info (
	id TEXT PRIMARY KEY DEFAULT 'bar',
	title TEXT,
	subtitle TEXT,
	description TEXT
);
ALTER TABLE IF EXISTS bar_info ADD COLUMN IF NOT EXISTS background_image TEXT;

-- Ensure a default bar row exists (idempotent)
INSERT INTO bar_info (id, title, subtitle, description)
SELECT 'bar', 'Windpomp Bar', 'Crafted drinks & easy vibes', 'Relax at the Windpomp Bar with signature cocktails, local spirits, and good company.'
WHERE NOT EXISTS (SELECT 1 FROM bar_info WHERE id = 'bar');

-- RLS and public read for bar_info
ALTER TABLE IF EXISTS bar_info ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'bar_info' AND policyname = 'bar_info_public_read'
	) THEN
		EXECUTE 'CREATE POLICY bar_info_public_read ON bar_info FOR SELECT TO anon, authenticated USING (true)';
	END IF;
END $$;

-- Wine Boutique (single row)
CREATE TABLE IF NOT EXISTS wine_boutique_info (
	id TEXT PRIMARY KEY DEFAULT 'wine_boutique',
	title TEXT,
	subtitle TEXT,
	description TEXT
);
ALTER TABLE IF EXISTS wine_boutique_info ADD COLUMN IF NOT EXISTS background_image TEXT;

-- Ensure a default wine boutique row exists (idempotent)
INSERT INTO wine_boutique_info (id, title, subtitle, description)
SELECT 'wine_boutique', 'Wine Boutique', 'Curated selections', 'Discover hand-picked wines from the Cape Winelands and beyond.'
WHERE NOT EXISTS (SELECT 1 FROM wine_boutique_info WHERE id = 'wine_boutique');

-- RLS and public read for wine_boutique_info
ALTER TABLE IF EXISTS wine_boutique_info ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'wine_boutique_info' AND policyname = 'wine_boutique_info_public_read'
	) THEN
		EXECUTE 'CREATE POLICY wine_boutique_info_public_read ON wine_boutique_info FOR SELECT TO anon, authenticated USING (true)';
	END IF;
END $$;

-- Gallery section (single row holding an array of image URLs)
CREATE TABLE IF NOT EXISTS gallery_section (
	id TEXT PRIMARY KEY DEFAULT 'gallery',
	title TEXT,
	images TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Ensure a default gallery row exists (idempotent)
INSERT INTO gallery_section (id, title, images)
SELECT 'gallery', 'Gallery', ARRAY[]::TEXT[]
WHERE NOT EXISTS (SELECT 1 FROM gallery_section WHERE id = 'gallery');

-- RLS and public read for gallery_section
ALTER TABLE IF EXISTS gallery_section ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'gallery_section' AND policyname = 'gallery_section_public_read'
	) THEN
		EXECUTE 'CREATE POLICY gallery_section_public_read ON gallery_section FOR SELECT TO anon, authenticated USING (true)';
	END IF;
END $$;
