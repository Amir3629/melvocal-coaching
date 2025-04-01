'use client'

import React from 'react'
import AdvancedErrorBoundary from './AdvancedErrorBoundary'
import GlobalErrorPage from './GlobalErrorPage'

interface GlobalErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Global error boundary that wraps the entire application
 * Uses AdvancedErrorBoundary with GlobalErrorPage as fallback
 */
export default function GlobalErrorBoundary({ children, fallback }: GlobalErrorBoundaryProps) {
  return (
    <AdvancedErrorBoundary
      fallback={fallback || <GlobalErrorPage />}
      context="GlobalErrorBoundary"
    >
      {children}
    </AdvancedErrorBoundary>
  )
} 