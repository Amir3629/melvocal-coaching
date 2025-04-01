'use client';

import React, { useEffect, useState } from 'react';

/**
 * StaticSiteHandler component that fixes paths for GitHub Pages
 */
export default function StaticSiteHandler() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only run once
    if (initialized) return;
    setInitialized(true);

    try {
      console.log('[StaticSiteHandler] Initializing path fixes');

      // Fix paths if needed
      if (typeof document !== 'undefined') {
        // Check for GitHub Pages environment
        const isGitHubPages = typeof window !== 'undefined' && 
          (window.location.hostname.includes('github.io') || 
           window.location.pathname.includes('/melvocal-coaching'));
        
        if (!isGitHubPages) {
          return;
        }

        // Fix CSS links
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.includes('/vocal-coaching/')) {
            const correctedHref = href.replace('/vocal-coaching/', '/melvocal-coaching/');
            link.setAttribute('href', correctedHref);
          }
        });
        
        // Fix script paths
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
          const src = script.getAttribute('src');
          if (src && src.includes('/vocal-coaching/')) {
            const correctedSrc = src.replace('/vocal-coaching/', '/melvocal-coaching/');
            script.setAttribute('src', correctedSrc);
          }
        });
        
        // Fix image paths
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
          const src = img.getAttribute('src');
          if (src && src.includes('/vocal-coaching/')) {
            const correctedSrc = src.replace('/vocal-coaching/', '/melvocal-coaching/');
            img.setAttribute('src', correctedSrc);
          }
        });
      }
    } catch (e) {
      console.error('[StaticSiteHandler] Error:', e);
    }
  }, [initialized]);

  // This component doesn't render anything
  return null;
} 