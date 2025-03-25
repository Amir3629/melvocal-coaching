"use client"
import { useTranslation } from "react-i18next"
import { Users, Calendar, Info, Clock } from "lucide-react"
import { motion } from "framer-motion"
import GoogleCalendarPicker from "./google-calendar-picker"
import type { FormData } from "@/app/types/booking"

interface WorkshopFormProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  calendarAvailability?: { [date: string]: string[] }
}

export default function WorkshopForm({ formData, onChange, calendarAvailability = {} }: WorkshopFormProps) {
  const { t } = useTranslation()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      {/* Workshop Theme */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("booking.workshopTheme", "Workshop-Thema")} *
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => onChange({ workshopTheme: "jazz-improv" })}
            className={`px-4 py-3 rounded-lg border ${
              formData.workshopTheme === "jazz-improv"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors`}
          >
            <div className="text-left">
              <span className="block text-sm font-medium">{t("booking.jazzImprov", "Jazz Improvisation")}</span>
              <span className="text-xs text-gray-400 mt-1 block">
                {t("booking.jazzImprovDesc", "Scat-Gesang & Jazz-Phrasierung")}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ workshopTheme: "vocal-health" })}
            className={`px-4 py-3 rounded-lg border ${
              formData.workshopTheme === "vocal-health"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors`}
          >
            <div className="text-left">
              <span className="block text-sm font-medium">{t("booking.vocalHealth", "Stimmgesundheit")}</span>
              <span className="text-xs text-gray-400 mt-1 block">
                {t("booking.vocalHealthDesc", "Stimmhygiene & Prävention")}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ workshopTheme: "performance" })}
            className={`px-4 py-3 rounded-lg border ${
              formData.workshopTheme === "performance"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors`}
          >
            <div className="text-left">
              <span className="block text-sm font-medium">{t("booking.performance", "Performance Skills")}</span>
              <span className="text-xs text-gray-400 mt-1 block">
                {t("booking.performanceDesc", "Bühnenpräsenz & Ausdruck")}
              </span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Workshop Duration */}
      <motion.div variants={itemVariants}>
        <label htmlFor="workshopDuration" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
          <Clock className="w-4 h-4 mr-1 text-[#C8A97E]" />
          {t("booking.workshopDuration", "Workshop-Dauer")} *
        </label>
        <select
          id="workshopDuration"
          value={formData.workshopDuration || ""}
          onChange={(e) => onChange({ workshopDuration: e.target.value })}
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors appearance-none"
        >
          <option value="">{t("booking.selectOption", "Bitte wählen")}</option>
          <option value="2h">{t("booking.twoHours", "2 Stunden")}</option>
          <option value="4h">{t("booking.fourHours", "4 Stunden")}</option>
          <option value="full-day">{t("booking.fullDay", "Ganztägig (6-8 Stunden)")}</option>
          <option value="multi-day">{t("booking.multiDay", "Mehrtägig (nach Vereinbarung)")}</option>
        </select>
      </motion.div>

      {/* Group Size */}
      <motion.div variants={itemVariants}>
        <label htmlFor="groupSize" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
          <Users className="w-4 h-4 mr-1 text-[#C8A97E]" />
          {t("booking.groupSize", "Gruppengröße")} *
        </label>
        <select
          id="groupSize"
          value={formData.groupSize || ""}
          onChange={(e) => onChange({ groupSize: e.target.value })}
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors appearance-none"
        >
          <option value="">{t("booking.selectOption", "Bitte wählen")}</option>
          <option value="2-5">{t("booking.small", "Klein (2-5 Personen)")}</option>
          <option value="6-10">{t("booking.medium", "Mittel (6-10 Personen)")}</option>
          <option value="11-20">{t("booking.large", "Groß (11-20 Personen)")}</option>
          <option value="20+">{t("booking.extraLarge", "Sehr groß (20+ Personen)")}</option>
        </select>
      </motion.div>

      {/* Preferred Dates */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-[#C8A97E] mr-2" />
          <h3 className="text-sm font-medium text-white">{t("booking.workshopScheduling", "Workshop-Termin")} *</h3>
        </div>

        <div className="bg-[#111]/50 border border-[#C8A97E]/20 rounded-lg p-3">
          <p className="text-xs text-gray-300 mb-3">
            {t(
              "booking.workshopCalendarInfo",
              "Wählen Sie einen Termin für Ihren Workshop. Verfügbare Zeiten basieren auf meinem Kalender.",
            )}
          </p>

          <GoogleCalendarPicker
            onChange={(date, timeSlot) => {
              if (date) {
                // Convert the selected date to a string representation
                const dateStr = date.toISOString().split("T")[0]
                // Store the date in the preferredDates array
                onChange({
                  preferredDates: [dateStr],
                  preferredTime: timeSlot,
                })
              } else {
                onChange({
                  preferredDates: [],
                  preferredTime: undefined,
                })
              }
            }}
            value={
              formData.preferredDates && formData.preferredDates.length > 0
                ? new Date(formData.preferredDates[0])
                : undefined
            }
            selectedTime={formData.preferredTime}
            placeholder={t("booking.selectDatePlaceholder", "Datum auswählen")}
            calendarAvailability={calendarAvailability}
          />
        </div>
      </motion.div>

      {/* Additional Information */}
      <motion.div variants={itemVariants}>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
          <Info className="w-4 h-4 mr-1 text-[#C8A97E]" />
          {t("booking.additionalInfo", "Zusätzliche Informationen")}
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => onChange({ message: e.target.value })}
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors min-h-[80px]"
          placeholder={t("booking.workshopGoals", "Spezifische Wünsche oder Anforderungen für den Workshop")}
        />
      </motion.div>
    </motion.div>
  )
}

