"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname, useParams, useSearchParams } from 'next/navigation';
import { ensureString } from '@/lib/formatters';

/**
 * GitHub Pages specific entry component
 * Helps diagnose and fix deployment issues with GitHub Pages
 */
export default function GitHubPagesEntry() {
  const [status, setStatus] = useState<'loading' | 'error' | 'ready'>('loading');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  
  // Safely capture router state
  const safePathname = ensureString(pathname);
  
  useEffect(() => {
    // Check if we're in a GitHub Pages environment
    const isGitHubPages = typeof window !== 'undefined' && 
      (window.location.hostname.includes('github.io') || 
       window.location.pathname.includes('/melvocal-coaching'));
    
    if (!isGitHubPages) {
      setStatus('ready');
      return;
    }
    
    try {
      // GitHub Pages specific diagnostics
      console.log('[GitHubPages] Environment detected - running diagnostics');
      
      // Check for specific basePath issues
      if (typeof window !== 'undefined') {
        console.log('[GitHubPages] Path information:', {
          pathname: safePathname,
          location: window.location.pathname,
          href: window.location.href,
          basePath: '/melvocal-coaching'
        });
      }
      
      // Register global error handler to catch React Error #130
      const originalError = console.error;
      console.error = function(...args) {
        // Check for React Error #130
        if (args[0] && typeof args[0] === 'string' && 
           (args[0].includes('Minified React error #130') || 
            args[0].includes('Objects are not valid as a React child'))) {
          
          // Add GitHub Pages specific context
          console.warn('[GitHubPages] React Error #130 detected in GitHub Pages environment');
          console.warn('[GitHubPages] This is likely due to router initialization issues');
          
          // Update component state with error
          setStatus('error');
          setErrorDetails('React Error #130 detected - possible router initialization issue');
        }
        
        // Call original error function
        return originalError.apply(console, args);
      };
      
      // Set ready after diagnostics
      setStatus('ready');
      
      return () => {
        // Restore original console.error
        console.error = originalError;
      };
    } catch (err) {
      setStatus('error');
      setErrorDetails(err instanceof Error ? err.message : String(err));
    }
  }, [safePathname]);
  
  // Status indicator visible only in development
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div 
        style={{ 
          position: 'fixed', 
          bottom: '5px', 
          left: '5px', 
          zIndex: 9999,
          background: status === 'error' ? 'rgba(200,0,0,0.8)' : 'rgba(0,100,0,0.8)',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
          pointerEvents: 'none',
          opacity: 0.9
        }}
      >
        {status === 'loading' && 'Initializing GitHub Pages environment...'}
        {status === 'error' && `GitHub Pages error: ${errorDetails}`}
        {status === 'ready' && 'GitHub Pages environment ready'}
      </div>
    );
  }
  
  // In production, render nothing
  return null;
} 