"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import { FormData } from '@/app/types/booking'

interface PersonalInfoStepProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
}

export default function PersonalInfoStep({ formData, onChange }: PersonalInfoStepProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-white font-medium mb-2">
          {t('booking.name', 'Name')} *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
          placeholder={t('booking.namePlaceholder', 'Ihr vollständiger Name')}
          required
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-white font-medium mb-2">
          {t('booking.email', 'E-Mail')} *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
          placeholder={t('booking.emailPlaceholder', 'Ihre E-Mail-Adresse')}
          required
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-white font-medium mb-2">
          {t('booking.phone', 'Telefon')} *
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
          placeholder={t('booking.phonePlaceholder', 'Ihre Telefonnummer')}
          required
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-white font-medium mb-2">
          {t('booking.message', 'Nachricht')}
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => onChange({ message: e.target.value })}
          className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E] min-h-[120px]"
          placeholder={t('booking.messagePlaceholder', 'Ihre Nachricht oder Anfrage (optional)')}
        />
      </div>
    </div>
  )
} 