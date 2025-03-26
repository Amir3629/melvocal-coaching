/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';
// Check for GitHub Pages deployment - default to false for Vercel
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isProduction && isGitHubPages ? '/melvocal-coaching' : '';

const nextConfig = {
  reactStrictMode: true,
  // Only apply basePath and assetPrefix for GitHub Pages
  ...(isGitHubPages ? {
    basePath: basePath,
    assetPrefix: basePath,
  } : {}),
  // Only set output to 'export' when deploying to GitHub Pages
  ...(isGitHubPages ? { output: 'export' } : {}),
  images: {
    unoptimized: isGitHubPages, // Only unoptimize for GitHub Pages
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
  trailingSlash: isGitHubPages, // Only use trailing slash for GitHub Pages
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/resource',
    })
    return config
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
}

module.exports = nextConfig
