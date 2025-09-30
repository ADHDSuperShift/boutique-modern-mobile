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
    // Try update existing row if any, else insert new
    const { data: existing, error: selErr } = await supabaseAdmin
      .from('hero_section')
      .select('id')
      .limit(1);
    if (selErr) {
      return NextResponse.json({ error: selErr.message }, { status: 400 });
    }
    const row = {
      title: payload.title ?? null,
      subtitle: payload.subtitle ?? null,
      description: payload.description ?? null,
      background_image: payload.backgroundImage ?? payload.background_image ?? null,
      cta_text: payload.ctaText ?? payload.cta_text ?? null,
      cta_link: payload.ctaLink ?? payload.cta_link ?? null,
    };
    if (existing && existing.length > 0 && existing[0]?.id) {
      const { error } = await supabaseAdmin
        .from('hero_section')
        .update(row)
        .eq('id', existing[0].id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true, id: existing[0].id });
    } else {
      const { error } = await supabaseAdmin
        .from('hero_section')
        .insert({ id: 'hero', ...row });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true });
    }
  } catch (e: any) {
  return NextResponse.json({ error: e?.message || 'Unknown error', stack: e?.stack }, { status: 500 });
  }
}
