"use client";

import { ensureString } from './formatters';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Utility functions for safely using the Next.js Router
 * to prevent React Error #130 (Objects are not valid as React child)
 */

/**
 * Creates a safe version of Next.js router query parameters
 * Ensures all values are properly converted to strings
 */
export function createSafeParams(params: Record<string, any> | null | undefined): Record<string, string> {
  if (!params) return {};
  
  const safeParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    // Handle arrays (like catch-all routes)
    if (Array.isArray(value)) {
      safeParams[key] = value.map(item => ensureString(item)).join(',');
    } else {
      safeParams[key] = ensureString(value);
    }
  });
  
  return safeParams;
}

/**
 * Creates a safe version of Next.js search params
 * Ensures all values are properly converted to strings
 */
export function createSafeSearchParams(
  searchParams: URLSearchParams | null | undefined
): Record<string, string> {
  if (!searchParams) return {};
  
  const safeSearchParams: Record<string, string> = {};
  
  // Convert URLSearchParams to safe object
  if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((value, key) => {
      safeSearchParams[key] = ensureString(value);
    });
  }
  
  return safeSearchParams;
}

/**
 * Checks if a value is a router object
 * Useful for detecting potentially unsafe usage in components
 */
export function isRouterObject(value: any): boolean {
  if (!value || typeof value !== 'object') return false;
  
  // Common properties found in Next.js router objects
  const routerProperties = [
    'pathname', 
    'route', 
    'query', 
    'asPath', 
    'push', 
    'replace', 
    'reload'
  ];
  
  // Check if the object has multiple router-like properties
  const matchingProps = routerProperties.filter(prop => prop in value);
  return matchingProps.length >= 3; // If it has 3+ router properties, it's likely a router
}

/**
 * Logs a warning if a component prop might be a router object
 * Use during development to catch potential Error #130 sources
 */
export function warnIfRouterObject(props: Record<string, any>, componentName: string): void {
  if (process.env.NODE_ENV === 'production') return;
  
  Object.entries(props).forEach(([key, value]) => {
    if (isRouterObject(value)) {
      console.warn(
        `[RouterSafety] Warning: Component "${componentName}" received a router object ` +
        `for prop "${key}". This can cause React Error #130.\n` +
        `Use individual properties from the router instead of passing the entire object.`
      );
    }
  });
}

/**
 * Safely gets a route parameter, accounting for static generation
 * where useParams() might not be available yet
 */
export function safelyGetParam(key: string): string | null {
  try {
    // Using try/catch because useParams might not be available
    // during static generation
    const params = useParams();
    if (!params) return null;
    
    const value = params[key];
    return value ? (Array.isArray(value) ? value[0] : value) : null;
  } catch (e) {
    console.warn(`Error getting param ${key}:`, e);
    return null;
  }
}

/**
 * Safely gets a query parameter, accounting for static generation
 * where useSearchParams() might not be available yet
 */
export function safelyGetQueryParam(key: string): string | null {
  try {
    const searchParams = useSearchParams();
    if (!searchParams) return null;
    
    return searchParams.get(key);
  } catch (e) {
    console.warn(`Error getting query param ${key}:`, e);
    return null;
  }
}

/**
 * Hook for safely using searchParams in a static export environment
 * This prevents the common "useSearchParams should be wrapped in Suspense" error
 */
export function useSafeSearchParams() {
  const [params, setParams] = useState<Record<string, string>>({});
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Only run in browser
      if (typeof window === 'undefined') return;

      // Parse URL search params directly from window.location
      const urlSearchParams = new URLSearchParams(window.location.search);
      const searchParamsObj = createSafeSearchParams(urlSearchParams);
      
      setParams(searchParamsObj);
      setIsReady(true);

      // Listen for URL changes
      const handleRouteChange = () => {
        try {
          const newSearchParams = new URLSearchParams(window.location.search);
          setParams(createSafeSearchParams(newSearchParams));
        } catch (e) {
          console.error('Error updating search params:', e);
          if (e instanceof Error) setError(e);
        }
      };

      // Add event listeners for URL changes
      window.addEventListener('popstate', handleRouteChange);
      window.addEventListener('route-change', handleRouteChange);

      return () => {
        window.removeEventListener('popstate', handleRouteChange);
        window.removeEventListener('route-change', handleRouteChange);
      };
    } catch (e) {
      console.error('Error in useSafeSearchParams:', e);
      if (e instanceof Error) setError(e);
    }
  }, []);

  return { params, isReady, error };
}

/**
 * Hook for validating router params with type safety
 */
export function useValidatedParams<T extends Record<string, string>>(
  validator: (params: Record<string, string | string[]>) => T | null
): { params: T | null, isLoading: boolean } {
  const [validatedParams, setValidatedParams] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  try {
    const params = useParams();
    
    useEffect(() => {
      if (params) {
        const validated = validator(params);
        setValidatedParams(validated);
        setIsLoading(false);
      }
    }, [params, validator]);
    
    return { params: validatedParams, isLoading };
  } catch (e) {
    // During static generation, useParams might throw
    return { params: null, isLoading: true };
  }
} 