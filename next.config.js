/** @type {import('next').NextConfig} */

const nextConfig = {
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
  
  // Keep minification disabled for easier debugging
  swcMinify: false,
  
  // Minimum required experimental features
  experimental: {
    // Fix useSearchParams issues
    missingSuspenseWithCSRBailout: false,
  },
  
  // Webpack configuration for fonts and SVGs
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
      type: 'asset/resource',
    })
    return config
  },
  
  // Runtime configuration
  publicRuntimeConfig: {
    basePath: process.env.NODE_ENV === 'production' ? '/melvocal-coaching' : '',
  },
}

module.exports = nextConfig
