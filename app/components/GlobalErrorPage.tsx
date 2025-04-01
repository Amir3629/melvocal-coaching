'use client'

import React from 'react'
import Link from 'next/link'

interface GlobalErrorPageProps {
  error?: Error
  reset?: () => void
}

/**
 * Global error page that displays when a critical error occurs
 * Used as a fallback for the root error boundary
 */
export default function GlobalErrorPage({ error, reset }: GlobalErrorPageProps) {
  // Capture additional information for debugging
  React.useEffect(() => {
    console.error('Global error caught:', error);
    
    // You can add real error tracking service integration here
    // Example: if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  }, [error]);

  const handleReset = () => {
    if (reset) {
      reset();
    } else {
      // Fallback to page reload if no reset function provided
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white p-4">
      <div className="max-w-lg w-full bg-[#1A1A1A] rounded-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-[#C8A97E] mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="mb-6 text-gray-300">
          We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[#C8A97E] text-black rounded hover:bg-[#D4AF37] transition-colors"
          >
            Try again
          </button>
          
          <Link href="/" className="px-4 py-2 border border-[#C8A97E] text-[#C8A97E] rounded hover:bg-[#C8A97E]/10 transition-colors text-center">
            Go to homepage
          </Link>
        </div>
        
        {process.env.NODE_ENV !== 'production' && error && (
          <details className="mt-8 p-4 bg-black/20 rounded text-xs">
            <summary className="cursor-pointer font-medium mb-2">
              Technical details (developers only)
            </summary>
            <pre className="overflow-auto whitespace-pre-wrap max-h-[200px] p-2 bg-black/30 rounded">
              {error.stack || error.message || 'Unknown error'}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
} 