-- 🔄 UNIVERSAL IMAGE STORAGE: For ALL site images (rooms, events, wines, etc.)

-- 1) Add image columns to ALL tables
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS price INTEGER DEFAULT 0;

-- Events already has image, but ensure it exists
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image TEXT;

-- Wines already has image, but ensure it exists  
ALTER TABLE public.wines ADD COLUMN IF NOT EXISTS image TEXT;

-- 2) Create universal storage bucket for ALL images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3) Universal storage policies - anyone can view/upload ANY image
DROP POLICY IF EXISTS "Public can view all site images" ON storage.objects;
CREATE POLICY "Public can view all site images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Anyone can upload site images" ON storage.objects;
CREATE POLICY "Anyone can upload site images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-images');
