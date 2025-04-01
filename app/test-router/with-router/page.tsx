"use client";

import React from 'react';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import ErrorBoundary from '../../components/error-boundary';
import { useDebug } from '../../../hooks/use-debug';
import { useRouterDebug } from '../../../hooks/use-router-debug';
import { ensureString } from '../../../lib/formatters';
import { createSafeParams, createSafeSearchParams } from '../../../lib/router-safety';

/**
 * Test page that explicitly uses router objects
 * This page helps identify router-related issues by intentionally
 * using router objects in different ways (safe vs. unsafe)
 */
export default function RouterTestWithRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isDebugMode } = useDebug();
  const { safePathname, safeParams } = useRouterDebug();
  
  // Explicitly create safe versions of router values
  const safeRouterParams = createSafeParams(params);
  const safeRouterSearchParams = createSafeSearchParams(searchParams);
  
  return (
    <ErrorBoundary componentName="RouterTestWithRouter">
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Router Test (With Router Objects)</h1>
        
        <div className="bg-black/10 p-4 rounded mb-4">
          <h2 className="text-xl mb-2">Test Status</h2>
          <p>
            This page intentionally uses router objects in both safe and unsafe ways.
            If you see this page without errors, the router objects are being handled properly.
          </p>
        </div>
        
        <div className="bg-black/10 p-4 rounded mb-4">
          <h2 className="text-xl mb-2">Safe Router Values</h2>
          <div className="space-y-2">
            <p>Pathname (safe): <span className="font-mono">{ensureString(pathname)}</span></p>
            <p>SearchParams (safe): <span className="font-mono">{JSON.stringify(safeRouterSearchParams)}</span></p>
          </div>
        </div>
        
        {/* Debugging section that's only visible in debug mode */}
        {isDebugMode && (
          <div className="bg-red-900/10 border border-red-500/30 p-4 rounded mt-8">
            <h2 className="text-xl mb-2 text-red-500">Debug: Unsafe Router Values</h2>
            <p className="text-sm text-red-400 mb-4">
              Warning: This section intentionally uses potentially unsafe router values
              to help diagnose Error #130. These may cause errors in the browser.
            </p>
            
            <ErrorBoundary componentName="UnsafeRouterTest">
              <div className="space-y-2">
                <p>Pathname (direct): <span className="font-mono">{pathname}</span></p>
                {/* Intentionally unsafe - may cause Error #130 */}
                <p>Params (direct - unsafe): <span className="font-mono">{params}</span></p>
                {/* Intentionally unsafe - may cause Error #130 */}
                <p>SearchParams (direct - unsafe): <span className="font-mono">{searchParams}</span></p>
              </div>
            </ErrorBoundary>
          </div>
        )}
        
        <div className="mt-8">
          <p data-testid="version-check" data-version="v1.4.0-error130-router-test">
            Version: v1.4.0-error130-router-test
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
} 