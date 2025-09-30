// Deduplicate rooms, events, wines by natural keys, keeping the earliest record
// Usage: tsx scripts/dedupe.ts

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

async function getAdmin() {
  const mod = await import('../app/lib/supabaseAdmin');
  return mod.supabaseAdmin;
}

async function dedupeRooms() {
  const supabase = await getAdmin();
  const { data, error } = await supabase.from('rooms').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  if (!data) return;
  const seen = new Map<string, string>();
  const toDelete: string[] = [];
  for (const r of data) {
    const key = (r.name || '').trim().toLowerCase();
    if (!key) continue;
    if (seen.has(key)) {
      toDelete.push(r.id);
    } else {
      seen.set(key, r.id);
    }
  }
  if (toDelete.length) {
    const { error: delErr } = await supabase.from('rooms').delete().in('id', toDelete);
    if (delErr) throw delErr;
    console.log(`Rooms deduped: removed ${toDelete.length}`);
  } else {
    console.log('Rooms dedupe: no duplicates');
  }
}

async function dedupeEvents() {
  const supabase = await getAdmin();
  const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  if (!data) return;
  const seen = new Set<string>();
  const toDelete: string[] = [];
  for (const e of data) {
    const key = `${(e.title || '').trim().toLowerCase()}|${e.date}`;
    if (seen.has(key)) {
      toDelete.push(e.id);
    } else {
      seen.add(key);
    }
  }
  if (toDelete.length) {
    const { error: delErr } = await supabase.from('events').delete().in('id', toDelete);
    if (delErr) throw delErr;
    console.log(`Events deduped: removed ${toDelete.length}`);
  } else {
    console.log('Events dedupe: no duplicates');
  }
}

async function dedupeWines() {
  const supabase = await getAdmin();
  const { data, error } = await supabase.from('wines').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  if (!data) return;
  const seen = new Set<string>();
  const toDelete: string[] = [];
  for (const w of data) {
    const key = `${(w.name || '').trim().toLowerCase()}|${w.vintage || ''}`;
    if (seen.has(key)) {
      toDelete.push(w.id);
    } else {
      seen.add(key);
    }
  }
  if (toDelete.length) {
    const { error: delErr } = await supabase.from('wines').delete().in('id', toDelete);
    if (delErr) throw delErr;
    console.log(`Wines deduped: removed ${toDelete.length}`);
  } else {
    console.log('Wines dedupe: no duplicates');
  }
}

async function main() {
  try {
    await dedupeRooms();
    await dedupeEvents();
    await dedupeWines();
    console.log('✅ Dedupe complete');
  } catch (err) {
    console.error('❌ Dedupe failed:', err);
    process.exit(1);
  }
}

main();
