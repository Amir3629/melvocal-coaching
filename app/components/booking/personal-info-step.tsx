"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface PersonalInfoStepProps {
  formData: {
    name: string
    email: string
    phone: string
    message: string
  }
  onChange: (data: Partial<PersonalInfoStepProps['formData']>) => void
}

export default function PersonalInfoStep({ formData, onChange }: PersonalInfoStepProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4 sm:px-0"
    >
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
          {t('booking.personalInfo', 'Persönliche Informationen')}
        </h3>
        <p className="text-sm sm:text-base text-gray-400">
          {t('booking.personalInfoDesc', 'Bitte geben Sie Ihre Kontaktdaten ein.')}
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-white">
              {t('booking.name', 'Name')} *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white text-sm sm:text-base transition-colors duration-200"
              placeholder={t('booking.namePlaceholder', 'Ihr Name')}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              {t('booking.email', 'E-Mail')} *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white text-sm sm:text-base transition-colors duration-200"
              placeholder={t('booking.emailPlaceholder', 'ihre@email.de')}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-white">
              {t('booking.phone', 'Telefon')} *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white text-sm sm:text-base transition-colors duration-200"
              placeholder={t('booking.phonePlaceholder', '+49 123 456789')}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-white">
            {t('booking.message', 'Nachricht')}
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => onChange({ message: e.target.value })}
            rows={4}
            className="w-full px-4 py-2.5 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white text-sm sm:text-base transition-colors duration-200 resize-none"
            placeholder={t('booking.messagePlaceholder', 'Ihre Nachricht (optional)')}
          />
        </div>
      </div>
    </motion.div>
  )
} 