"use client"

import type React from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import type { FormData } from "@/app/types/booking"

interface PersonalInfoStepProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
}

export default function PersonalInfoStep({ formData, onChange }: PersonalInfoStepProps) {
  const { t } = useTranslation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onChange({ [name]: value })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="py-2 sm:py-4 w-full max-w-md mx-auto"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          {t("booking.personalInfo", "Persönliche Informationen")}
        </h3>
        <p className="text-gray-400 text-sm">
          {t("booking.personalInfoDesc", "Bitte geben Sie Ihre Kontaktdaten ein.")}
        </p>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            {t("booking.name", "Name")} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-[#1A1A1A] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
            placeholder={t("booking.yourName", "Ihr Name")}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            {t("booking.email", "E-Mail")} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-[#1A1A1A] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
            placeholder={t("booking.yourEmail", "Ihre E-Mail-Adresse")}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
            {t("booking.phone", "Telefon")} *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-[#1A1A1A] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
            placeholder={t("booking.yourPhone", "Ihre Telefonnummer")}
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
            {t("booking.message", "Nachricht")}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message || ""}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 bg-[#1A1A1A] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent resize-none"
            placeholder={t("booking.yourMessage", "Ihre Nachricht (optional)")}
          />
        </div>

        <div className="text-xs text-gray-500 mt-2">* {t("booking.requiredFields", "Pflichtfelder")}</div>
      </div>
    </motion.div>
  )
}

