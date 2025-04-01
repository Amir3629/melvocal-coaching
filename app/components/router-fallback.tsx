"use client";

import React, { useState, useEffect } from 'react';

/**
 * Router fallback component that activates when router initialization fails
 * This helps prevent the React Error #130 in GitHub Pages by providing a safe fallback
 */
export default function RouterFallback() {
  const [routerError, setRouterError] = useState(false);
  
  useEffect(() => {
    // Only activate in browser
    if (typeof window === 'undefined') return;
    
    // Set up error detector for router-specific issues
    const originalError = console.error;
    console.error = function(...args) {
      if (args[0] && typeof args[0] === 'string') {
        // Check for router-related errors
        if (args[0].includes('Minified React error #130') || 
            args[0].includes('Objects are not valid as a React child') ||
            args[0].includes('Error: Router not initialized') ||
            args[0].includes('NextRouter not mounted') ||
            args[0].includes('isNextRouterError')) {
          
          // Activate fallback
          setRouterError(true);
          
          // Attempt to recover the location
          try {
            if (window.location.href.includes('/melvocal-coaching')) {
              console.warn('[RouterFallback] Detected GitHub Pages URL');
              
              // Extract path after basePath
              const basePathIndex = window.location.pathname.indexOf('/melvocal-coaching');
              if (basePathIndex !== -1) {
                const path = window.location.pathname.slice(basePathIndex + '/melvocal-coaching'.length) || '/';
                console.warn(`[RouterFallback] Current path: ${path}`);
              }
            }
          } catch (e) {
            // Ignore navigation errors
          }
        }
      }
      
      // Call original console function
      return originalError.apply(console, args);
    };
    
    return () => {
      // Restore original console function
      console.error = originalError;
    };
  }, []);
  
  // Only render something when a router error is detected
  if (!routerError) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '20px',
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        zIndex: 9999,
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      <h2 style={{ margin: '0 0 10px', fontSize: '18px', color: '#C8A97E' }}>
        Navigation Issue Detected
      </h2>
      <p style={{ margin: '0 0 15px', fontSize: '14px' }}>
        There was an issue with the page navigation. You can try:
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button
          onClick={() => window.location.href = '/melvocal-coaching/'}
          style={{
            background: '#C8A97E',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            color: 'black',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Go to Homepage
        </button>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'transparent',
            border: '1px solid #C8A97E',
            padding: '8px 15px',
            borderRadius: '4px',
            color: '#C8A97E',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
} 