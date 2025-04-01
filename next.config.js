/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';
// Check for GitHub Pages deployment
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true' || process.env.GITHUB_PAGES === 'true';
const basePath = isProduction && isGitHubPages ? '/melvocal-coaching' : '';

const nextConfig = {
  reactStrictMode: false,
  basePath: basePath,
  assetPrefix: basePath,
  output: 'export',
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
  trailingSlash: true,
  
  // Disable TypeScript and ESLint checks
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  swcMinify: false
}

module.exports = nextConfig
