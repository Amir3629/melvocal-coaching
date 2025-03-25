"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mic, Music, Calendar, Check } from 'lucide-react'

// Service types
type ServiceType = 'gesangsunterricht' | 'vocal-coaching' | 'professioneller-gesang' | null

interface ServiceSelectionProps {
  selectedService: ServiceType
  onSelect: (service: ServiceType) => void
}

export default function ServiceSelection({ selectedService, onSelect }: ServiceSelectionProps) {
  const { t } = useTranslation()
  
  const cardVariants = {
    initial: { opacity: 0, x: -20 },
    animate: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.15,
        duration: 0.5,
        ease: [0.23, 1, 0.32, 1]
      }
    }),
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  }

  return (
    <div 
      className="w-full max-w-[420px] mx-auto px-4 sm:px-6" 
      style={{ 
        direction: 'ltr',
        textAlign: 'left'
      }}
      dir="ltr"
    >
      <div className="mb-8" style={{ direction: 'ltr' }}>
        <h2 
          className="text-[28px] font-bold text-white mb-3" 
          style={{ 
            direction: 'ltr',
            textAlign: 'left',
            display: 'block'
          }}
          dir="ltr"
        >
          {t('booking.selectService', 'Dienst auswählen')}
        </h2>
        <p 
          className="text-base text-gray-400 leading-relaxed"
          style={{ 
            direction: 'ltr',
            textAlign: 'left',
            display: 'block'
          }}
          dir="ltr"
        >
          {t('booking.selectServiceDesc', 'Wählen Sie den gewünschten Service aus.')}
        </p>
      </div>

      <div className="space-y-4">
        {/* Live Jazz Performance */}
        <motion.button
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          custom={0}
          onClick={() => onSelect('professioneller-gesang')}
          className={`w-full p-5 rounded-xl border transition-all duration-300 ${
            selectedService === 'professioneller-gesang'
              ? 'bg-[#1A1A1A] border-[#C8A97E] shadow-lg'
              : 'bg-[#121212] border-gray-800 hover:border-[#C8A97E]/50'
          }`}
          style={{ 
            direction: 'ltr',
            textAlign: 'left',
            display: 'block'
          }}
          dir="ltr"
        >
          <div className="flex items-start gap-4" style={{ direction: 'ltr' }}>
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
              <Mic className="w-6 h-6 text-[#C8A97E]" />
            </div>
            <div className="flex-1 min-w-0" style={{ direction: 'ltr', textAlign: 'left' }}>
              <h3 
                className="text-lg font-semibold text-white mb-1"
                style={{ 
                  direction: 'ltr',
                  textAlign: 'left',
                  display: 'block'
                }}
                dir="ltr"
              >
                {t('booking.liveJazzPerformance', 'Live Jazz Performance')}
              </h3>
              <p 
                className="text-sm text-gray-400"
                style={{ 
                  direction: 'ltr',
                  textAlign: 'left',
                  display: 'block'
                }}
                dir="ltr"
              >
                {t('booking.nachVereinbarung', 'Nach Vereinbarung')}
              </p>
            </div>
            {selectedService === 'professioneller-gesang' && (
              <div className="w-6 h-6 flex items-center justify-center">
                <Check className="w-5 h-5 text-[#C8A97E]" />
              </div>
            )}
          </div>
        </motion.button>

        {/* Vocal Coaching */}
        <motion.button
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          custom={1}
          onClick={() => onSelect('vocal-coaching')}
          className={`w-full p-5 rounded-xl border transition-all duration-300 ${
            selectedService === 'vocal-coaching'
              ? 'bg-[#1A1A1A] border-[#C8A97E] shadow-lg'
              : 'bg-[#121212] border-gray-800 hover:border-[#C8A97E]/50'
          }`}
          style={{ 
            direction: 'ltr',
            textAlign: 'left',
            display: 'block'
          }}
          dir="ltr"
        >
          <div className="flex items-start gap-4" style={{ direction: 'ltr' }}>
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
              <Music className="w-6 h-6 text-[#C8A97E]" />
            </div>
            <div className="flex-1 min-w-0" style={{ direction: 'ltr', textAlign: 'left' }}>
              <h3 
                className="text-lg font-semibold text-white mb-1"
                style={{ 
                  direction: 'ltr',
                  textAlign: 'left',
                  display: 'block'
                }}
                dir="ltr"
              >
                {t('booking.vocalCoachingAndGesang', 'Vocal Coaching & Gesangsunterricht')}
              </h3>
              <p 
                className="text-sm text-gray-400"
                style={{ 
                  direction: 'ltr',
                  textAlign: 'left',
                  display: 'block'
                }}
                dir="ltr"
              >
                60 min
              </p>
            </div>
            {selectedService === 'vocal-coaching' && (
              <div className="w-6 h-6 flex items-center justify-center">
                <Check className="w-5 h-5 text-[#C8A97E]" />
              </div>
            )}
          </div>
        </motion.button>

        {/* Jazz Workshop */}
        <motion.button
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          custom={2}
          onClick={() => onSelect('gesangsunterricht')}
          className={`w-full p-5 rounded-xl border transition-all duration-300 ${
            selectedService === 'gesangsunterricht'
              ? 'bg-[#1A1A1A] border-[#C8A97E] shadow-lg'
              : 'bg-[#121212] border-gray-800 hover:border-[#C8A97E]/50'
          }`}
          style={{ 
            direction: 'ltr',
            textAlign: 'left',
            display: 'block'
          }}
          dir="ltr"
        >
          <div className="flex items-start gap-4" style={{ direction: 'ltr' }}>
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-[#C8A97E]" />
            </div>
            <div className="flex-1 min-w-0" style={{ direction: 'ltr', textAlign: 'left' }}>
              <h3 
                className="text-lg font-semibold text-white mb-1"
                style={{ 
                  direction: 'ltr',
                  textAlign: 'left',
                  display: 'block'
                }}
                dir="ltr"
              >
                {t('booking.jazzWorkshop', 'Jazz Workshop')}
              </h3>
              <p 
                className="text-sm text-gray-400"
                style={{ 
                  direction: 'ltr',
                  textAlign: 'left',
                  display: 'block'
                }}
                dir="ltr"
              >
                {t('booking.variableDuration', 'Variable Dauer')}
              </p>
            </div>
            {selectedService === 'gesangsunterricht' && (
              <div className="w-6 h-6 flex items-center justify-center">
                <Check className="w-5 h-5 text-[#C8A97E]" />
              </div>
            )}
          </div>
        </motion.button>
      </div>
    </div>
  )
} 