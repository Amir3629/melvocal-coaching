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

export default function RootClient({
  children,
  className,
}: {
  children: React.ReactNode,
  className: string
}) {
  return (
    <ErrorBoundary componentName="RootClient">
      <html className={className}>
        <head />
        <body className={className}>
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
        </body>
      </html>
    </ErrorBoundary>
  )
} 