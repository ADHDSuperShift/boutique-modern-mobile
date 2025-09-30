import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const { id, payload } = await req.json();
    if (!id || !payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid body: requires id and payload' }, { status: 400 });
    }
    const upsertRow = { id, ...payload };
    const { error } = await supabaseAdmin.from('wines').upsert(upsertRow, { onConflict: 'id' });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
