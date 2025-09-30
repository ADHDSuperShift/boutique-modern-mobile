#!/bin/bash

# 🔧 Environment Setup Helper
# Helps configure your local environment for Supabase + Vercel

echo "🏨 Boutique Hotel - Environment Setup"
echo "====================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
fi

echo ""
echo "🔑 Environment Configuration Required:"
echo ""
echo "Please update your .env.local file with real Supabase credentials:"
echo ""
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Create a new project (if not done already)"
echo "3. Go to Settings > API"
echo "4. Copy your Project URL and API Key"
echo "5. Update .env.local with these values:"
echo ""
echo "   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here"
echo ""

# Check if user wants to open .env.local
read -p "🚀 Open .env.local file now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v code &> /dev/null; then
        code .env.local
    elif command -v nano &> /dev/null; then
        nano .env.local
    else
        echo "📂 Please manually edit: .env.local"
    fi
fi

echo ""
echo "📋 Next Steps:"
echo "1. ✅ Update .env.local with real Supabase credentials"
echo "2. 🗄️  Deploy database schema (see SUPABASE_VERCEL_SETUP.md)"
echo "3. 🧪 Test locally: npm run dev"
echo "4. 🚀 Deploy: ./deploy.sh"
echo ""
echo "📚 Full guide: SUPABASE_VERCEL_SETUP.md"
