'use client';

import { useEffect, useState } from 'react';

/**
 * StaticSiteHandler component that bootstraps the site in static export mode
 * This adds fixes and polyfills for common static site export issues
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

        // Add direct fallbacks for missing Next.js router
        if (typeof (window as any).__NEXT_DATA__ === 'undefined') {
          (window as any).__NEXT_DATA__ = {
            props: {},
            page: window.location.pathname,
            query: {},
            buildId: 'static-export'
          };
        }

        // Create a fallback for useSearchParams
        if (!(window as any).__next_search_params_fix) {
          (window as any).__next_search_params_fix = true;

          // Create a MutationObserver to monitor DOM changes and fix hydration issues
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                for (const node of addedNodes) {
                  if (node instanceof HTMLElement && node.dataset.hydrationError) {
                    // Fix potential hydration errors
                    console.log('Fixing hydration error in:', node);
                    node.removeAttribute('data-hydration-error');
                    node.style.display = 'block';
                  }
                }
              }
            });
          });

          // Start observing the document body for hydration issues
          observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: true,
            attributeFilter: ['data-hydration-error']
          });
        }
      }

      console.log('StaticSiteHandler: Static site fixes initialized');
    } catch (e) {
      console.error('StaticSiteHandler: Error initializing static site fixes', e);
    }
  }, [initialized]);

  // This component doesn't render anything
  return null;
}

export default StaticSiteHandler; 