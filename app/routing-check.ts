'use client'

/**
 * Simple router safety utility without external dependencies
 * Used to ensure router values are properly stringified
 */

/**
 * Ensures a value is a string
 */
export function ensureRouterString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  // For objects and arrays, use JSON.stringify with a try/catch
  try {
    return JSON.stringify(value);
  } catch (err) {
    console.error('Failed to stringify router value:', err);
    return '[Object]';
  }
}

/**
 * Creates a safe version of params object
 */
export function createSafeRouterParams(params: Record<string, any> | null | undefined): Record<string, string> {
  if (!params) return {};
  
  const safeParams: Record<string, string> = {};
  Object.entries(params).forEach(([key, value]) => {
    safeParams[key] = ensureRouterString(value);
  });
  
  return safeParams;
}

/**
 * Safely converts search params to a record
 */
export function createSafeSearchParams(searchParams: URLSearchParams | null | undefined): Record<string, string> {
  if (!searchParams) return {};
  
  const safeSearchParams: Record<string, string> = {};
  
  if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((value, key) => {
      safeSearchParams[key] = ensureRouterString(value);
    });
  }
  
  return safeSearchParams;
} 