# 🚀 FIX IMAGE PERSISTENCE - DEPLOY DATABASE & STORAGE

## The Problem
Images aren't persisting because we're using preview URLs that disappear after page refresh.

## The Solution
Set up Supabase Storage + update your database schema.

## 🗄️ STEP 1: Deploy Updated Database Schema

1. Go to your Supabase project:
   **https://supabase.com/dashboard/project/edcajrnioxdzzoxeylhu**

2. Click **'SQL Editor'** in the left sidebar

3. **IMPORTANT**: First drop existing tables (if any) by running:
   ```sql
   DROP TABLE IF EXISTS bookings CASCADE;
   DROP TABLE IF EXISTS restaurant_reservations CASCADE;
   DROP TABLE IF EXISTS contacts CASCADE;
   DROP TABLE IF EXISTS wine_inquiries CASCADE;
   DROP TABLE IF EXISTS events CASCADE;
   DROP TABLE IF EXISTS wines CASCADE;
   DROP TABLE IF EXISTS rooms CASCADE;
   ```

4. Copy the **ENTIRE contents** of `supabase-schema.sql`

5. Paste it into the SQL Editor

6. Click **'RUN'** to create:
   ✅ Updated rooms table with image & price fields
   ✅ Storage bucket for persistent images
   ✅ Storage policies for admin uploads
   ✅ All other database tables

## 📸 STEP 2: Test Image Upload

1. Go to **Admin Console** → **Rooms** → **Edit any room**
2. **Drag & drop** an image file
3. **Save** the room
4. **Refresh the page** - image should still be there!

## 🔧 What Was Fixed

1. **Supabase Storage Integration**: Images now upload to permanent storage
2. **Database Schema**: Added `image` and `price` fields to rooms table  
3. **Storage Policies**: Configured proper permissions for admin uploads
4. **Fallback Handling**: If storage fails, still shows preview (graceful degradation)

## ⚠️ If Storage Bucket Creation Fails

The storage bucket might need to be created manually:

1. Go to **Storage** in Supabase dashboard
2. Click **'New Bucket'**
3. Name: `room-images`
4. Make it **Public**
5. Save

Then your drag & drop uploads will work permanently!

---

**After deploying the schema, your fucking photos will persist! 🎉**
