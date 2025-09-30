#!/bin/bash

# 🚀 Boutique Hotel - Quick Deployment Script
# This script helps deploy your app to Vercel with proper configuration

echo "🏨 Boutique Hotel - Vercel Deployment Helper"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo ""
echo "🔧 Pre-deployment checklist:"
echo "1. ✅ Supabase project created"
echo "2. ✅ Database schema deployed"
echo "3. ✅ Environment variables configured"
echo ""

# Build the project locally first
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix build errors before deploying."
    exit 1
fi

echo "✅ Local build successful!"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "📝 Note: You'll need to configure environment variables in Vercel Dashboard"
echo ""

# Deploy with Vercel
vercel --prod

echo ""
echo "🎉 Deployment initiated!"
echo ""
echo "📋 Next steps:"
echo "1. Configure environment variables in Vercel Dashboard:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "2. Test your live site"
echo "3. Verify admin console functionality"
echo ""
echo "📚 Full setup guide: SUPABASE_VERCEL_SETUP.md"
