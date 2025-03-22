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
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { currentLang } = useLanguage()
  const { t } = useTranslation()

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setIsOpen(isOpen)
    }

    window.addEventListener('languageChanged', handleLanguageChange)
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange)
    }
  }, [isOpen])

  // Ensure body has no padding
  useEffect(() => {
    document.body.style.paddingTop = '0';
    return () => {
      document.body.style.paddingTop = '';
    };
  }, []);

  const logoPath = process.env.NODE_ENV === 'production'
    ? "/vocal-coaching/images/logo/ml-logo.PNG"
    : "/vocal-coaching/images/logo/ml-logo.PNG"

  const links = [
    { href: "/#services", label: "nav.services" },
    { href: "/#about", label: "nav.about" },
    { href: "/#references", label: "nav.references" },
    { href: "/#testimonials", label: "nav.testimonials" },
    { href: "/#contact", label: "nav.contact" },
  ]

  // Simplified scroll handler that only handles header visibility
  useEffect(() => {
    let isMounted = true

    const handleScroll = () => {
      if (isMounted) {
        setIsScrolled(window.scrollY > 50)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
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
      return
    }

    // Handle hash navigation
    const hash = link.href.split('#')[1]
    if (!hash) return

    // Get the element to scroll to
    const element = document.getElementById(hash)
    if (element) {
      // Use scrollIntoView with smoother settings
      const headerOffset = 80; // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    }
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    closeMenu()
    
    if (pathname !== '/') {
      router.push('/')
      return
    }

    // Smooth scroll to top with a slower duration
    const scrollToTop = () => {
      const currentPosition = window.pageYOffset
      if (currentPosition > 0) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        })
      }
    }

    scrollToTop()
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'bg-black/40 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-[var(--header-height-mobile)] md:h-[var(--header-height)]">
          <Link 
            href="/" 
            onClick={handleLogoClick}
            className="relative w-20 md:w-28 h-8 md:h-10 transition-all duration-300"
          >
            <div className="relative w-full h-full scale-110">
              <Image
                src={logoPath}
                alt="Mel jazz"
                fill
                className="object-contain brightness-0 invert hover:opacity-80 transition-opacity"
                priority
                data-i18n="logo.alt"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="text-sm font-medium tracking-wider uppercase text-white hover:text-[#C8A97E] transition-all duration-300 no-underline after:hidden"
                data-i18n={link.label}
              >
                {t(link.label)}
              </Link>
            ))}
            <LanguageSwitcher />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none p-2 -mr-2"
            aria-label={t(isOpen ? 'nav.close' : 'nav.menu')}
            data-i18n={isOpen ? 'nav.close' : 'nav.menu'}
          >
            <div className="w-6 h-6 relative transform transition-all duration-300">
              <span className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
                isOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
              }`} />
              <span className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`absolute h-0.5 w-full bg-current transform transition-all duration-300 ${
                isOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
              }`} />
            </div>
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
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-sm pt-[var(--header-height-mobile)]"
          >
            <nav className="flex flex-col items-center justify-center min-h-screen -mt-[var(--header-height-mobile)] px-6">
              {links.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full"
                >
                  <Link
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="text-base md:text-lg font-medium tracking-wider uppercase text-white hover:text-[#C8A97E] transition-all duration-300 no-underline after:hidden block py-4 text-center w-full border-b border-white/10"
                    data-i18n={link.label}
                  >
                    {t(link.label)}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.1 }}
                className="mt-8"
              >
                <LanguageSwitcher />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
} 