"use client";

import { useEffect } from 'react';
import { usePathname, useRouter, useParams, useSearchParams } from 'next/navigation';
import { ensureString } from '@/lib/formatters';
import { useDebug } from './use-debug';

/**
 * Custom hook for debugging Next.js router issues
 * Helps identify instances where router objects might be causing Error #130
 */
export function useRouterDebug() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isDebugMode } = useDebug();

  useEffect(() => {
    if (!isDebugMode) return;

    // Log router state on initial load and route changes
    console.log('[RouterDebug] Current router state:', {
      pathname: ensureString(pathname),
      params: params ? JSON.stringify(params) : null,
      searchParams: searchParams ? Object.fromEntries(searchParams.entries()) : null
    });

    // Set up error listener for detecting router-related errors
    const originalErrorFn = console.error;
    console.error = (...args) => {
      const errorMsg = args[0]?.toString() || '';
      
      // Specifically check for Error #130 and router-related issues
      if (errorMsg.includes('Minified React error #130') || 
          errorMsg.includes('Objects are not valid as a React child')) {
        console.warn('[RouterDebug] DETECTED REACT ERROR #130');
        console.warn('Current path:', ensureString(pathname));
        console.warn('Current component stack:', new Error().stack);
        
        // If there are any React components that use router values, this can help identify them
        console.warn('Router values that might be causing the error:');
        console.table({
          pathname: { 
            type: typeof pathname,
            value: ensureString(pathname),
            safe: typeof pathname === 'string'
          },
          params: { 
            type: typeof params, 
            value: params ? JSON.stringify(params) : 'null',
            safe: params === null || typeof params !== 'object'
          },
          searchParams: { 
            type: typeof searchParams, 
            value: searchParams ? '[SearchParams Object]' : 'null',
            safe: searchParams === null || typeof searchParams !== 'object' || searchParams instanceof URLSearchParams
          }
        });
      }
      
      // Look for specific router errors
      if (errorMsg.includes('isNextRouterError') || 
          errorMsg.includes('next/router') ||
          errorMsg.includes('useRouter')) {
        console.warn('[RouterDebug] DETECTED NEXT.JS ROUTER ERROR');
        console.warn('Stack trace:', new Error().stack);
      }
      
      // Call original console.error
      originalErrorFn.apply(console, args);
    };
    
    return () => {
      // Restore original console.error on cleanup
      console.error = originalErrorFn;
    };
  }, [pathname, params, searchParams, isDebugMode]);

  // Return router values that have been safely converted to strings
  return {
    safePathname: ensureString(pathname),
    safeParams: params ? JSON.stringify(params) : null,
    safeSearchParams: searchParams ? JSON.stringify(Object.fromEntries(searchParams.entries())) : null,
    isRouterAvailable: !!router
  };
} 