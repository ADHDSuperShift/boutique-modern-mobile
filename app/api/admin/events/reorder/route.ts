import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const { order } = await req.json();
    if (!Array.isArray(order)) {
      return NextResponse.json({ error: 'Invalid body: requires order array' }, { status: 400 });
    }
    const rows = order.map((o: any) => ({ id: o.id, sort_order: o.sort_order }));
    const { error } = await supabaseAdmin.from('events').upsert(rows, { onConflict: 'id' });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
