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
    domains: ['images.unsplash.com', 'img.youtube.com', 'i3.ytimg.com'],
  },
  
  // Only export these specific routes and ignore dynamic routes
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/impressum': { page: '/impressum' },
      '/datenschutz': { page: '/datenschutz' },
      '/agb': { page: '/agb' },
      '/test': { page: '/test' },
      '/payment/DEMO': { page: '/payment/[orderId]', query: { orderId: 'DEMO' } },
    }
  },
  
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
