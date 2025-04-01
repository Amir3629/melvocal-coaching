"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * Debug mode hook that enables debugging features
 * Activated by:
 * 1. URL parameter: ?debug=true 
 * 2. Key sequence: Press 'd' key 3 times
 */
export function useDebug() {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  
  // Check URL parameters for debug mode
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const debugParam = urlParams.get('debug');
    
    // Check if debug mode should be enabled
    if (debugParam === 'true') {
      setIsDebugMode(true);
      console.log('[Debug] Debug mode enabled by URL parameter');
    }
  }, []);
  
  // Set up key sequence detection
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only track 'd' key presses
      if (e.key === 'd') {
        setKeySequence(prev => {
          const newSequence = [...prev, e.key].slice(-3);
          
          // Check if sequence is 3 'd' keys in a row
          if (newSequence.length === 3 && newSequence.every(key => key === 'd')) {
            setIsDebugMode(prevDebug => {
              const newState = !prevDebug;
              console.log(`[Debug] Debug mode ${newState ? 'enabled' : 'disabled'} by key sequence`);
              return newState;
            });
            return [];
          }
          
          return newSequence;
        });
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Toggle debug mode function
  const toggleDebugMode = useCallback(() => {
    setIsDebugMode(prev => !prev);
  }, []);
  
  /**
   * Log potentially problematic props that could cause React Error #130
   */
  const logPropIssues = (componentName: string, props: Record<string, any>) => {
    if (!isDebugMode) return;

    // Check for problematic props (objects that might be passed directly to JSX)
    const problematicProps: Record<string, any> = {};
    let hasProblematicProps = false;

    Object.entries(props).forEach(([key, value]) => {
      if (
        value !== null && 
        typeof value === 'object' && 
        !(value instanceof String) &&
        !(Array.isArray(value) && value.every(item => typeof item !== 'object'))
      ) {
        problematicProps[key] = value;
        hasProblematicProps = true;
      }
    });

    if (hasProblematicProps) {
      console.warn(`[DebugMode] Potential React Error #130 in ${componentName}:`);
      console.warn('The following props are objects that might cause issues if rendered directly:');
      console.table(Object.keys(problematicProps).map(key => ({
        prop: key,
        type: typeof problematicProps[key],
        value: JSON.stringify(problematicProps[key]).substring(0, 100) + '...'
      })));
      console.warn('Full props:', props);
    }
  };

  return {
    isDebugMode,
    toggleDebugMode,
    logPropIssues
  };
} 