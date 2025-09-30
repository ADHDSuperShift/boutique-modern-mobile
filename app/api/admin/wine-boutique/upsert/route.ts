import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: 'Expected application/json' }, { status: 400 });
    }
    const payload = await req.json();
    const row = {
      title: payload.title ?? null,
      subtitle: payload.subtitle ?? null,
      description: payload.description ?? null,
      background_image: payload.backgroundImage ?? payload.background_image ?? null,
    };
    const { data: existing, error: selErr } = await supabaseAdmin
      .from('wine_boutique_info')
      .select('id')
      .limit(1);
    if (selErr) return NextResponse.json({ error: selErr.message }, { status: 400 });
    if (existing && existing.length > 0) {
      const { error } = await supabaseAdmin.from('wine_boutique_info').update(row).eq('id', existing[0].id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true, id: existing[0].id });
    }
    const { error } = await supabaseAdmin.from('wine_boutique_info').insert({ id: 'wine_boutique', ...row });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
