"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter, useParams, useSearchParams } from 'next/navigation';
import { ensureString } from '@/lib/formatters';
import { useDebug } from '@/hooks/use-debug';

/**
 * Router debug component that monitors router-related errors
 * Designed to catch instances where router objects might be directly rendered
 */
export default function RouterDebug() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isDebugMode } = useDebug();

  useEffect(() => {
    if (!isDebugMode) return;

    // Log router information for debugging
    console.log('[RouterDebug] Router state:', {
      pathname: ensureString(pathname),
      params: params ? JSON.stringify(params) : null,
      searchParams: searchParams ? Object.fromEntries(searchParams.entries()) : null
    });

    // Add a global error handler to catch router errors
    const originalErrorFn = console.error;
    console.error = (...args) => {
      const errorMsg = args[0]?.toString() || '';
      
      // Check specifically for Error #130 and log detailed debugging info
      if (errorMsg.includes('Minified React error #130') || 
          errorMsg.includes('Objects are not valid as a React child')) {
        console.warn('[RouterDebug] DETECTED REACT ERROR #130');
        console.warn('This error often occurs when an object is used where only a primitive value is allowed');
        console.warn('Current path:', ensureString(pathname));
        console.warn('Params:', params ? JSON.stringify(params) : null);
        console.warn('Current component stack:', new Error().stack);
      }
      
      // Check specifically for router errors
      if (errorMsg.includes('isNextRouterError') || 
          errorMsg.includes('next/router')) {
        console.warn('[RouterDebug] DETECTED NEXT.JS ROUTER ERROR');
        console.warn('Router state:', {
          pathname: ensureString(pathname),
          params: params ? JSON.stringify(params) : null,
        });
      }
      
      // Call the original console.error function
      originalErrorFn.apply(console, args);
    };
    
    return () => {
      // Restore original console.error when component unmounts
      console.error = originalErrorFn;
    };
  }, [pathname, params, searchParams, isDebugMode]);
  
  // Hidden dev-mode tag to verify deployment version
  return isDebugMode ? (
    <div 
      data-testid="router-debug" 
      hidden 
      suppressHydrationWarning
      data-version="v1.4.0-error130-fix"
    />
  ) : null;
} 