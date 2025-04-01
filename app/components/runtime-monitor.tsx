'use client';

import React, { useEffect, useState } from 'react';
import { useSafeSearchParams } from '../lib/router-safety';

/**
 * RuntimeMonitor component that can be added to the site to help diagnose issues in production
 * It's only shown when ?debug=true is added to the URL
 */
export function RuntimeMonitor() {
  const { params, isReady, error } = useSafeSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const [runtimeInfo, setRuntimeInfo] = useState<{
    environment: string;
    nextVersion: string | null;
    buildId: string | null;
    errors: Array<{ time: string; message: string }>;
    hydrationStatus: 'pending' | 'complete' | 'failed';
    loadedModules: string[];
    memoryUsage: any;
  }>({
    environment: process.env.NODE_ENV || 'unknown',
    nextVersion: null,
    buildId: null,
    errors: [],
    hydrationStatus: 'pending',
    loadedModules: [],
    memoryUsage: null,
  });

  // Only show when debug=true is in the URL
  useEffect(() => {
    if (isReady && params.debug === 'true') {
      setIsVisible(true);
    }
  }, [isReady, params]);

  // Collect runtime information
  useEffect(() => {
    if (!isVisible) return;

    try {
      // Check if Next.js data is available
      const nextData = document.getElementById('__NEXT_DATA__');
      let buildId: string | null = null;
      let nextVersion: string | null = null;

      if (nextData && nextData.textContent) {
        try {
          const data = JSON.parse(nextData.textContent);
          buildId = data.buildId || null;
          nextVersion = data.version || null;
        } catch (e) {
          console.error('Failed to parse Next.js data:', e);
        }
      }

      // Get memory usage if available
      let memoryUsage = null;
      if (typeof performance !== 'undefined' && performance.memory) {
        memoryUsage = {
          totalJSHeapSize: (performance.memory as any).totalJSHeapSize,
          usedJSHeapSize: (performance.memory as any).usedJSHeapSize,
          jsHeapSizeLimit: (performance.memory as any).jsHeapSizeLimit,
        };
      }

      // Update runtime info
      setRuntimeInfo((prev) => ({
        ...prev,
        nextVersion,
        buildId,
        hydrationStatus: document.documentElement.dataset.hydrated === 'true' ? 'complete' : 'pending',
        loadedModules: Object.keys((window as any).__NEXT_LOADED_MODULES || {}),
        memoryUsage,
      }));

      // Listen for errors
      const handleError = (event: ErrorEvent) => {
        setRuntimeInfo((prev) => ({
          ...prev,
          errors: [
            ...prev.errors,
            {
              time: new Date().toISOString(),
              message: `${event.message} (${event.filename}:${event.lineno}:${event.colno})`,
            },
          ],
        }));
      };

      // Listen for unhandled rejections
      const handleRejection = (event: PromiseRejectionEvent) => {
        setRuntimeInfo((prev) => ({
          ...prev,
          errors: [
            ...prev.errors,
            {
              time: new Date().toISOString(),
              message: `Unhandled rejection: ${event.reason?.message || String(event.reason)}`,
            },
          ],
        }));
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleRejection);

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleRejection);
      };
    } catch (e) {
      console.error('Error setting up runtime monitor:', e);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 p-4 bg-black bg-opacity-90 text-white font-mono text-xs max-w-full overflow-auto max-h-80">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Runtime Debug Info</h3>
        <button 
          onClick={() => setIsVisible(false)} 
          className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <div>Environment:</div>
        <div>{runtimeInfo.environment}</div>

        <div>Next.js Version:</div>
        <div>{runtimeInfo.nextVersion || 'Unknown'}</div>

        <div>Build ID:</div>
        <div>{runtimeInfo.buildId || 'Unknown'}</div>

        <div>Hydration Status:</div>
        <div>{runtimeInfo.hydrationStatus}</div>

        <div>Modules Loaded:</div>
        <div>{runtimeInfo.loadedModules.length}</div>

        {runtimeInfo.memoryUsage && (
          <>
            <div>Memory Usage:</div>
            <div>{Math.round(runtimeInfo.memoryUsage.usedJSHeapSize / 1024 / 1024)} MB / {Math.round(runtimeInfo.memoryUsage.jsHeapSizeLimit / 1024 / 1024)} MB</div>
          </>
        )}

        {error && (
          <>
            <div className="text-red-400">Router Error:</div>
            <div className="text-red-400">{error.message}</div>
          </>
        )}
      </div>

      {runtimeInfo.errors.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold text-red-400 mb-1">Errors:</h4>
          <ul className="bg-red-900 bg-opacity-30 p-2 rounded">
            {runtimeInfo.errors.map((err, i) => (
              <li key={i} className="mb-1">
                <span className="text-gray-400">{err.time.substring(11, 19)}</span> {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RuntimeMonitor; 