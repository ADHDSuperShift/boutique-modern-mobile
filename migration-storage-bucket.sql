-- Ensure 'site-images' storage bucket exists, is public, and policies are set
-- Run this in Supabase SQL Editor

-- Create/enable bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public, name = EXCLUDED.name;

-- Recreate policies idempotently
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

-- Verify
SELECT id, name, public FROM storage.buckets WHERE id = 'site-images';
