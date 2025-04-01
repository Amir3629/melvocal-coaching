"use client";

import { ensureString } from './formatters';

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
  for (const [key, value] of searchParams.entries()) {
    safeSearchParams[key] = ensureString(value);
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