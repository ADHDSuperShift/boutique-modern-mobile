import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: 'Expected application/json' }, { status: 400 });
    }
    const payload = await req.json();
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
    const { data: existing, error: selErr } = await supabaseAdmin
      .from('restaurant_info')
      .select('id')
      .limit(1);
    if (selErr) return NextResponse.json({ error: selErr.message }, { status: 400 });
    const row = {
      title: payload.title ?? null,
      subtitle: payload.subtitle ?? null,
      description: payload.description ?? null,
      features: Array.isArray(payload.features) ? payload.features : [],
      background_image: payload.backgroundImage ?? payload.background_image ?? null,
      menu_sections: Array.isArray(payload.menuSections) || typeof payload.menuSections === 'object' ? payload.menuSections : [],
    };
    if (existing && existing.length > 0 && existing[0]?.id) {
      const { error } = await supabaseAdmin
        .from('restaurant_info')
        .update(row)
        .eq('id', existing[0].id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true, id: existing[0].id });
    } else {
      const { error } = await supabaseAdmin
        .from('restaurant_info')
        .insert({ id: 'restaurant', ...row });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
