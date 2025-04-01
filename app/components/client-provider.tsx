"use client"

import React, { useState, useEffect, ReactNode } from 'react'
import SafeRouterProvider from './safe-router-provider'
import ErrorBoundary from './error-boundary'
import { LanguageProvider } from './language-switcher'
import '../../lib/i18n'

interface ClientProviderProps {
  children: ReactNode;
}

/**
 * Enhanced ClientProvider that wraps the application with safety utilities
 * Includes hydration safety and router object protection
 */
export default function ClientProvider({ children }: ClientProviderProps) {
  // Track hydration state to prevent hydration mismatches
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Mark as hydrated after initial render
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Add diagnostics in development mode
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // Check for common issues that could cause React Error #130
      const diagnoseRouterIssues = () => {
        console.log('[ClientProvider] Running router diagnostic checks...');
        
        // Check for global window.__NEXT_DATA__ issues
        if (window.__NEXT_DATA__) {
          console.log('[ClientProvider] Next.js data available:', {
            page: window.__NEXT_DATA__.page,
            buildId: window.__NEXT_DATA__.buildId,
          });
        }
      };
      
      diagnoseRouterIssues();
    }
  }, []);

  return (
    <ErrorBoundary componentName="ClientProvider">
      {/* Wrap with SafeRouterProvider to prevent router-related Error #130 */}
      <SafeRouterProvider>
        {/* Use a key to force remount after hydration - this can help with hydration mismatches */}
        <div key={isHydrated ? 'hydrated' : 'server'} suppressHydrationWarning>
          {/* Hide children until hydrated or render with suppressHydrationWarning */}
          {(isHydrated || typeof window === 'undefined') ? (
            <LanguageProvider>
              {children}
            </LanguageProvider>
          ) : (
            <div suppressHydrationWarning>
              {/* Placeholder during hydration */}
              <div style={{ visibility: 'hidden' }}>
                <LanguageProvider>
                  {children}
                </LanguageProvider>
              </div>
            </div>
          )}
        </div>
      </SafeRouterProvider>
    </ErrorBoundary>
  );
} 