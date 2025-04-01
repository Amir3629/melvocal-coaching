"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
      
      // Fix CSS resource paths if needed
      if (typeof document !== 'undefined') {
        // Find all CSS links with incorrect base path
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.includes('/vocal-coaching/')) {
            const correctedHref = href.replace('/vocal-coaching/', '/melvocal-coaching/');
            console.log(`[GitHubPages] Fixing CSS path: ${href} -> ${correctedHref}`);
            link.setAttribute('href', correctedHref);
          }
        });
        
        // Fix script paths
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
          const src = script.getAttribute('src');
          if (src && src.includes('/vocal-coaching/')) {
            const correctedSrc = src.replace('/vocal-coaching/', '/melvocal-coaching/');
            console.log(`[GitHubPages] Fixing JS path: ${src} -> ${correctedSrc}`);
            script.setAttribute('src', correctedSrc);
          }
        });
      }
      
      // Check for specific basePath issues
      if (typeof window !== 'undefined') {
        console.log('[GitHubPages] Path information:', {
          pathname: safePathname,
          location: window.location.pathname,
          href: window.location.href,
          basePath: '/melvocal-coaching'
        });
        
        // Add meta tags to help with proper caching
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', 'Cache-Control');
        meta.setAttribute('content', 'no-cache, no-store, must-revalidate');
        document.head.appendChild(meta);
        
        // Add detection for iOS devices
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          document.documentElement.classList.add('ios-device');
          console.log('[GitHubPages] iOS device detected, adding specific fixes');
        }
      }
      
      // Register global error handler to catch React Error #130
      const originalError = console.error;
      console.error = function(...args) {
        const errorMsg = args.join(' ');
        
        // Check for hydration errors
        if (errorMsg.includes('Hydration') || 
            errorMsg.includes('content does not match') ||
            errorMsg.includes('Minified React error #418') ||
            errorMsg.includes('Warning: Text content did not match') ||
            errorMsg.includes('Minified React error #423')) {
          
          console.warn('[GitHubPages] Hydration mismatch detected');
          
          // Save to localStorage for debugging
          try {
            const errors = JSON.parse(localStorage.getItem('melvocal-errors') || '[]');
            errors.push({
              timestamp: new Date().toISOString(),
              type: 'hydration',
              message: errorMsg.slice(0, 500),
              url: window.location.href
            });
            localStorage.setItem('melvocal-errors', JSON.stringify(errors));
          } catch (e) {
            // Silently fail
          }
        }
        
        // Check for React Error #130
        if (errorMsg.includes('Minified React error #130') || 
            errorMsg.includes('Objects are not valid as a React child')) {
          
          // Add GitHub Pages specific context
          console.warn('[GitHubPages] React Error #130 detected in GitHub Pages environment');
          console.warn('[GitHubPages] This is likely due to router initialization issues');
          
          // Save to localStorage for debugging
          try {
            const errors = JSON.parse(localStorage.getItem('melvocal-errors') || '[]');
            errors.push({
              timestamp: new Date().toISOString(),
              type: 'error130',
              message: errorMsg.slice(0, 500),
              url: window.location.href
            });
            localStorage.setItem('melvocal-errors', JSON.stringify(errors));
          } catch (e) {
            // Silently fail
          }
          
          // Update component state with error
          setStatus('error');
          setErrorDetails('React Error #130 detected - router initialization issue');
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
      
      // Save errors to localStorage
      try {
        const errors = JSON.parse(localStorage.getItem('melvocal-errors') || '[]');
        errors.push({
          timestamp: new Date().toISOString(),
          type: 'githubPagesEntry',
          message: err instanceof Error ? err.message : String(err),
          url: window.location.href
        });
        localStorage.setItem('melvocal-errors', JSON.stringify(errors));
      } catch (e) {
        // Silently fail
      }
    }
  }, [safePathname]);
  
  // Status indicator visible only in development or when debug=true is in URL
  const showDebug = process.env.NODE_ENV !== 'production' || 
    (typeof window !== 'undefined' && window.location.search.includes('debug=true'));
  
  if (showDebug) {
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