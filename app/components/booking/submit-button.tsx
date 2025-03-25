"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface SubmitButtonProps {
  isLastStep?: boolean
  isSubmitting?: boolean
  onClick: () => void
  disabled?: boolean
}

export default function SubmitButton({
  isLastStep = false,
  isSubmitting = false,
  onClick,
  disabled = false
}: SubmitButtonProps) {
  const { t } = useTranslation()
  
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || isSubmitting}
      className={`
        py-2.5 px-5 sm:py-3 sm:px-6 font-medium rounded-lg transition-all flex items-center justify-center
        ${isLastStep 
          ? 'bg-[#C8A97E] text-black hover:bg-[#D4AF37] active:bg-[#B89665]' 
          : 'bg-[#1A1A1A] text-white hover:bg-[#222] active:bg-[#282828] border border-gray-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C8A97E] focus:ring-offset-[#121212]
      `}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
          <span>{t('booking.processing', 'Verarbeitung')}</span>
        </>
      ) : isLastStep ? (
        <>
          <Check className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          <span>{t('booking.submitBooking', 'Buchung absenden')}</span>
        </>
      ) : (
        <>
          <span>{t('booking.nextStep', 'Weiter')}</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
        </>
      )}
    </motion.button>
  )
} 