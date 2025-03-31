/** @type {import('next').NextConfig} */

// Force GitHub Pages mode for deployment
process.env.GITHUB_PAGES = 'true';

const isProduction = process.env.NODE_ENV === 'production';
// Check for GitHub Pages deployment - default to false for Vercel
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isProduction && isGitHubPages ? '/melvocal-coaching' : '';

const nextConfig = {
  reactStrictMode: true,
  // Configure paths for GitHub Pages
  basePath: basePath,
  assetPrefix: basePath,
  // Configure static export
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i3.ytimg.com',
        pathname: '/vi/**',
      }
    ],
    domains: ['images.unsplash.com'],
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configure trailing slash for better compatibility
  trailingSlash: true,
  // Add better error handling
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
}

module.exports = nextConfig
