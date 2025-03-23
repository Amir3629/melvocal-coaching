"use client"

import React from 'react'
import ClientProvider from './client-provider'
import Footer from './footer'
import CookieConsent from './cookie-consent'

// Force full width on mobile
const rootStyles = {
  width: '100%',
  minWidth: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  margin: 0,
  padding: 0,
}

export default function RootClient({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  return (
    <html className={className} style={rootStyles}>
      <head />
      <body className={className} style={rootStyles}>
        <ClientProvider>
          <div style={rootStyles}>
            {children}
            <Footer />
            <CookieConsent />
          </div>
        </ClientProvider>
      </body>
    </html>
  )
} 