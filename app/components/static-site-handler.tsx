'use client';

import { useEffect, useState } from 'react';

/**
 * StaticSiteHandler component that bootstraps the site in static export mode
 * This adds fixes and polyfills for common static site export issues
 */
export function StaticSiteHandler() {
  const [initialized, setInitialized] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

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

        // Monitor for hydration errors
        const originalError = console.error;
        console.error = function(...args: any[]) {
          const errorMsg = args.join(' ');
          if (
            errorMsg.includes('Hydration') ||
            errorMsg.includes('content does not match') ||
            errorMsg.includes('Minified React error #418') ||
            errorMsg.includes('Minified React error #423') ||
            errorMsg.includes('Warning: Text content did not match')
          ) {
            setHasErrors(true);
            
            // Save hydration errors to localStorage
            try {
              const errors = JSON.parse(localStorage.getItem('melvocal-errors') || '[]');
              errors.push({
                type: 'hydration',
                message: errorMsg.slice(0, 500), // Limit length
                url: window.location.href,
                timestamp: new Date().toISOString()
              });
              localStorage.setItem('melvocal-errors', JSON.stringify(errors));
            } catch (e) {
              // Silently fail if localStorage is not available
            }
          }
          return originalError.apply(console, args);
        };

        // Create a MutationObserver to monitor DOM changes and fix hydration issues
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              const addedNodes = Array.from(mutation.addedNodes);
              for (const node of addedNodes) {
                if (node instanceof HTMLElement) {
                  if (node.dataset.hydrationError || node.classList.contains('hydration-error')) {
                    // Fix potential hydration errors
                    console.log('Fixing hydration error in element:', node.tagName);
                    node.removeAttribute('data-hydration-error');
                    node.classList.remove('hydration-error');
                    node.style.display = '';
                    setHasErrors(true);
                  }
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
          attributeFilter: ['data-hydration-error', 'class']
        });

        // Create a style element for hydration error fixes
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
          [data-hydration-error], .hydration-error {
            display: none !important;
          }
          .hydration-fixed {
            display: block !important;
          }
        `;
        document.head.appendChild(styleEl);

        // Auto-retry loading if errors are detected
        if (hasErrors) {
          const reloadTimer = setTimeout(() => {
            // Only reload if we're not in debug mode
            if (!window.location.search.includes('debug=true')) {
              window.location.reload();
            }
          }, 5000);

          return () => {
            clearTimeout(reloadTimer);
          };
        }
      }

      console.log('StaticSiteHandler: Static site fixes initialized');
    } catch (e) {
      console.error('StaticSiteHandler: Error initializing static site fixes', e);
    }
  }, [initialized, hasErrors]);

  // This component doesn't render anything
  return null;
}

export default StaticSiteHandler; 