import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
    const { data: existing, error: selErr } = await supabaseAdmin
      .from('restaurant_info')
      .select('id')
      .limit(1);
    if (selErr) return NextResponse.json({ error: selErr.message }, { status: 400 });
    if (existing && existing.length > 0 && existing[0]?.id) {
      const { error } = await supabaseAdmin
        .from('restaurant_info')
        .update(payload)
        .eq('id', existing[0].id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true, id: existing[0].id });
    } else {
      const { error } = await supabaseAdmin
        .from('restaurant_info')
        .insert(payload);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
