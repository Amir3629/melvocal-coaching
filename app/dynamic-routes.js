// Helper for dynamic routes in static export
// This is used by Next.js to export dynamic routes with predefined params

// List of dynamic routes to export at build time
export const dynamicParams = {
  // For /payment/[orderId] route
  '/payment/[orderId]': [
    { orderId: 'DEMO' }
  ],
};

// Helper function for Next.js to generate static paths
export function generateStaticParams() {
  return [
    { orderId: 'DEMO' }
  ];
} 