import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    if (!req.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: 'Expected application/json' }, { status: 400 });
    }
    const payload = await req.json();
    const images: string[] | null = Array.isArray(payload.images) ? payload.images : null;
    const row: any = {
      title: payload.title ?? null,
    };
    if (images) row.images = images;
    const { data: existing, error: selErr } = await supabaseAdmin
      .from('gallery_section')
      .select('id')
      .limit(1);
    if (selErr) return NextResponse.json({ error: selErr.message }, { status: 400 });
    if (existing && existing.length > 0) {
      const { error } = await supabaseAdmin.from('gallery_section').update(row).eq('id', existing[0].id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true, id: existing[0].id });
    }
    const { error } = await supabaseAdmin.from('gallery_section').insert({ id: 'gallery', ...row });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
