'use server';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order } = body as { order: Array<{ id: string; sort_order: number }>; };
    if (!Array.isArray(order)) return NextResponse.json({ error: 'Invalid order' }, { status: 400 });

    const { error } = await supabaseAdmin.from('rooms').upsert(order, { onConflict: 'id' });
    if (error) return NextResponse.json({ error: error.message, details: (error as any)?.details }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
