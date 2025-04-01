/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';
// Check for GitHub Pages deployment - default to false for Vercel
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isProduction && isGitHubPages ? '/melvocal-coaching' : '';

const nextConfig = {
  reactStrictMode: true,
  basePath: basePath,
  assetPrefix: basePath,
  output: 'export', // Always use export for GitHub Pages compatibility
  images: {
    unoptimized: true, // Unoptimize for static exports
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
  trailingSlash: true, // Use trailing slash for better compatibility
  webpack: (config, { dev, isServer }) => {
    // Add webpack configuration for improved debugging
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/resource',
    });

    // Enhanced error handling in development
    if (dev && !isServer) {
      config.devtool = 'source-map';
    }

    return config;
  },
  publicRuntimeConfig: {
    basePath: isProduction && isGitHubPages ? '/melvocal-coaching' : '',
  },
  // Exclude backup and temporary directories
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        '**/backup-before-restore-*/**',
        '**/meljazz-temp/**',
        '**/backups/**',
        '**/restore-temp/**',
        '**/current-backup-*/**',
        '**/clean_restore/**',
      ],
    },
  },
  // Disable TypeScript checking during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add better error handling
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
}

module.exports = nextConfig
