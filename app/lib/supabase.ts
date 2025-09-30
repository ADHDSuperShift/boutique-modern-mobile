import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXItcHJvamVjdCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjc4ODg2NDAwLCJleHAiOjE5OTQ0NjI0MDB9.demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  rooms: {
    id: string;
    name: string;
    type: string;
    description: string;
    short_description: string;
    amenities: string[];
    images: string[];
    created_at: string;
    updated_at: string;
  };
  events: {
    id: string;
    title: string;
    date: string;
    description: string;
    image: string;
    created_at: string;
  };
  wines: {
    id: string;
    name: string;
    image: string;
    tasting_notes: string;
    created_at: string;
  };
  bookings: {
    id: string;
    name: string;
    email: string;
    phone: string;
    room_id: string;
    check_in: string;
    check_out: string;
    guests: number;
    message: string;
    created_at: string;
  };
  contacts: {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
  };
};
