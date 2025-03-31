"use client"

import type React from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import type { FormData, ServiceType } from "@/app/types/booking"
import { Calendar, Clock, User, Mail, Phone, MessageSquare } from "lucide-react"

interface ConfirmationStepProps {
  formData: FormData
  serviceType: ServiceType
  onChange: (data: Partial<FormData>) => void
}

export default function ConfirmationStep({ formData, serviceType, onChange }: ConfirmationStepProps) {
  const { t } = useTranslation()

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    onChange({ [name]: checked })
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get service name
  const getServiceName = () => {
    switch (serviceType) {
      case "professioneller-gesang":
        return t("booking.liveJazzPerformance", "Live Jazz Performance")
      case "vocal-coaching":
        return t("booking.vocalCoachingAndGesang", "Vocal Coaching & Gesangsunterricht")
      case "gesangsunterricht":
        return t("booking.jazzWorkshop", "Jazz Workshop")
      default:
        return ""
    }
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
          {t("booking.confirmDetails", "Bestätigen Sie Ihre Angaben")}
        </h3>
        <p className="text-gray-400 text-sm">
          {t("booking.confirmDetailsDesc", "Überprüfen Sie Ihre Angaben und bestätigen Sie die Buchung.")}
        </p>
      </div>

      {/* Booking summary */}
      <div className="bg-[#1A1A1A] rounded-lg border border-gray-800 p-4 mb-6">
        <h4 className="text-lg font-medium text-white mb-4">{t("booking.bookingSummary", "Buchungsübersicht")}</h4>

        <div className="space-y-3">
          {/* Service */}
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center mr-3 flex-shrink-0">
              <Calendar className="w-4 h-4 text-[#C8A97E]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t("booking.service", "Dienst")}</p>
              <p className="text-white">{getServiceName()}</p>
            </div>
          </div>

          {/* Date and Time */}
          {(formData.preferredDate || formData.eventDate) && (
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center mr-3 flex-shrink-0">
                <Clock className="w-4 h-4 text-[#C8A97E]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{t("booking.dateAndTime", "Datum & Uhrzeit")}</p>
                <p className="text-white">
                  {formatDate(formData.preferredDate || formData.eventDate)}
                  {formData.preferredTime && `, ${formData.preferredTime} Uhr`}
                </p>
              </div>
            </div>
          )}

          {/* Personal Info */}
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center mr-3 flex-shrink-0">
              <User className="w-4 h-4 text-[#C8A97E]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t("booking.name", "Name")}</p>
              <p className="text-white">{formData.name}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center mr-3 flex-shrink-0">
              <Mail className="w-4 h-4 text-[#C8A97E]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t("booking.email", "E-Mail")}</p>
              <p className="text-white">{formData.email}</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start">
            <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center mr-3 flex-shrink-0">
              <Phone className="w-4 h-4 text-[#C8A97E]" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{t("booking.phone", "Telefon")}</p>
              <p className="text-white">{formData.phone}</p>
            </div>
          </div>

          {/* Message */}
          {formData.message && (
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center mr-3 flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-[#C8A97E]" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{t("booking.message", "Nachricht")}</p>
                <p className="text-white whitespace-pre-line">{formData.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legal agreements */}
      <div className="space-y-3 mb-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="termsAccepted"
            name="termsAccepted"
            checked={formData.termsAccepted || false}
            onChange={handleCheckboxChange}
            className="mt-1 mr-3 h-4 w-4 rounded border-gray-700 text-[#C8A97E] focus:ring-[#C8A97E]"
          />
          <label htmlFor="termsAccepted" className="text-sm text-gray-300">
            {t("booking.termsAgreement", "Ich akzeptiere die ")}
            <a href="/terms" target="_blank" className="text-[#C8A97E] hover:underline" rel="noreferrer">
              {t("booking.terms", "Allgemeinen Geschäftsbedingungen")}
            </a>
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacyAccepted"
            name="privacyAccepted"
            checked={formData.privacyAccepted || false}
            onChange={handleCheckboxChange}
            className="mt-1 mr-3 h-4 w-4 rounded border-gray-700 text-[#C8A97E] focus:ring-[#C8A97E]"
          />
          <label htmlFor="privacyAccepted" className="text-sm text-gray-300">
            {t("booking.privacyAgreement", "Ich habe die ")}
            <a href="/privacy" target="_blank" className="text-[#C8A97E] hover:underline" rel="noreferrer">
              {t("booking.privacy", "Datenschutzerklärung")}
            </a>
            {t("booking.privacyAgreementEnd", " gelesen und stimme der Verarbeitung meiner Daten zu.")}
          </label>
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        {t(
          "booking.submissionNote",
          "Nach dem Absenden erhalten Sie eine Bestätigung per E-Mail. Wir werden uns in Kürze bei Ihnen melden.",
        )}
      </div>
    </motion.div>
  )
}

