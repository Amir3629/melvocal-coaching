'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Enhanced global error page with debugging capabilities
 */
export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errorDetails, setErrorDetails] = useState<{
    message: string;
    stack?: string;
    isHydrationError: boolean;
  }>({
    message: error?.message || 'Unknown error occurred',
    stack: error?.stack,
    isHydrationError: false,
  });

  // Check if this is a hydration error
  useEffect(() => {
    try {
      const message = error?.message || '';
      const isHydrationError = 
        message.includes('Hydration') || 
        message.includes('content does not match') ||
        message.includes('Text content does not match server-rendered HTML');
      
      // Look for error message in DOM if no error was passed
      if (!error && typeof document !== 'undefined') {
        const errorElements = document.querySelectorAll('[data-hydration-error]');
        if (errorElements.length > 0) {
          setErrorDetails({
            message: 'Hydration error detected in the DOM',
            isHydrationError: true,
          });
        }
      }
      
      if (isHydrationError) {
        setErrorDetails(prev => ({
          ...prev,
          isHydrationError,
        }));
        
        // Save error info to localStorage for debugging
        if (typeof localStorage !== 'undefined') {
          const errors = JSON.parse(localStorage.getItem('melvocal-errors') || '[]');
          errors.push({
            timestamp: new Date().toISOString(),
            message: error?.message || 'Hydration error',
            stack: error?.stack,
            url: window.location.href
          });
          localStorage.setItem('melvocal-errors', JSON.stringify(errors));
        }
      }
    } catch (e) {
      console.error('Error analyzing error:', e);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="max-w-2xl px-4">
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong</h1>
        
        <p className="mb-6 text-gray-400">
          We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
        </p>

        {errorDetails.isHydrationError && (
          <div className="mb-6 p-4 bg-yellow-900 bg-opacity-20 rounded">
            <p className="text-yellow-400 font-medium">This appears to be a static rendering issue.</p>
            <p className="mt-2 text-sm">Try refreshing the page or clearing your browser cache.</p>
          </div>
        )}
        
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-center">
          <button
            onClick={() => {
              // Clear any cached data that might be causing issues
              if (typeof localStorage !== 'undefined') {
                // Don't remove error logs
                const errorLogs = localStorage.getItem('melvocal-errors');
                localStorage.clear();
                if (errorLogs) localStorage.setItem('melvocal-errors', errorLogs);
              }
              
              // Then reset the error boundary
              reset();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Try again
          </button>
          
          <Link href="/" className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
            Go to homepage
          </Link>

          <Link href="/?debug=true" className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition text-sm">
            Debug Mode
          </Link>
        </div>
        
        {process.env.NODE_ENV !== 'production' && (
          <div className="mt-8 text-left p-4 bg-gray-800 rounded overflow-auto max-h-60">
            <p className="font-mono text-sm text-red-400">{errorDetails.message}</p>
            {errorDetails.stack && (
              <pre className="mt-2 font-mono text-xs text-gray-400 whitespace-pre-wrap">
                {errorDetails.stack}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 