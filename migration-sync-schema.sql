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
