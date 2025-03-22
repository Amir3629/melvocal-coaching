"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useTranslation } from 'react-i18next'
import { updateDocumentLanguage, applyTranslations } from '../../lib/i18n'

export type LanguageContextType = {
  currentLang: string
  toggleLanguage: () => void
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState<string>('de')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const savedLang = localStorage.getItem('language') || 'de'
        await i18n.changeLanguage(savedLang)
        setCurrentLang(savedLang)
        updateDocumentLanguage(savedLang)
        applyTranslations(savedLang)
        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize language:', error)
        setCurrentLang('de')
        updateDocumentLanguage('de')
        setIsInitialized(true)
      }
    }

    initializeLanguage()
  }, [i18n])

  const toggleLanguage = async () => {
    try {
      setIsLoading(true)
      const newLang = currentLang === 'de' ? 'en' : 'de'
      
      // Change language in i18next
      await i18n.changeLanguage(newLang)
      localStorage.setItem('language', newLang)
      setCurrentLang(newLang)
      
      // Update document language and apply translations
      updateDocumentLanguage(newLang)
      applyTranslations(newLang)
      
      // Force re-render of translated components
      window.dispatchEvent(new Event('languageChanged'))
      
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isInitialized) {
    return null
  }

  return (
    <LanguageContext.Provider value={{ currentLang, toggleLanguage, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default function LanguageSwitcher() {
  const { currentLang, toggleLanguage, isLoading } = useLanguage()
  const { t } = useTranslation()

  return (
    <button
      onClick={toggleLanguage}
      className="text-white hover:text-[#C8A97E] transition-colors px-4 py-2 rounded flex items-center space-x-2"
      aria-label={t('language.switchTo')}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="inline-block animate-spin mr-1">⟳</span>
      ) : null}
      <span>{currentLang.toUpperCase()}</span>
    </button>
  )
} 