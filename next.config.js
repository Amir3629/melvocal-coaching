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
  
  // Advanced experimental features to improve static export compatibility
  experimental: {
    // Fix useSearchParams issues by disabling the bailout behavior
    missingSuspenseWithCSRBailout: false,
    
    // Optimize text for hydration issues
    optimizeServerReact: true,
    
    // Improve JSX support for better hydration
    optimizeCss: true,
    
    // Allow more time for hydration to complete
    ppr: false,
    
    // Fallback for static rendering
    isrMemoryCacheSize: 0,
    
    // Improved error handling for component stacks
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'INP', 'TTFB']
  }
}

module.exports = nextConfig
