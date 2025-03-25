"use client"
import { useTranslation } from "react-i18next"
import { Calendar, Users, Music, Info } from "lucide-react"
import { motion } from "framer-motion"
import GoogleCalendarPicker from "./google-calendar-picker"
import type { FormData } from "@/app/types/booking"

interface LiveSingingFormProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  calendarAvailability?: { [date: string]: string[] }
}

export default function LiveSingingForm({ formData, onChange, calendarAvailability = {} }: LiveSingingFormProps) {
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
      {/* Event Type */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("booking.eventType", "Art der Veranstaltung")} *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ eventType: "wedding" })}
            className={`px-3 py-2 rounded-lg border ${
              formData.eventType === "wedding"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors text-sm`}
          >
            {t("booking.wedding", "Hochzeit")}
          </button>

          <button
            type="button"
            onClick={() => onChange({ eventType: "corporate" })}
            className={`px-3 py-2 rounded-lg border ${
              formData.eventType === "corporate"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors text-sm`}
          >
            {t("booking.corporate", "Firmenevent")}
          </button>

          <button
            type="button"
            onClick={() => onChange({ eventType: "private" })}
            className={`px-3 py-2 rounded-lg border ${
              formData.eventType === "private"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors text-sm`}
          >
            {t("booking.private", "Private Feier")}
          </button>

          <button
            type="button"
            onClick={() => onChange({ eventType: "other" })}
            className={`px-3 py-2 rounded-lg border ${
              formData.eventType === "other"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors text-sm`}
          >
            {t("booking.other", "Sonstiges")}
          </button>
        </div>
      </motion.div>

      {/* Performance Type: Solo or Band */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("booking.performanceType", "Auftrittsart")} *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onChange({ performanceType: "solo" })}
            className={`px-3 py-2 rounded-lg border ${
              formData.performanceType === "solo"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors text-sm`}
          >
            {t("booking.solo", "Solo")}
          </button>

          <button
            type="button"
            onClick={() => onChange({ performanceType: "band" })}
            className={`px-3 py-2 rounded-lg border ${
              formData.performanceType === "band"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors text-sm`}
          >
            {t("booking.withBand", "Mit Band")}
          </button>
        </div>
      </motion.div>

      {/* Event Date */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-[#C8A97E] mr-2" />
          <h3 className="text-sm font-medium text-white">{t("booking.eventScheduling", "Veranstaltungstermin")} *</h3>
        </div>

        <div className="bg-[#111]/50 border border-[#C8A97E]/20 rounded-lg p-3">
          <p className="text-xs text-gray-300 mb-3">
            {t(
              "booking.livePerformanceCalendarInfo",
              "Wählen Sie ein Datum für Ihre Veranstaltung. Prüfen Sie meine Verfügbarkeit direkt im Kalender.",
            )}
          </p>

          <GoogleCalendarPicker
            onChange={(date, timeSlot) => {
              if (date) {
                onChange({
                  eventDate: date.toISOString().split("T")[0],
                  eventTime: timeSlot,
                })
              } else {
                onChange({
                  eventDate: undefined,
                  eventTime: undefined,
                })
              }
            }}
            value={formData.eventDate ? new Date(formData.eventDate) : undefined}
            selectedTime={formData.eventTime}
            placeholder={t("booking.selectDatePlaceholder", "Datum auswählen")}
            calendarAvailability={calendarAvailability}
          />
        </div>
      </motion.div>

      {/* Guest Count */}
      <motion.div variants={itemVariants}>
        <label htmlFor="guestCount" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
          <Users className="w-4 h-4 mr-1 text-[#C8A97E]" />
          {t("booking.guestCount", "Anzahl der Gäste")}
        </label>
        <select
          id="guestCount"
          value={formData.guestCount || ""}
          onChange={(e) => onChange({ guestCount: e.target.value })}
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors appearance-none"
        >
          <option value="">{t("booking.selectOption", "Bitte wählen")}</option>
          <option value="1-50">1-50</option>
          <option value="51-100">51-100</option>
          <option value="101-150">101-150</option>
          <option value="150+">150+</option>
        </select>
      </motion.div>

      {/* Jazz Standards */}
      <motion.div variants={itemVariants}>
        <label htmlFor="jazzStandards" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
          <Music className="w-4 h-4 mr-1 text-[#C8A97E]" />
          {t("booking.jazzStandards", "Jazz Standards")}
        </label>
        <textarea
          id="jazzStandards"
          value={formData.jazzStandards || ""}
          onChange={(e) => onChange({ jazzStandards: e.target.value })}
          className="w-full px-4 py-3 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors min-h-[80px]"
          placeholder={t(
            "booking.jazzStandardsPlaceholder",
            'Spezifische Jazz Standards oder Songs, die Sie hören möchten (z.B. "Fly Me To The Moon", "Autumn Leaves", etc.)',
          )}
        />
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
          placeholder={t("booking.additionalInfoPlaceholder", "Besondere Wünsche oder Anforderungen")}
        />
      </motion.div>
    </motion.div>
  )
}

