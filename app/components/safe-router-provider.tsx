"use client";

import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import { ensureString } from '@/lib/formatters';
import { createSafeParams, createSafeSearchParams } from '@/lib/router-safety';

// Define the shape of our safe router context
interface SafeRouterContextType {
  pathname: string;
  params: Record<string, string>;
  searchParams: Record<string, string>;
  navigate: (path: string) => void;
  isNavigating: boolean;
}

// Create the context with a default value
const SafeRouterContext = createContext<SafeRouterContextType>({
  pathname: '',
  params: {},
  searchParams: {},
  navigate: () => {},
  isNavigating: false,
});

// Hook to use our safe router
export const useSafeRouter = () => useContext(SafeRouterContext);

/**
 * SafeRouterProvider wraps components with a type-safe router context
 * This prevents React Error #130 by ensuring all router values are safe strings
 */
export default function SafeRouterProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Create safe versions of all router values
  const safeRouterValues = useMemo(() => {
    return {
      // Ensure pathname is always a string
      pathname: ensureString(pathname),
      
      // Convert params to a safe record of strings
      params: createSafeParams(params),
      
      // Convert search params to a safe record of strings
      searchParams: createSafeSearchParams(searchParams),
      
      // Safe navigation function
      navigate: (path: string) => {
        if (typeof path === 'string' && path) {
          router.push(path);
        }
      },
      
      // Navigation state (placeholder - could be implemented with state)
      isNavigating: false,
    };
  }, [pathname, params, searchParams, router]);
  
  return (
    <SafeRouterContext.Provider value={safeRouterValues}>
      {children}
    </SafeRouterContext.Provider>
  );
} 