import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const token = process.env.ADMIN_MAINTENANCE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Server not configured: ADMIN_MAINTENANCE_TOKEN missing' }, { status: 500 });
  }
  if (!auth.startsWith('Bearer ') || auth.slice(7) !== token) return unauthorized();

  try {
    // Rooms dedupe by lower(name)
    const roomsRes = await supabaseAdmin.from('rooms').select('*').order('created_at', { ascending: true });
    if (roomsRes.error) throw roomsRes.error;
    const rooms = roomsRes.data || [];
    const seenRooms = new Map<string, string>();
    const delRoomIds: string[] = [];
    for (const r of rooms) {
      const key = (r.name || '').trim().toLowerCase();
      if (!key) continue;
      if (seenRooms.has(key)) delRoomIds.push(r.id); else seenRooms.set(key, r.id);
    }
    if (delRoomIds.length) {
      const { error } = await supabaseAdmin.from('rooms').delete().in('id', delRoomIds);
      if (error) throw error;
    }

    // Events dedupe by lower(title)+date
    const eventsRes = await supabaseAdmin.from('events').select('*').order('created_at', { ascending: true });
    if (eventsRes.error) throw eventsRes.error;
    const events = eventsRes.data || [];
    const seenEvents = new Set<string>();
    const delEventIds: string[] = [];
    for (const e of events) {
      const key = `${(e.title || '').trim().toLowerCase()}|${e.date}`;
      if (seenEvents.has(key)) delEventIds.push(e.id); else seenEvents.add(key);
    }
    if (delEventIds.length) {
      const { error } = await supabaseAdmin.from('events').delete().in('id', delEventIds);
      if (error) throw error;
    }

    // Wines dedupe by lower(name)+vintage
    const winesRes = await supabaseAdmin.from('wines').select('*').order('created_at', { ascending: true });
    if (winesRes.error) throw winesRes.error;
    const wines = winesRes.data || [];
    const seenWines = new Set<string>();
    const delWineIds: string[] = [];
    for (const w of wines) {
      const key = `${(w.name || '').trim().toLowerCase()}|${w.vintage || ''}`;
      if (seenWines.has(key)) delWineIds.push(w.id); else seenWines.add(key);
    }
    if (delWineIds.length) {
      const { error } = await supabaseAdmin.from('wines').delete().in('id', delWineIds);
      if (error) throw error;
    }

    return NextResponse.json({ ok: true, removed: { rooms: delRoomIds.length, events: delEventIds.length, wines: delWineIds.length } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Unexpected error' }, { status: 500 });
  }
}
