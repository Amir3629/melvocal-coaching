"use client";

import { useEffect, useState } from 'react';

type DebugLevel = 'error' | 'warn' | 'info' | 'debug';

/**
 * Debug mode hook that enables debugging features
 * Activated by:
 * 1. URL parameter: ?debug=true 
 * 2. Key sequence: Press 'd' key 3 times
 */
export function useDebug(componentName: string, enabled = process.env.NODE_ENV !== 'production') {
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [logs, setLogs] = useState<{level: DebugLevel, message: string, data?: any}[]>([]);
  
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
  const toggleDebugMode = () => {
    setIsDebugMode(prev => !prev);
  };
  
  const log = (level: DebugLevel, message: string, data?: any) => {
    if (!enabled) return;
    
    console[level](`[${componentName}] ${message}`, data);
    setLogs(prev => [...prev, {level, message, data}]);
  };

  // Add global error listener
  useEffect(() => {
    if (!enabled) return;
    
    const handleError = (event: ErrorEvent) => {
      log('error', `Unhandled error: ${event.message}`, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  /**
   * Log potentially problematic props that could cause React Error #130
   */
  const logPropIssues = (props: Record<string, any>) => {
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
    logPropIssues,
    error: (message: string, data?: any) => log('error', message, data),
    warn: (message: string, data?: any) => log('warn', message, data),
    info: (message: string, data?: any) => log('info', message, data),
    debug: (message: string, data?: any) => log('debug', message, data),
    logs
  };
} 