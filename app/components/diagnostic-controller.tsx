"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * DiagnosticController provides enhanced error monitoring
 * specifically targeting React Error #130 (Objects as React children)
 * This component should be placed in the RootClient component
 */
export default function DiagnosticController() {
  const pathname = usePathname();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Store original console methods
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Create identifier for this page
    const pageId = Math.random().toString(36).substring(2, 9);
    
    // Function to enhance error messages
    const enhanceError = (error: any) => {
      const errorStr = String(error);
      
      // Only process React Error #130
      if (errorStr.includes('Minified React error #130') || 
          errorStr.includes('Objects are not valid as a React child')) {
        
        // Create detailed diagnostic report
        console.warn('📊 DIAGNOSTIC REPORT FOR REACT ERROR #130:');
        console.warn(`Page: ${pathname}`);
        console.warn(`Page ID: ${pageId}`);
        console.warn(`Time: ${new Date().toISOString()}`);
        console.warn(`URL: ${window.location.href}`);
        
        // Check for Next.js data
        if (window.__NEXT_DATA__) {
          try {
            console.warn('Next.js Data:', {
              buildId: window.__NEXT_DATA__.buildId,
              page: window.__NEXT_DATA__.page,
              isFallback: window.__NEXT_DATA__.isFallback,
              gssp: window.__NEXT_DATA__?.props?.pageProps?.__N_SSP,
              gsp: window.__NEXT_DATA__?.props?.pageProps?.__N_SSG,
            });
          } catch (e) {
            console.warn('Error accessing Next.js data');
          }
        }
        
        // Create more detailed stack trace
        try {
          throw new Error('Diagnostic stack trace for React Error #130');
        } catch (e: any) {
          console.warn('Diagnostic stack trace:', e.stack);
        }
        
        // Add visual indicator to the DOM
        try {
          const indicator = document.createElement('div');
          indicator.style.position = 'fixed';
          indicator.style.bottom = '10px';
          indicator.style.right = '10px';
          indicator.style.background = 'rgba(200, 0, 0, 0.8)';
          indicator.style.color = 'white';
          indicator.style.padding = '5px 10px';
          indicator.style.borderRadius = '4px';
          indicator.style.zIndex = '9999';
          indicator.style.fontSize = '12px';
          indicator.style.fontFamily = 'monospace';
          indicator.textContent = `⚠️ React Error #130 detected (ID: ${pageId})`;
          document.body.appendChild(indicator);
        } catch (e) {
          // Ignore if can't add indicator
        }
        
        // Log suggestions for fixing the error
        console.warn('Suggested fix approaches:');
        console.warn('1. Find object being directly rendered in JSX');
        console.warn('2. Check router objects (useRouter, useParams, useSearchParams)');
        console.warn('3. Wrap values with ensureString() or JSON.stringify()');
      }
    };
    
    // Override console.error to enhance error reporting
    console.error = function(...args) {
      // Process the first argument if it looks like an error
      if (args.length > 0 && typeof args[0] === 'string') {
        enhanceError(args[0]);
      }
      
      // Call original console.error with all arguments
      return originalError.apply(console, args);
    };
    
    return () => {
      // Restore original console methods
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, [pathname]);
  
  // This component doesn't render anything visible
  return null;
} 