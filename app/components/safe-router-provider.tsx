"use client";

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { createSafeParams, createSafeSearchParams } from '../lib/router-safety';

// Create context for safe router values
interface SafeRouterContextType {
  pathname: string;
  safeParams: Record<string, string>;
  safeSearchParams: Record<string, string>;
}

const SafeRouterContext = createContext<SafeRouterContextType>({
  pathname: '',
  safeParams: {},
  safeSearchParams: {}
});

// Hook to safely use router values
export const useSafeRouter = () => useContext(SafeRouterContext);

/**
 * Provider component that makes router values safe for rendering
 * Prevents React Error #130 by ensuring all values are strings
 */
export default function SafeRouterProvider({ 
  children,
  params = {} 
}: { 
  children: React.ReactNode,
  params?: Record<string, any>
}) {
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  
  // Create safe versions of router parameters
  const safeRouterValues = useMemo(() => {
    return {
      pathname,
      safeParams: createSafeParams(params),
      safeSearchParams: createSafeSearchParams(searchParams)
    };
  }, [pathname, params, searchParams]);
  
  return (
    <SafeRouterContext.Provider value={safeRouterValues}>
      {children}
    </SafeRouterContext.Provider>
  );
} 