/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'edcajrnioxdzzoxeylhu.supabase.co',
      'd64gsuwffb70l.cloudfront.net'
    ],
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
}

module.exports = nextConfig
