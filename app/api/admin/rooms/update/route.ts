'use server';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, payload } = body as { id: string; payload: Record<string, any> };
    if (!id || !payload) return NextResponse.json({ error: 'Missing id or payload' }, { status: 400 });

    const { error } = await supabaseAdmin.from('rooms').update(payload).eq('id', id);
    if (error) return NextResponse.json({ error: error.message, details: (error as any)?.details }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
