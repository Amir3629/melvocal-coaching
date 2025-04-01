'use client';

import { useEffect, useState } from 'react';

/**
 * StaticSiteHandler component that bootstraps the site in static export mode
 * This provides minimal fixes for GitHub Pages deployment
 */
export function StaticSiteHandler() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only run once
    if (initialized) return;
    setInitialized(true);

    try {
      console.log('StaticSiteHandler: Initializing static site fixes');

      // Fix for useSearchParams
      // This patches the Next.js router to avoid errors in static exports
      if (typeof window !== 'undefined') {
        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        // Create a custom event for URL changes
        const dispatchRouteChangeEvent = () => {
          window.dispatchEvent(new Event('route-change'));
        };

        // Override history methods to dispatch events
        window.history.pushState = function() {
          const result = originalPushState.apply(this, arguments as any);
          dispatchRouteChangeEvent();
          return result;
        };

        window.history.replaceState = function() {
          const result = originalReplaceState.apply(this, arguments as any);
          dispatchRouteChangeEvent();
          return result;
        };

        // Listen for popstate events
        window.addEventListener('popstate', dispatchRouteChangeEvent);

        // Fix CSS resource paths if needed
        if (typeof document !== 'undefined') {
          // Find all CSS links with incorrect base path
          const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
          cssLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('/vocal-coaching/')) {
              const correctedHref = href.replace('/vocal-coaching/', '/melvocal-coaching/');
              console.log(`[StaticSiteHandler] Fixing CSS path: ${href} -> ${correctedHref}`);
              link.setAttribute('href', correctedHref);
            }
          });
          
          // Fix script paths
          const scripts = document.querySelectorAll('script[src]');
          scripts.forEach(script => {
            const src = script.getAttribute('src');
            if (src && src.includes('/vocal-coaching/')) {
              const correctedSrc = src.replace('/vocal-coaching/', '/melvocal-coaching/');
              console.log(`[StaticSiteHandler] Fixing JS path: ${src} -> ${correctedSrc}`);
              script.setAttribute('src', correctedSrc);
            }
          });
          
          // Fix image paths
          const images = document.querySelectorAll('img[src]');
          images.forEach(img => {
            const src = img.getAttribute('src');
            if (src && src.includes('/vocal-coaching/')) {
              const correctedSrc = src.replace('/vocal-coaching/', '/melvocal-coaching/');
              console.log(`[StaticSiteHandler] Fixing image path: ${src} -> ${correctedSrc}`);
              img.setAttribute('src', correctedSrc);
            }
          });
        }
      }
    } catch (e) {
      console.error('Error in StaticSiteHandler:', e);
    }
  }, [initialized]);

  // This component doesn't render anything visible
  return null;
}

export default StaticSiteHandler; 