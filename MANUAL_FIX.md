# 🔥 UNIVERSAL IMAGE UPLOAD - NO MORE SQL ERRORS

## Step 1: Create Universal Storage Bucket (2 minutes)

1. Go to: https://supabase.com/dashboard/project/edcajrnioxdzzoxeylhu/storage/buckets

2. Click **"New Bucket"** button

3. Fill in:
   - **Name**: `site-images` 
   - **Public**: ✅ YES (check this box)
   - **File size limit**: 50MB
   - **Allowed mime types**: Leave blank (allows all)

4. Click **"Create Bucket"**

## Step 2: Set Policies (30 seconds)

1. Click on your new `site-images` bucket

2. Go to **"Policies"** tab

3. Click **"New Policy"** 

4. Choose **"Custom"** and paste:
   ```sql
   bucket_id = 'site-images'
   ```

5. Check **"SELECT"** and **"INSERT"** boxes

6. Click **"Save"**

## Step 3: Test ALL Image Uploads (immediate)

### ✅ **ROOMS**: Admin → Rooms → Edit → Drag images (stored in `/rooms/` folder)
### ✅ **EVENTS**: Admin → Events → Edit → Drag images (stored in `/events/` folder)  
### ✅ **WINES**: Admin → Wines → Edit → Drag images (stored in `/wines/` folder)

## What You Get:

🎯 **Universal drag-and-drop** for ALL images on your site
📁 **Organized folders** (rooms/, events/, wines/)
💾 **Permanent storage** - images persist across page refreshes
🔄 **Graceful fallbacks** - still works even if storage fails

**DONE. EVERY FUCKING IMAGE ON YOUR SITE NOW HAS DRAG & DROP! 🎉**
