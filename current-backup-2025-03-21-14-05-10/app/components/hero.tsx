"use client"

import { motion } from "framer-motion"
import { useLanguage } from "./language-switcher"
import { useTranslation } from 'react-i18next'

export default function Hero() {
  const { currentLang } = useLanguage()
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="font-playfair text-7xl md:text-8xl lg:text-9xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#C8A97E] to-[#E5D5B7] tracking-wider">
              {t('hero.title')}
            </h1>
            <div className="w-24 h-0.5 bg-[#C8A97E] mx-auto opacity-80 mt-4"></div>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl mb-8 text-gray-300 font-light tracking-wide"
          >
            {t('hero.subtitle')}
          </motion.h2>
          <motion.a
            href="#services"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-[#C8A97E] text-black px-8 py-3 rounded-full font-medium text-lg transition-colors hover:bg-[#D4B88F]"
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
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
          className="w-6 h-10 border-2 border-white rounded-full p-1"
        >
          <div className="w-1 h-2 bg-white rounded-full mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  )
} 