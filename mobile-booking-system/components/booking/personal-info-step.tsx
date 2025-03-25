"use client"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import type { FormData } from "@/app/types/booking"

interface PersonalInfoStepProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
}

export default function PersonalInfoStep({ formData, onChange }: PersonalInfoStepProps) {
  const { t } = useTranslation()

  const inputVariants = {
    initial: { opacity: 0, y: 10 },
    animate: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.05 * index,
        duration: 0.3,
      },
    }),
  }

  return (
    <div className="space-y-5 py-2">
      <motion.div variants={inputVariants} initial="initial" animate="animate" custom={0}>
        <label htmlFor="name" className="block text-white text-sm font-medium mb-1.5">
          {t("booking.name", "Name")} *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#C8A97E] focus:border-[#C8A97E] transition-colors"
          placeholder={t("booking.namePlaceholder", "Ihr vollständiger Name")}
          required
          autoComplete="name"
        />
      </motion.div>

      <motion.div variants={inputVariants} initial="initial" animate="animate" custom={1}>
        <label htmlFor="email" className="block text-white text-sm font-medium mb-1.5">
          {t("booking.email", "E-Mail")} *
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => onChange({ email: e.target.value })}
          className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#C8A97E] focus:border-[#C8A97E] transition-colors"
          placeholder={t("booking.emailPlaceholder", "Ihre E-Mail-Adresse")}
          required
          autoComplete="email"
        />
      </motion.div>

      <motion.div variants={inputVariants} initial="initial" animate="animate" custom={2}>
        <label htmlFor="phone" className="block text-white text-sm font-medium mb-1.5">
          {t("booking.phone", "Telefon")} *
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#C8A97E] focus:border-[#C8A97E] transition-colors"
          placeholder={t("booking.phonePlaceholder", "Ihre Telefonnummer")}
          required
          autoComplete="tel"
        />
      </motion.div>

      <motion.div variants={inputVariants} initial="initial" animate="animate" custom={3}>
        <label htmlFor="message" className="block text-white text-sm font-medium mb-1.5">
          {t("booking.message", "Nachricht")}
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => onChange({ message: e.target.value })}
          rows={3}
          className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#C8A97E] focus:border-[#C8A97E] transition-colors resize-y"
          placeholder={t("booking.messagePlaceholder", "Ihre Nachricht oder Anfrage (optional)")}
        />
        <p className="mt-1.5 text-xs text-gray-400">{t("booking.optionalField", "Optionales Feld")}</p>
      </motion.div>
    </div>
  )
}

