"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useTranslation } from 'react-i18next'
import '../../lib/i18n'

export type LanguageContextType = {
  currentLang: string
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState<string>('de')
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const savedLang = localStorage.getItem('language') || 'de'
        await i18n.changeLanguage(savedLang)
        setCurrentLang(savedLang)
        document.documentElement.lang = savedLang
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize language:', error)
        // Fallback to default language
        setCurrentLang('de')
        document.documentElement.lang = 'de'
        setIsInitialized(true)
      }
    }

    initializeLanguage()
  }, [i18n])

  // Subscribe to language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng)
      document.documentElement.lang = lng
    }

    i18n.on('languageChanged', handleLanguageChanged)

    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n])

  const toggleLanguage = async () => {
    try {
      const newLang = currentLang === 'de' ? 'en' : 'de'
      await i18n.changeLanguage(newLang)
      localStorage.setItem('language', newLang)
      setCurrentLang(newLang)
      document.documentElement.lang = newLang

      // Force re-render of translated components
      window.dispatchEvent(new Event('languageChanged'))
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  if (!isInitialized) {
    return null // or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ currentLang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export default function LanguageSwitcher() {
  const { currentLang, toggleLanguage } = useLanguage()
  const { t } = useTranslation()

  return (
    <button
      onClick={toggleLanguage}
      className="text-white hover:text-[#C8A97E] transition-colors px-4 py-2 rounded"
      aria-label={t('common:switchLanguage')}
    >
      {currentLang.toUpperCase()}
    </button>
  )
} 