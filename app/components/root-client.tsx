"use client"

import React from 'react'
import ClientProvider from './client-provider'
import Footer from './footer'
import CookieConsent from './cookie-consent'
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
    <div className={className}>
      {/* Load GitHub Pages entry before everything else */}
      <GitHubPagesEntry />
      
      <ClientProvider>
        {children}
        <Footer />
        <CookieConsent />
      </ClientProvider>
    </div>
  )
} 