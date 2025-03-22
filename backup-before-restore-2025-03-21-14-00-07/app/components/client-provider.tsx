"use client"

import React, { useEffect } from 'react'
import { LanguageProvider } from './language-switcher'
import '../../lib/i18n'

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Force initial language detection
    const savedLang = localStorage.getItem('language')
    if (savedLang) {
      document.documentElement.lang = savedLang
    }
  }, [])

  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
} 