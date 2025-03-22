"use client"

import { motion } from "framer-motion"
import { useLanguage } from "./language-switcher"
import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { currentLang } = useLanguage()
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center text-white overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="container mx-auto relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6 md:mb-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 text-balance">
              {t('hero.title')}
            </h1>
            <div className="w-16 md:w-24 h-0.5 bg-[#C8A97E] mx-auto opacity-80"></div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl font-serif italic text-white/85 mb-8 md:mb-12 px-4 text-balance"
          >
            {t('hero.subtitle')}
          </motion.h2>
          <p className="text-xl text-white/80 mt-6 max-w-2xl">
            {t('hero.description')}
          </p>
          <motion.a
            href="#services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="button-text inline-flex items-center justify-center bg-[#C8A97E] text-black px-6 md:px-8 py-3 rounded-full transition-colors hover:bg-[#D4B88F] min-w-[160px] md:min-w-[200px]"
          >
            {t('hero.cta')}
          </motion.a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="w-6 h-10 border-2 border-white/50 rounded-full p-1"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  )
} 