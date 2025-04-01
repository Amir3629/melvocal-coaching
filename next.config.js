/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';
// Check for GitHub Pages deployment - default to true when running in GitHub Actions
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true' || process.env.GITHUB_PAGES === 'true';
const basePath = isProduction && isGitHubPages ? '/melvocal-coaching' : '';

const nextConfig = {
  reactStrictMode: false, // Disable strict mode to prevent double-rendering issues
  basePath: basePath,
  assetPrefix: basePath,
  output: 'export', // Always use export for GitHub Pages compatibility
  // Define which page extensions to include in the build (exclude test files)
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
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

    // Enhanced error handling in production
    if (isProduction && !isServer) {
      config.devtool = 'source-map';
    }

    // Remove any circular dependencies which can cause issues
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'chunks/vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };

    return config;
  },
  // Enable production browser source maps for better error tracking
  productionBrowserSourceMaps: true,
  publicRuntimeConfig: {
    basePath: isProduction && isGitHubPages ? '/melvocal-coaching' : '',
  },
  // Exclude backup and temporary directories
  experimental: {
    // Disable runtimeJS for better static export compatibility
    nextScriptWorkers: true,
    // Process more files in parallel for better performance
    cpus: 4,
    outputFileTracingExcludes: {
      '*': [
        '**/backup-before-restore-*/**',
        '**/meljazz-temp/**',
        '**/backups/**',
        '**/restore-temp/**',
        '**/current-backup-*/**',
        '**/clean_restore/**',
        '**/test-router/**', // Exclude test router directory
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
  // Add router safety
  staticPageGenerationTimeout: 180,
  swcMinify: false, // Disable SWC minification to avoid potential issues
}

module.exports = nextConfig
