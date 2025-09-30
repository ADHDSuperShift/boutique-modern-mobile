import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ? true : false;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY ? true : false;
  try {
    const { data, error } = await supabaseAdmin
      .from('hero_section')
      .select('id')
      .limit(1);
    return NextResponse.json({
      env: { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: service },
      db: { ok: !error, rows: data?.length ?? 0, error: error?.message },
    });
  } catch (e: any) {
    return NextResponse.json({
      env: { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: service },
      db: { ok: false, error: e?.message || 'unknown' },
    }, { status: 500 });
  }
}
