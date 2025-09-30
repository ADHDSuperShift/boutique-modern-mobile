# Deployment Guide

## Supabase Setup

### 1. Create Supabase Project
1. Go to https://supabase.com and create a new project
2. Note your project URL and anon key from Settings > API

### 2. Run Database Schema
1. Open SQL Editor in Supabase dashboard
2. Copy and paste the entire content of `supabase-schema.sql`
3. Execute the SQL to create all tables and policies

### 3. Create Admin User
Run this SQL in Supabase SQL Editor (replace with your credentials):

```sql
-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@barrydalekaroolodge.co.za',
  crypt('YourSecurePassword123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"],"role":"admin"}',
  '{}',
  now(),
  now()
);
```

### 4. Enable Storage (Optional)
If you want to use Supabase Storage for images:
1. Go to Storage in Supabase dashboard
2. Create buckets: `room-images`, `wine-images`, `event-images`
3. Set bucket policies to public read access

## Vercel Deployment

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. Add Environment Variables
In Vercel dashboard (Settings > Environment Variables):
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

## Custom Domain Setup

1. Go to Vercel project settings > Domains
2. Add your custom domain (e.g., barrydalekaroolodge.co.za)
3. Update DNS records as instructed by Vercel
4. SSL certificate will be automatically provisioned

## Post-Deployment

### Seed Initial Data
You can populate the database with the room data from `src/data/rooms.ts`:

```sql
-- Example: Insert a room
INSERT INTO rooms (name, type, description, short_description, amenities, images)
VALUES (
  'Aloe Ferox',
  'Standard Twin Room',
  'Featuring handcrafted décor, twin beds, and a spacious en-suite bathroom.',
  'A cozy twin room designed for restful nights after a day exploring Route 62.',
  '["Free WiFi", "Mini-fridge", "Coffee station", "Shower", "Mountain views"]'::jsonb,
  ARRAY['image-url-1', 'image-url-2', 'image-url-3']
);
```

### Test Admin Access
1. Visit https://your-domain.com/admin
2. Login with admin credentials
3. Verify all management features work

## Monitoring

- **Supabase Dashboard**: Monitor database usage, API calls
- **Vercel Analytics**: Track page views and performance
- **Error Tracking**: Check Vercel logs for any runtime errors

## Backup Strategy

1. **Database**: Supabase provides automatic daily backups
2. **Manual Backup**: Export data via Supabase dashboard
3. **Code**: Git repository serves as source backup

## Support

For issues or questions:
- Email: info@barrydalekaroolodge.co.za
- Phone: +27 (028) 572 1020
