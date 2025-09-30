# 🏨 Boutique Hotel - Supabase + Vercel Setup Guide

## 📋 **Prerequisites**
- [Supabase Account](https://supabase.com)
- [Vercel Account](https://vercel.com)
- [Vercel CLI](https://vercel.com/cli) (optional but recommended)

## 🔧 **Step 1: Supabase Project Setup**

### 1.1 Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Set project name: `boutique-hotel-app`
5. Set database password (save this!)
6. Choose region closest to your users
7. Click "Create new project"

### 1.2 Get Project Credentials
1. Go to **Settings > API**
2. Copy these values:
   - **Project URL** (starts with `https://xxx.supabase.co`)
   - **Project API Key** (anon/public key)

### 1.3 Setup Database Schema
1. Go to **SQL Editor** in Supabase Dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Click **Run** to create all tables

## 🌐 **Step 2: Local Environment Setup**

### 2.1 Update Environment Variables
Update your `.env.local` file with real Supabase credentials:

```bash
# Replace with your actual Supabase project details
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### 2.2 Test Local Connection
```bash
npm run dev
```
Open `http://localhost:3000` and test the admin console to verify database connection.

## 🚀 **Step 3: Vercel Deployment**

### 3.1 Option A: Deploy via GitHub (Recommended)
1. Push your code to GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure as follows:
   - **Framework**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3.2 Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: boutique-hotel-app
# - Which scope? Your account
# - Link to existing project? No
```

### 3.3 Configure Environment Variables in Vercel
1. In Vercel Dashboard, go to your project
2. Go to **Settings > Environment Variables**
3. Add these variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_actual_anon_key_here
   ```
4. Set for **Production**, **Preview**, and **Development**

### 3.4 Redeploy with Environment Variables
```bash
# If using CLI
vercel --prod

# Or trigger redeploy from Vercel Dashboard
```

## 🔐 **Step 4: Database Security (Optional)**

### 4.1 Row Level Security (RLS)
For production, consider enabling RLS on sensitive tables:

```sql
-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to rooms, events, wines
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on rooms" ON rooms FOR SELECT USING (true);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on events" ON events FOR SELECT USING (true);

ALTER TABLE wines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on wines" ON wines FOR SELECT USING (true);
```

## 🎯 **Step 5: Verification Checklist**

- [ ] Supabase project created and configured
- [ ] Database schema deployed successfully
- [ ] Local environment variables updated
- [ ] Local development works (`npm run dev`)
- [ ] Code pushed to GitHub
- [ ] Vercel project created and deployed
- [ ] Environment variables configured in Vercel
- [ ] Production deployment successful
- [ ] Admin console works on live site
- [ ] Drag-and-drop functionality operational

## 🔗 **Useful Links**

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Live Site**: https://your-project.vercel.app
- **Supabase Documentation**: https://supabase.com/docs
- **Vercel Documentation**: https://vercel.com/docs

## 🆘 **Troubleshooting**

### Database Connection Issues
- Verify environment variables in both local and Vercel
- Check Supabase project is active (not paused)
- Confirm API keys are correct and not expired

### Deployment Issues
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Verify Next.js configuration in `next.config.js`

### CORS Issues
- Supabase automatically handles CORS for your Vercel domain
- If issues persist, check Supabase > Settings > API > CORS origins

---

**🎉 Once complete, your luxury boutique hotel website will be live with:**
- Real-time database connectivity
- Admin dashboard with drag-and-drop functionality
- Scalable hosting on Vercel's global CDN
- Professional SSL certificate included
- Automatic deployments on code changes
