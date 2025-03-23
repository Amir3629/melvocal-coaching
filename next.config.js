/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/melvocal-coaching' : '';

const nextConfig = {
  reactStrictMode: true,
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
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/resource',
    })
    return config
  },
  publicRuntimeConfig: {
    basePath: process.env.NODE_ENV === 'production' ? '/melvocal-coaching' : '',
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
