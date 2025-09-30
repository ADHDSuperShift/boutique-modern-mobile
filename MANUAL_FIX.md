# Fix: "Storage bucket not ready yet - using preview"

Follow these steps to enable real uploads to Supabase Storage instead of the temporary preview fallback.

## 1) Create or verify the bucket

1. Open your Supabase project Storage → Buckets:
   https://supabase.com/dashboard/project/edcajrnioxdzzoxeylhu/storage/buckets
2. If missing, create a bucket named `site-images` with Public on.
3. If it already exists, open it and confirm: Public = On.

## 2) Apply correct policies (fastest: run the SQL)

Run this file in Supabase SQL Editor: `migration-storage-bucket.sql`.
It will ensure the bucket exists and the policies below are set idempotently:

- Public read of objects in bucket `site-images`
- Admin-only write/update/delete (based on JWT role)

If you prefer UI, the policies must match:
- SELECT: `bucket_id = 'site-images'`
- INSERT/UPDATE/DELETE (to authenticated): `bucket_id = 'site-images' AND auth.jwt()->>'role' = 'admin'`

## 3) Ensure your admin role is on your user

Run the block at the end of `supabase-schema-complete.sql` to set admin role for:

- Email: `dirkawspy@gmail.com`

After running, sign out of the website and sign back in to refresh your JWT so `role=admin` is present in the token.

## 4) Check your env configuration

Make sure the browser client has valid environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

They should point to this project (the code also has working defaults for your project id).

Optional for local scripts only (not required in browser):

- `SUPABASE_SERVICE_ROLE_KEY` for seeding or admin scripts.

## 5) Retry an upload

Go to Admin → any section with an image field → drag a new image.
If an error occurs, the uploader will show a precise hint (bucket, policy, or auth).

## Quick verify checklist

- Storage → Buckets has `site-images` and it’s Public.
- SQL policies exist on `storage.objects` exactly as in `migration-storage-bucket.sql`.
- Your user has `role=admin` in app_metadata and you re-signed in.
- Upload works, and the image URL returned starts with `https://edcajrnioxdzzoxeylhu.supabase.co/storage/v1/object/public/site-images/…`

If still blocked, copy the exact error message surfaced in the upload alert and I’ll pinpoint the fix.
