"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "./language-switcher"
import LanguageSwitcher from "./language-switcher"
import { useTranslation } from 'react-i18next'
import '../../lib/i18n'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { currentLang } = useLanguage()
  const { t, i18n } = useTranslation()

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force re-render
      setIsOpen(isOpen)
    }

    window.addEventListener('languageChanged', handleLanguageChange)
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [isOpen])

  const logoPath = process.env.NODE_ENV === 'production'
    ? "/vocal-coaching/images/logo/ml-logo.PNG"
    : "/vocal-coaching/images/logo/ml-logo.PNG"

  const links = [
    { href: "/#services", label: t('nav.services') },
    { href: "/#about", label: t('nav.about') },
    { href: "/#references", label: t('nav.references') },
    { href: "/#testimonials", label: t('nav.testimonials') },
    { href: "/calendar", label: t('nav.calendar', 'Kalender') },
    { href: "/booking", label: t('nav.booking', 'Booking') },
    { href: "/#contact", label: t('nav.contact') },
  ]

  useEffect(() => {
    let isMounted = true

    const handleScroll = () => {
      if (isMounted) {
        setIsScrolled(window.scrollY > 50)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      isMounted = false
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
    document.body.style.overflow = !isOpen ? "hidden" : "unset"
  }

  const closeMenu = () => {
    setIsOpen(false)
    document.body.style.overflow = "unset"
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { href: string }) => {
    e.preventDefault()
    closeMenu()

    if (link.href.startsWith('/') && !link.href.startsWith('/#')) {
      // Direct page navigation
      router.push(link.href)
    } else if (pathname === '/') {
      // Hash navigation on home page
      const element = document.querySelector(link.href.split('#')[1] ? `#${link.href.split('#')[1]}` : 'body')
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({
          top: elementPosition - 100,
          behavior: 'smooth'
        })
      }
    } else {
      // Hash navigation from another page
      router.push(`/${link.href}`)
    }
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname !== '/') {
      router.push('/')
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md z-[100] transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="relative w-28 h-10 transition-all duration-300"
          >
            <div className="relative w-full h-full">
              <Image
                src={logoPath}
                alt="Mel jazz"
                fill
                className="object-contain brightness-0 invert hover:opacity-80 transition-opacity"
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label={t('nav.toggleMenu')}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="text-white/80 hover:text-white transition-colors text-lg"
                >
                  {link.label}
                </Link>
              ))}
              <LanguageSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
} 