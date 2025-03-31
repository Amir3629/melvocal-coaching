"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps {
  onClick: () => void
  isSubmitting: boolean
  disabled?: boolean
}

export default function SubmitButton({ onClick, isSubmitting, disabled }: SubmitButtonProps) {
  const { t } = useTranslation()

  return (
    <motion.button
      onClick={onClick}
      disabled={isSubmitting || disabled}
      className={`relative px-6 py-2.5 text-sm sm:text-base text-white rounded-lg transition-all duration-200 ${
        isSubmitting || disabled
          ? 'bg-gray-800 cursor-not-allowed'
          : 'bg-[#C8A97E] hover:bg-[#B69468] hover:shadow-lg hover:shadow-[#C8A97E]/20'
      }`}
      whileHover={!isSubmitting && !disabled ? { scale: 1.02 } : {}}
      whileTap={!isSubmitting && !disabled ? { scale: 0.98 } : {}}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
          <span>{t('booking.submitting', 'Wird gesendet...')}</span>
        </div>
      ) : (
        <span>{t('booking.submit', 'Anfrage senden')}</span>
      )}
    </motion.button>
  )
} 