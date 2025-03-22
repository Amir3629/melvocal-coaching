"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "./language-switcher"
import { useTranslation } from 'react-i18next'
import Link from "next/link"

export default function TestNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Test different ways of using useLanguage
  const context = useLanguage() // Raw usage
  console.log("Raw context:", context)

  const { currentLang, toggleLanguage } = useLanguage() // Correct destructuring
  console.log("Destructured values:", { currentLang, toggleLanguage })

  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-white font-medium text-xl">
            Mel jazz
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {/* Using t directly from useLanguage */}
            <Link href="/" className="text-white hover:text-[#C8A97E] transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/#services" className="text-white hover:text-[#C8A97E] transition-colors">
              {t('nav.services')}
            </Link>
            <Link href="/#about" className="text-white hover:text-[#C8A97E] transition-colors">
              {t('nav.about')}
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            Menu
          </button>
        </div>
      </div>
    </nav>
  )
} 