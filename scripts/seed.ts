// Seed Supabase with current static content for rooms, events, wines
// Usage: npm run seed (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)

import dotenv from 'dotenv';
// Prefer .env.local, fallback to default .env
dotenv.config({ path: '.env.local' });
dotenv.config();
import { v5 as uuidv5 } from 'uuid';
import { rooms as staticRooms } from '../app/data/rooms';
import { events as staticEvents } from '../app/data/events';
import { wines as staticWines } from '../app/data/wines';

const isUUID = (v: any) => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
// Stable namespace for v5 UUID generation (DNS namespace is a good fixed choice)
const NS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const roomId = (name: string) => uuidv5(`room:${name}`, NS);
const eventId = (title: string, date: string) => uuidv5(`event:${title}:${date}`, NS);
const wineId = (name: string, vintage?: string | null) => uuidv5(`wine:${name}:${vintage ?? ''}`, NS);

// Preflight env check for clearer errors
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('❌ Missing env: Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

async function getAdmin() {
  const mod = await import('../app/lib/supabaseAdmin');
  return mod.supabaseAdmin;
}

async function seedRooms() {
  const payload = staticRooms.map((r: any, idx: number) => ({
  id: isUUID(r.id) ? r.id : roomId(r.name),
    name: r.name,
    type: r.type,
    description: r.description,
    short_description: r.shortDesc ?? r.short_description ?? '',
    amenities: r.amenities ?? [],
    image: r.image,
    images: r.images ?? [],
    sort_order: idx + 1,
  }));
  const supabaseAdmin = await getAdmin();
  const { error } = await supabaseAdmin.from('rooms').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
  console.log(`Seeded ${payload.length} rooms`);
}

async function seedEvents() {
  const payload = staticEvents.map((e: any, idx: number) => ({
  id: isUUID(e.id) ? e.id : eventId(e.title, e.date),
    title: e.title,
    date: e.date,
    description: e.description,
    image: e.image,
    category: e.category ?? null,
    sort_order: idx + 1,
  }));
  const supabaseAdmin = await getAdmin();
  const { error } = await supabaseAdmin.from('events').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
  console.log(`Seeded ${payload.length} events`);
}

async function seedWines() {
  const payload = staticWines.map((w: any, idx: number) => ({
  id: isUUID(w.id) ? w.id : wineId(w.name, w.vintage),
    name: w.name,
    image: w.image,
    tasting_notes: w.tastingNotes ?? null,
    vintage: w.vintage ?? null,
    region: w.region ?? null,
    sort_order: idx + 1,
  }));
  const supabaseAdmin = await getAdmin();
  const { error } = await supabaseAdmin.from('wines').upsert(payload, { onConflict: 'id' });
  if (error) throw error;
  console.log(`Seeded ${payload.length} wines`);
}

async function main() {
  try {
    await seedRooms();
    await seedEvents();
    await seedWines();
    console.log('✅ Seeding complete');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

main();
