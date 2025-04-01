"use client"

import React from 'react'
import ClientProvider from './client-provider'
import Footer from './footer'
import CookieConsent from './cookie-consent'
import DebugUI from './debug-ui'
import ErrorBoundary from './error-boundary'
import RouterDebug from './router-debug'
import VersionMarker from './version-marker'
import DeploymentChecks from './deployment-checks'
import DiagnosticController from './diagnostic-controller'
import RouterFallback from './router-fallback'
import dynamic from 'next/dynamic'

// Import GitHub Pages Entry with dynamic loading to prevent SSR issues
const GitHubPagesEntry = dynamic(
  () => import('../github-pages-entry'),
  { ssr: false }
);

export default function RootClient({
  children,
  className,
}: {
  children: React.ReactNode,
  className: string
}) {
  return (
    <ErrorBoundary componentName="RootClient">
      <div className={className}>
        {/* Load GitHub Pages entry before everything else */}
        <GitHubPagesEntry />
        
        {/* Router fallback for error recovery */}
        <RouterFallback />
        
        <ClientProvider>
          {children}
          <Footer />
          <CookieConsent />
          <DebugUI />
          <RouterDebug />
          <VersionMarker />
          <DeploymentChecks />
          <DiagnosticController />
        </ClientProvider>
      </div>
    </ErrorBoundary>
  )
} 