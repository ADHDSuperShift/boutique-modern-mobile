'use server';

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!url) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL for admin client');
}
if (!serviceKey) {
  console.warn('[seed] SUPABASE_SERVICE_ROLE_KEY not set — admin operations will fail');
}

export const supabaseAdmin = createClient(url, serviceKey || '');
