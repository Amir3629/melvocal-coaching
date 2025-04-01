"use client";

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useDebug } from '../hooks/use-debug';
import { isRouterObject, warnIfRouterObject } from '../lib/router-safety';

/**
 * Router debug component
 * Monitors router usage and logs potential issues
 */
export default function RouterDebug() {
  const { isDebugMode } = useDebug();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasRouterIssue, setHasRouterIssue] = useState(false);
  
  // Monitor router changes for debugging
  useEffect(() => {
    if (!isDebugMode) return;
    
    console.log('[RouterDebug] Route changed:', {
      pathname,
      searchParams: Object.fromEntries(searchParams?.entries() || [])
    });
    
    // Check for router-related issues in window.__NEXT_DATA__
    const checkForRouterIssues = () => {
      try {
        // Look for Next.js router data in the global object
        const nextData = (window as any).__NEXT_DATA__;
        if (!nextData) return;
        
        // Check for any props that might contain router objects directly
        const props = nextData.props?.pageProps;
        if (props) {
          Object.entries(props).forEach(([key, value]) => {
            if (isRouterObject(value)) {
              console.warn(
                `[RouterDebug] WARNING: Found router object in pageProps.${key}. ` +
                `This may cause React Error #130 if rendered directly.`
              );
              setHasRouterIssue(true);
            }
          });
        }
      } catch (err) {
        console.error('[RouterDebug] Error checking for router issues:', err);
      }
    };
    
    // Run check after page loads
    const timer = setTimeout(checkForRouterIssues, 500);
    return () => clearTimeout(timer);
  }, [isDebugMode, pathname, searchParams]);
  
  // Only render in debug mode and only if there's an issue
  if (!isDebugMode || !hasRouterIssue) return null;
  
  return (
    <div 
      className="fixed top-20 right-0 m-4 p-3 bg-red-900/90 text-white rounded shadow-lg z-[9999] text-xs font-mono"
      data-testid="router-debug"
    >
      <h3 className="font-bold mb-1">Router Issue Detected</h3>
      <p>Potential React Error #130 source!</p>
      <p className="text-red-300 mt-1">Check console for details.</p>
    </div>
  );
} 