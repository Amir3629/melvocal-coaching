"use client";

import { useState, useEffect } from 'react';

/**
 * Hook to enable debugging for React Error #130
 * Can be activated by adding ?debug=true to the URL
 */
export function useDebug() {
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    // Check URL for debug parameter
    const url = new URL(window.location.href);
    const debugParam = url.searchParams.get('debug');
    setIsDebugMode(debugParam === 'true');

    // Also enable with key sequence (press 'd' 3 times quickly)
    let keySequence: string[] = [];
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'd') {
        keySequence.push('d');
        setTimeout(() => {
          keySequence = [];
        }, 1000);
        
        if (keySequence.length === 3) {
          setIsDebugMode(prev => {
            const newValue = !prev;
            console.log(newValue ? 'Debug mode enabled' : 'Debug mode disabled');
            
            // Update URL to reflect debug state
            const url = new URL(window.location.href);
            if (newValue) {
              url.searchParams.set('debug', 'true');
            } else {
              url.searchParams.delete('debug');
            }
            window.history.replaceState({}, '', url.toString());
            
            return newValue;
          });
          keySequence = [];
        }
      }
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
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
    logPropIssues
  };
} 