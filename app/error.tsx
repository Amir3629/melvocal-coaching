'use client'

import React from 'react'
import GlobalErrorPage from './components/GlobalErrorPage'

/**
 * Root error boundary for the Next.js application
 * This catches errors in the root layout and provides a fallback UI
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <GlobalErrorPage error={error} reset={reset} />
} 