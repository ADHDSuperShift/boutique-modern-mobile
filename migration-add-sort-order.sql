-- Add sort_order column to support drag-and-drop ordering
-- Run this after core tables exist.

ALTER TABLE IF EXISTS rooms ADD COLUMN IF NOT EXISTS sort_order INT;
ALTER TABLE IF EXISTS events ADD COLUMN IF NOT EXISTS sort_order INT;
ALTER TABLE IF EXISTS wines ADD COLUMN IF NOT EXISTS sort_order INT;

-- Backfill sort_order deterministically if NULL (by name/date)
UPDATE rooms r
SET sort_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) AS rn
  FROM rooms
) sub
WHERE r.id = sub.id AND r.sort_order IS NULL;

UPDATE events e
SET sort_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY date DESC, title) AS rn
  FROM events
) sub
WHERE e.id = sub.id AND e.sort_order IS NULL;

UPDATE wines w
SET sort_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) AS rn
  FROM wines
) sub
WHERE w.id = sub.id AND w.sort_order IS NULL;
