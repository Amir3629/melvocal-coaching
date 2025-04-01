"use client";

import React, { useEffect, useState } from 'react';
import { useDebug } from '@/hooks/use-debug';

/**
 * Component that runs checks to verify fix deployment
 * Only active when ?debug=true is in URL
 */
export default function DeploymentChecks() {
  const { isDebugMode } = useDebug();
  const [checkResults, setCheckResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isDebugMode) return;

    // Run verification checks to ensure all fixes are properly deployed
    const runChecks = async () => {
      const results: Record<string, boolean> = {};
      
      // Check 1: Verify formatters.ts utilities are available
      try {
        const formatter = await import('@/lib/formatters');
        results.formattersAvailable = typeof formatter.ensureString === 'function';
      } catch (e) {
        results.formattersAvailable = false;
      }
      
      // Check 2: Verify ErrorBoundary component is loaded
      try {
        const ErrorBoundary = (await import('../error-boundary')).default;
        results.errorBoundaryAvailable = typeof ErrorBoundary === 'function';
      } catch (e) {
        results.errorBoundaryAvailable = false;
      }
      
      // Check 3: Check for version markers in the DOM
      results.versionMarkerPresent = !!document.querySelector('[data-testid="version-marker"]');
      
      // Check 4: Check for debug components
      results.debugUIPresent = !!document.querySelector('[data-testid="debug-ui"]') || 
                              !!document.querySelector('.debug-ui');
      
      // Check 5: Check for router debug components
      results.routerDebugPresent = !!document.querySelector('[data-testid="router-debug"]');
      
      // Calculate overall deployment status
      const allChecksOk = Object.values(results).every(result => result === true);
      results.deploymentComplete = allChecksOk;
      
      setCheckResults(results);
      
      // Log results to console for easy visibility
      console.log('[Deployment Verification] Fix deployment check results:', results);
      
      if (allChecksOk) {
        console.log('%c✅ All Error #130 fixes are correctly deployed!', 'color: green; font-weight: bold');
      } else {
        console.warn('%c⚠️ Some Error #130 fixes may not be correctly deployed', 'color: orange; font-weight: bold');
        console.warn('Missing components:', 
          Object.entries(results)
            .filter(([_, value]) => value === false)
            .map(([key]) => key)
            .join(', ')
        );
      }
    };
    
    // Run deployment checks
    runChecks();
    
  }, [isDebugMode]);

  // Only render UI in debug mode
  if (!isDebugMode || Object.keys(checkResults).length === 0) return null;
  
  // Visual indicator shows only when there are issues
  if (checkResults.deploymentComplete) return null;
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '30px',  // Position above debug UI bar
        left: '10px',
        background: 'rgba(200, 0, 0, 0.8)',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999
      }}
    >
      ⚠️ Fix deployment incomplete
    </div>
  );
} 