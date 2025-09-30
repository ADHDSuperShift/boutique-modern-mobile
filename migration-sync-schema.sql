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

-- Optional: reload PostgREST schema cache (hosted Supabase supports this)
NOTIFY pgrst, 'reload schema';
