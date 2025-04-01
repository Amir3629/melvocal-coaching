'use client';

import React, { useEffect, useState } from 'react';
import { useSafeSearchParams } from '../lib/router-safety';

// Extend the Performance interface to include memory
interface ExtendedPerformance extends Performance {
  memory?: {
    totalJSHeapSize: number;
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

/**
 * RuntimeMonitor component that can be added to the site to help diagnose issues in production
 * It's only shown when ?debug=true is added to the URL
 */
export function RuntimeMonitor() {
  const { params, isReady, error: searchParamsError } = useSafeSearchParams();
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

  // Helper function to save error to localStorage
  const saveErrorToStorage = (error: any) => {
    try {
      if (typeof window === 'undefined') return;
      
      // Get existing errors
      const storedErrors = localStorage.getItem('melvocal-errors') || '[]';
      const errorList = JSON.parse(storedErrors);
      
      // Add new error with timestamp
      errorList.push({
        timestamp: new Date().toISOString(),
        message: error.message || String(error),
        stack: error.stack,
        url: window.location.href
      });
      
      // Keep only last 50 errors to avoid storage limits
      if (errorList.length > 50) {
        errorList.shift();
      }
      
      // Save back to localStorage
      localStorage.setItem('melvocal-errors', JSON.stringify(errorList));
    } catch (e) {
      console.error('Failed to save error to localStorage', e);
    }
  };

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
          saveErrorToStorage(e);
        }
      }

      // Get memory usage if available
      let memoryUsage = null;
      if (typeof performance !== 'undefined') {
        const extendedPerformance = performance as ExtendedPerformance;
        if (extendedPerformance.memory) {
          memoryUsage = {
            totalJSHeapSize: extendedPerformance.memory.totalJSHeapSize,
            usedJSHeapSize: extendedPerformance.memory.usedJSHeapSize,
            jsHeapSizeLimit: extendedPerformance.memory.jsHeapSizeLimit,
          };
        }
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
        const errorInfo = {
          time: new Date().toISOString(),
          message: `${event.message} (${event.filename}:${event.lineno}:${event.colno})`,
        };
        
        setRuntimeInfo((prev) => ({
          ...prev,
          errors: [
            ...prev.errors,
            errorInfo
          ],
        }));
        
        // Save to localStorage for later analysis
        saveErrorToStorage({
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      };

      // Listen for unhandled rejections
      const handleRejection = (event: PromiseRejectionEvent) => {
        const errorInfo = {
          time: new Date().toISOString(),
          message: `Unhandled rejection: ${event.reason?.message || String(event.reason)}`,
        };
        
        setRuntimeInfo((prev) => ({
          ...prev,
          errors: [
            ...prev.errors,
            errorInfo
          ],
        }));
        
        // Save to localStorage for later analysis
        saveErrorToStorage({
          message: `Unhandled rejection: ${event.reason?.message || String(event.reason)}`,
          stack: event.reason?.stack
        });
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleRejection);

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleRejection);
      };
    } catch (e) {
      console.error('Error setting up runtime monitor:', e);
      saveErrorToStorage(e);
    }
  }, [isVisible]);
  
  // Load stored errors
  const [storedErrors, setStoredErrors] = useState<any[]>([]);
  
  useEffect(() => {
    if (!isVisible) return;
    
    try {
      const errors = localStorage.getItem('melvocal-errors');
      if (errors) {
        setStoredErrors(JSON.parse(errors));
      }
    } catch (e) {
      console.error('Failed to load stored errors:', e);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 p-4 bg-black bg-opacity-90 text-white font-mono text-xs max-w-full overflow-auto max-h-80">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Runtime Debug Info</h3>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const errors = localStorage.getItem('melvocal-errors') || '[]';
              const blob = new Blob([errors], {type: 'application/json'});
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'melvocal-errors.json';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className="px-2 py-1 bg-blue-800 hover:bg-blue-700 rounded"
          >
            Download Logs
          </button>
          <button 
            onClick={() => setIsVisible(false)} 
            className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded"
          >
            Close
          </button>
        </div>
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

        {searchParamsError && (
          <>
            <div className="text-red-400">Router Error:</div>
            <div className="text-red-400">{searchParamsError.message}</div>
          </>
        )}
      </div>

      {runtimeInfo.errors.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold text-red-400 mb-1">Current Session Errors:</h4>
          <ul className="bg-red-900 bg-opacity-30 p-2 rounded">
            {runtimeInfo.errors.map((err, i) => (
              <li key={i} className="mb-1">
                <span className="text-gray-400">{err.time.substring(11, 19)}</span> {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {storedErrors.length > 0 && (
        <div className="mt-4">
          <h4 className="font-bold text-yellow-400 mb-1">Stored Errors ({storedErrors.length}):</h4>
          <ul className="bg-yellow-900 bg-opacity-30 p-2 rounded">
            {storedErrors.slice(0, 5).map((err, i) => (
              <li key={i} className="mb-1">
                <span className="text-gray-400">{err.timestamp?.substring(11, 19) || 'Unknown'}</span> {err.message}
              </li>
            ))}
            {storedErrors.length > 5 && <li>... and {storedErrors.length - 5} more</li>}
          </ul>
          <button 
            onClick={() => {
              try {
                localStorage.removeItem('melvocal-errors');
                setStoredErrors([]);
              } catch (e) {
                console.error('Failed to clear stored errors:', e);
              }
            }}
            className="mt-2 px-2 py-1 bg-red-800 hover:bg-red-700 rounded"
          >
            Clear Stored Errors
          </button>
        </div>
      )}
    </div>
  );
}

export default RuntimeMonitor; 