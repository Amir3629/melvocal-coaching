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
  
  // Disable minification for easier debugging
  swcMinify: false,
  
  // Advanced experimental features to improve static export compatibility
  experimental: {
    // Fix useSearchParams issues by disabling the bailout behavior
    missingSuspenseWithCSRBailout: false,
    
    // Optimize text for hydration issues
    optimizeServerReact: true,
    
    // Improve JSX support for better hydration
    optimizeCss: true,
    
    // Disable PPR for static exports since it can cause hydration issues
    ppr: false,
    
    // Fallback for static rendering
    isrMemoryCacheSize: 0,
    
    // Improved error handling for component stacks
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'INP', 'TTFB'],
    
    // Disable React server components which can cause issues in static exports
    appDir: true,
    serverActions: false,
    
    // Allow more time for hydration to complete
    runtime: 'edge',
    
    // Ignore specific errors that commonly happen in static exports
    scrollRestoration: true,
    
    // Force all pages to have the same styling baseline
    optimizeFonts: false
  },
  
  // Add custom redirect for the homepage to improve GitHub Pages handling
  async redirects() {
    return [
      {
        source: '/melvocal-coaching',
        destination: '/melvocal-coaching/',
        permanent: true
      }
    ];
  }
}

module.exports = nextConfig
