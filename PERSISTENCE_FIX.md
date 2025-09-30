# 🗄️ Complete Database & Admin Setup Guide

## 📋 **Overview**
This guide will set up your complete boutique hotel website with:
- ✅ **11 Database Tables** for all content and forms
- ✅ **Universal Image Storage** with drag-and-drop uploads
- ✅ **Comprehensive Admin Panel** to edit everything
- ✅ **Row Level Security** for proper access control
- ✅ **Customer Forms** (bookings, contact, wine inquiries)

---

## 🚀 **STEP 1: Deploy Database Schema**

### **1.1 Run Complete SQL Schema**
1. **Go to:** [Supabase SQL Editor](https://supabase.com/dashboard/project/edcajrnioxdzzoxeylhu/sql)
2. **Copy the ENTIRE contents** of `supabase-schema-complete.sql`
3. **Paste into SQL Editor**
4. **Click RUN** to create all tables and policies

### **1.2 What This Creates:**
**Core Tables:**
- `rooms` - Hotel room listings with amenities and images
- `events` - Event calendar with categories and images  
- `wines` - Wine collection with tasting notes and images
- `bookings` - Customer room reservations
- `restaurant_reservations` - Restaurant bookings
- `contacts` - Contact form submissions
- `wine_inquiries` - Wine-related customer inquiries

**Admin Content Tables:**
- `hero_section` - Main page hero content (title, subtitle, background)
- `amenities` - Hotel amenities with icons and images
- `restaurant_info` - Restaurant details, menu sections, and features
- `contact_info` - Contact details, social links, and map

---

## 🔐 **STEP 2: Create Storage Bucket**

### **2.1 Universal Image Storage**
1. **Go to:** [Supabase Storage](https://supabase.com/dashboard/project/edcajrnioxdzzoxeylhu/storage/buckets)
2. **Click "New bucket"**
3. **Settings:**
   - **Name:** `site-images`
   - **Public:** ✅ **Enable**
   - **File size limit:** 50MB
   - **Allowed MIME types:** Leave default (images)
4. **Click "Save"**

### **2.2 Folder Organization**
The system automatically organizes uploads into folders:
```
site-images/
├── rooms/          # Room images
├── events/         # Event images  
├── wines/          # Wine bottle images
├── amenities/      # Amenity images
├── hero/           # Hero section backgrounds
├── restaurant/     # Restaurant images
└── contact/        # Contact section images
```

---

## 🔑 **STEP 3: Create Admin User**

### **3.1 Method 1: Supabase Dashboard (Recommended)**
1. **Go to:** [Authentication → Users](https://supabase.com/dashboard/project/edcajrnioxdzzoxeylhu/auth/users)
2. **Click "Add user"**
3. **Enter your credentials:**
   - **Email:** Your admin email
   - **Password:** Secure admin password
   - **Email confirm:** ✅ **Skip**
4. **Raw user meta data:** 
   ```json
   {"role": "admin"}
   ```
5. **Click "Save"**

### **3.2 Method 2: SQL Update (Alternative)**
If you already have a user, run this in SQL Editor:
```sql
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"admin"'
)
WHERE email = 'your-email@domain.com';
```

---

## 🎨 **STEP 4: Test Admin Panel**

### **4.1 Access Admin Dashboard**
1. **Local:** `http://localhost:3004/admin`
2. **Production:** `https://your-vercel-domain.com/admin`

### **4.2 Available Admin Sections:**
**Content Management:**
- 🏠 **Hero Section** - Main page title, subtitle, background image, CTA button
- 🏊‍♂️ **Amenities** - Add/edit spa, pool, dining features with custom icons
- 🍽️ **Restaurant** - Menu sections, items, pricing, restaurant features
- 📞 **Contact** - Contact details, social media links, Google Maps

**Inventory Management:**
- 🛏️ **Rooms** - Room listings with amenities, pricing, image galleries
- 🎉 **Events** - Event calendar with categories and promotional images
- 🍷 **Wines** - Wine collection with tasting notes and bottle images

**Customer Data:**
- 📋 **Bookings** - View room reservations and guest details

### **4.3 Universal Features:**
- ✅ **Drag-and-drop image uploads** for ALL content
- ✅ **Real-time preview** of changes
- ✅ **Organized file storage** in folders
- ✅ **Form validation** and error handling
- ✅ **Responsive design** for mobile admin access

---

## 🔧 **STEP 5: Environment Configuration**

### **5.1 Verify Environment Variables**
Check `.env.local` contains:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://edcajrnioxdzzoxeylhu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkY2Fqcm5pb3hkenpveGV5bGh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNzUwMTAsImV4cCI6MjA3NDc1MTAxMH0.HS6dDqpp6l-bgpMfedt876Ba-t6c3qHDKD9NiVvrDWE
```

### **5.2 Production Deployment**
For Vercel deployment, set these environment variables in:
**Vercel Dashboard → Project → Settings → Environment Variables**

---

## ✅ **STEP 6: Verification Checklist**

### **6.1 Database Verification**
- [ ] All 11 tables created successfully
- [ ] Row Level Security enabled on all tables
- [ ] Public read policies working for content
- [ ] Admin policies working for management
- [ ] Default data inserted (hero, amenities, restaurant, contact)

### **6.2 Storage Verification**
- [ ] `site-images` bucket created and public
- [ ] Storage policies allow public viewing
- [ ] Admin can upload/delete images
- [ ] Folder structure working correctly

### **6.3 Authentication Verification**
- [ ] Admin user created with `{"role": "admin"}` metadata
- [ ] Can log in at `/admin` page
- [ ] All admin sections accessible
- [ ] Edit forms working properly

### **6.4 Admin Panel Verification**
- [ ] Hero Section editor working with image upload
- [ ] Amenities manager with add/edit/delete functionality
- [ ] Restaurant manager with menu sections and items
- [ ] Contact manager with social links and map
- [ ] Rooms manager with drag-and-drop images
- [ ] Events manager with category filtering
- [ ] Wines manager with tasting notes
- [ ] Bookings view showing customer data

---

## 🐛 **Common Issues & Solutions**

### **Issue: "Invalid API Key" Error**
**Solution:** Verify environment variables are correct and restart dev server

### **Issue: "Admin Access Denied"**
**Solution:** Check user metadata contains `{"role": "admin"}` exactly

### **Issue: "Images Not Uploading"**
**Solution:** Ensure `site-images` bucket is public and policies are applied

### **Issue: "Tables Not Found"**
**Solution:** Re-run the complete SQL schema from `supabase-schema-complete.sql`

### **Issue: "Modal Not Appearing"**
**Solution:** Check browser console for JavaScript errors, clear cache

---

## 🎯 **Success Criteria**

**You've successfully set up the system when:**
1. ✅ **Database:** All tables exist with proper policies
2. ✅ **Storage:** Images upload and display correctly
3. ✅ **Authentication:** Admin login works seamlessly
4. ✅ **Admin Panel:** All 8 sections are editable
5. ✅ **Customer Forms:** Bookings and contact forms submit successfully
6. ✅ **Universal Images:** Drag-and-drop works across all content types

---

## 📞 **Support**

If you encounter issues:
1. **Check browser console** for JavaScript errors
2. **Verify Supabase dashboard** for proper table/bucket creation
3. **Test admin user metadata** in Authentication section
4. **Confirm environment variables** are loaded correctly

**Your boutique hotel website now has complete content management capabilities!** 🏨✨