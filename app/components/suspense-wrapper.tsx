'use client';

import React, { Suspense } from 'react';

/**
 * SuspenseWrapper component that wraps children in a Suspense boundary
 * This fixes the build error: "useSearchParams() should be wrapped in a suspense boundary"
 */
export default function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
} 