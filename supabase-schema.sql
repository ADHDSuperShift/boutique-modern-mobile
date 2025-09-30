-- Rooms table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  image TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wines table
CREATE TABLE wines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image TEXT,
  tasting_notes TEXT,
  vintage TEXT,
  region TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  room_id UUID REFERENCES rooms(id),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER DEFAULT 2,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurant reservations table
CREATE TABLE restaurant_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  guests INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wine inquiries table
CREATE TABLE wine_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wine_id UUID REFERENCES wines(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurant_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wine_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public can read rooms" ON rooms FOR SELECT USING (true);
CREATE POLICY "Public can read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can read wines" ON wines FOR SELECT USING (true);

-- Public insert policies for forms
CREATE POLICY "Public can insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert reservations" ON restaurant_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert wine inquiries" ON wine_inquiries FOR INSERT WITH CHECK (true);

-- Admin policies (requires authenticated user with admin role)
CREATE POLICY "Admins can manage rooms" ON rooms FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admins can manage wines" ON wines FOR ALL USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admins can view bookings" ON bookings FOR SELECT USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admins can view reservations" ON restaurant_reservations FOR SELECT USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admins can view contacts" ON contacts FOR SELECT USING (auth.jwt()->>'role' = 'admin');
CREATE POLICY "Admins can view inquiries" ON wine_inquiries FOR SELECT USING (auth.jwt()->>'role' = 'admin');
