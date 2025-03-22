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
        w-full py-3 font-medium rounded-lg transition-colors flex items-center justify-center
        ${isLastStep 
          ? 'bg-[#C8A97E] text-black hover:bg-[#D4AF37]' 
          : 'bg-white/10 text-white hover:bg-white/20'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isSubmitting ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : isLastStep ? (
        <Check className="w-5 h-5 mr-2" />
      ) : (
        <ArrowRight className="w-5 h-5 mr-2" />
      )}
      
      {isLastStep 
        ? t('booking.submitBooking', 'Buchung absenden')
        : t('booking.nextStep', 'Weiter')
      }
    </motion.button>
  )
} 