"use client";

import React from 'react';
import ErrorBoundary from '../components/error-boundary';
import { useDebug } from '@/hooks/use-debug';

/**
 * Test page for isolating router-related issues
 * This page intentionally avoids using router objects directly
 */
export default function RouterTest() {
  const { isDebugMode } = useDebug();
  
  return (
    <ErrorBoundary componentName="RouterTest">
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Router Isolation Test</h1>
        
        <div className="bg-black/10 p-4 rounded mb-4">
          <h2 className="text-xl mb-2">Test Status</h2>
          <p>
            If you can see this page without errors, the basic page rendering is working.
            This page intentionally doesn't use any router objects directly.
          </p>
        </div>
        
        <div className="bg-black/10 p-4 rounded mb-4">
          <h2 className="text-xl mb-2">Environment Info</h2>
          <pre className="bg-black/5 p-2 rounded text-xs">
            {JSON.stringify({
              timestamp: new Date().toISOString(),
              jsEnvironment: typeof window !== 'undefined' ? 'client' : 'server',
              userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
              debugMode: isDebugMode
            }, null, 2)}
          </pre>
        </div>
        
        <div>
          <p data-testid="version-check" data-version="v1.4.0-error130-isolation-test">
            Version: v1.4.0-error130-isolation-test
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
} 