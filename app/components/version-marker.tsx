"use client";

import React from 'react';

/**
 * Hidden version marker to verify deployment
 * Can be detected by inspecting DOM or using browser devtools
 */
export default function VersionMarker() {
  return (
    <div 
      data-testid="version-marker" 
      hidden 
      suppressHydrationWarning
      data-version="v1.4.0-error130-fix"
      data-build-time={new Date().toISOString()}
    >
      {/* 
        React Error #130 Fix Deployment Verification
        - Added ensureString for type safety
        - ErrorBoundary components
        - SafeText and DateDisplay components
        - Router debugging tools
      */}
    </div>
  );
} 