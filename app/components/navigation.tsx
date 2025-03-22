"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useLanguage } from "./language-switcher"
import LanguageSwitcher from "./language-switcher"
import { useTranslation } from 'react-i18next'
import '../../lib/i18n'
import { Menu, X } from 'lucide-react'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
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

  // Simple menu toggle
  const toggleMenu = () => {
    if (!isOpen) {
      // Lock body scroll
      document.body.classList.add('overflow-hidden')
    } else {
      // Restore body scroll
      document.body.classList.remove('overflow-hidden')
    }
    
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    document.body.classList.remove('overflow-hidden')
    setIsOpen(false)
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
    <>
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
              className="md:hidden text-white focus:outline-none p-2 -mr-2 z-[1000]"
            aria-label={t(isOpen ? 'nav.close' : 'nav.menu')}
            data-i18n={isOpen ? 'nav.close' : 'nav.menu'}
          >
              {isOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
          </button>
        </div>
      </div>
      </header>

      {/* Static Mobile Menu with elegant gold styling */}
      <div 
        className={`fixed top-0 left-0 right-0 bottom-0 z-[99] bg-black pt-[var(--header-height-mobile)] md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,1) 70%)',
        }}
      >
        <div className="flex flex-col items-center justify-center h-full px-6 overflow-auto">
              {links.map((link, index) => (
            <div key={link.label} className="w-full my-1 relative">
              {/* Gold decorative line */}
              <div className="absolute left-1/2 -top-1 w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C8A97E]/50 to-transparent transform -translate-x-1/2"></div>
              
                  <Link
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                className="group relative text-lg font-medium tracking-wider uppercase text-white transition-all duration-500 no-underline block py-4 text-center w-full"
                    data-i18n={link.label}
                  >
                {/* Gold background glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm"
                  style={{ 
                    background: 'radial-gradient(circle at center, rgba(200, 169, 126, 0.15) 0%, rgba(0,0,0,0) 70%)'
                  }}
                ></div>
                
                {/* Menu item text with gold hover effect */}
                <span className="relative z-10 group-hover:text-[#C8A97E] transition-colors duration-500 px-4">
                    {t(link.label)}
                </span>
                
                {/* Subtle gold underline effect */}
                <div className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#C8A97E]/70 group-hover:w-[80%] transition-all duration-500 transform -translate-x-1/2"></div>
                  </Link>
              
              {/* Gold decorative line */}
              <div className="absolute left-1/2 -bottom-1 w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C8A97E]/50 to-transparent transform -translate-x-1/2"></div>
            </div>
          ))}
          <div className="mt-12 relative">
            {/* Gold accent for language switcher */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12">
              <div className="w-full h-full" style={{ 
                background: 'radial-gradient(circle at center, rgba(200, 169, 126, 0.1) 0%, rgba(0,0,0,0) 70%)'
              }}></div>
            </div>
                <LanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  )
} 