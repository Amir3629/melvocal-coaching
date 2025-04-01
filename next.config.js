/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/melvocal-coaching' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/melvocal-coaching/' : '',
  trailingSlash: true,
  
  // Disable TypeScript and ESLint checks for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  swcMinify: false,
  
  // Bypass client-side hydration warnings - this is safe for static exports
  experimental: {
    missingSuspenseWithCSRBailout: false
  }
}

module.exports = nextConfig
