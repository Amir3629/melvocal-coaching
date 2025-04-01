"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ensureString } from '@/lib/formatters';

/**
 * GitHub Pages specific entry component
 * Helps diagnose and fix deployment issues with GitHub Pages
 */
export default function GitHubPagesEntry() {
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');
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
      console.log('[GitHubPages] Environment detected');
      
      if (typeof window !== 'undefined') {
        // Add meta tags to help with proper caching
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', 'Cache-Control');
        meta.setAttribute('content', 'no-cache, no-store, must-revalidate');
        document.head.appendChild(meta);
        
        // Mark app as initialized
        if (typeof (window as any).markAppAsInitialized === 'function') {
          setTimeout(() => {
            (window as any).markAppAsInitialized();
          }, 1000);
        }
      }
      
      // Set ready after diagnostics
      setStatus('ready');
    } catch (err) {
      console.error('Error in GitHubPagesEntry:', err);
    }
  }, [safePathname]);
  
  // This component doesn't render anything visible
  return null;
} 