'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Enhanced error page that provides a better user experience
 * when an error occurs in the application
 */
export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  // Log the error to console for debugging
  useEffect(() => {
    console.error('Application error:', error)
    
    // You could also log to an error tracking service here
    // sendToErrorTracking(error)
  }, [error])
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="mx-auto max-w-md text-center px-4">
        <h1 className="text-3xl font-cormorant font-bold mb-4 text-gold">Oops! Something went wrong</h1>
        
        <div className="mb-6">
          <p className="mb-4">
            We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
          </p>
          
          {process.env.NODE_ENV !== 'production' && error.message && (
            <div className="mt-4 p-4 bg-red-900 bg-opacity-20 rounded-md text-left text-sm">
              <p className="font-semibold text-red-400 mb-1">Error details:</p>
              <p className="font-mono">{error.message}</p>
              {error.digest && (
                <p className="text-xs mt-2 text-gray-400">Error ID: {error.digest}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-2 bg-gold hover:bg-gold/80 text-black font-medium rounded transition-colors"
          >
            Try again
          </button>
          
          <Link
            href="/"
            className="px-6 py-2 border border-gold/50 hover:border-gold text-gold hover:text-white rounded transition-colors"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  )
} 