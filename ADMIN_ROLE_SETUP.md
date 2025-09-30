# Admin role setup (Supabase)

Use this to grant the admin role to a specific user email.

Steps:
- Open Supabase Dashboard → SQL Editor
- Paste and run the SQL below (change the email if needed)
- Sign out/in to refresh session claims

SQL:

```sql
-- Set admin role in auth.users app metadata
update auth.users
set raw_app_meta_data = jsonb_set(
  coalesce(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'::jsonb,
  true
)
where email = 'dirkawspy@gmail.com';

-- Optional: verify
select id, email, raw_app_meta_data
from auth.users
where email = 'dirkawspy@gmail.com';
```

Notes:
- If RLS checks user role, ensure policies allow role = 'admin' to write.
- After running, log out and back in to refresh JWT claims.
