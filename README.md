# Barrydale Karoo Lodge - Boutique Hotel Website

A modern, mobile-first boutique hotel website built with Next.js, Tailwind CSS, and Supabase.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Setup environment (interactive)
npm run setup

# Start development server
npm run dev
```

### Deploy to Production
```bash
# Quick deployment to Vercel
npm run deploy
```

## Features

### Public Website
- **Hero Section**: Full-screen hero with Karoo landscape imagery
- **11 Unique Rooms**: Responsive grid with detailed modals, image carousels, and booking forms
- **Vintage Car Restaurant**: Menu highlights and table reservation system
- **Wine Boutique**: Featured wines with tasting notes and inquiry forms
- **Events Calendar**: Dynamic events with detailed views
- **Amenities**: Splash pool, Windpomp Bar, fireplace lounge, conference room
- **Reviews Section**: Guest testimonials with TripAdvisor integration

### Admin Dashboard
- **Secure Access**: Admin login with luxury gradient styling
- **Drag & Drop Management**: Modern @dnd-kit powered interface for all content
- **Real-time Updates**: Live data synchronization with Supabase
- **Content Management**: CRUD operations for rooms, events, and wines
- **Bookings View**: View and manage room bookings and reservations
- **Responsive Design**: Fully functional on all devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Routing**: React Router v6
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

1. Create a new Supabase project at https://supabase.com
2. Run the SQL schema in `supabase-schema.sql` in your Supabase SQL editor
3. Copy `.env.example` to `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Admin User

In Supabase SQL Editor, create an admin user:

```sql
-- Create admin user (replace with your email/password)
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at, role)
VALUES ('admin@barrydalekaroolodge.co.za', crypt('your-password', gen_salt('bf')), now(), 'admin');
```

### 4. Run Development Server
```bash
npm run dev
```

Visit:
- Public site: http://localhost:5173
- Admin dashboard: http://localhost:5173/admin

### 5. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

## Database Schema

The application uses the following Supabase tables:

- **rooms**: Room information, amenities, and images
- **events**: Upcoming events and celebrations
- **wines**: Wine boutique inventory
- **bookings**: Room booking requests
- **restaurant_reservations**: Table reservations
- **contacts**: Contact form submissions
- **wine_inquiries**: Wine purchase inquiries

All tables have Row Level Security (RLS) enabled with public read access and admin-only write access.

## Admin Access

Navigate to `/admin` and login with your Supabase admin credentials to:
- Manage room listings and photos
- Add/edit/delete events
- Update wine inventory
- View booking requests and contact messages

## Color Palette

- Terracotta: `#C67B5C`
- Sage: `#8B9D83`
- Sand: `#E8DCC4`
- Charcoal: `#2C2C2C`

## Contact

**Barrydale Karoo Lodge**
11 Tennant Street, Barrydale, Western Cape, 6750
Phone: +27 (028) 572 1020
Email: info@barrydalekaroolodge.co.za
