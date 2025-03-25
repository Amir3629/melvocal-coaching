"use client"
import { useTranslation } from "react-i18next"
import { BarChart, Target, Info, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import GoogleCalendarPicker from "./google-calendar-picker"
import type { FormData } from "@/app/types/booking"

interface VocalCoachingFormProps {
  formData: FormData
  onChange: (data: Partial<FormData>) => void
  calendarAvailability?: { [date: string]: string[] }
}

export default function VocalCoachingForm({ formData, onChange, calendarAvailability = {} }: VocalCoachingFormProps) {
  const { t } = useTranslation()

  // Handle checkbox changes for focus areas
  const handleFocusAreaChange = (area: string) => {
    const currentAreas = formData.focusArea || []

    if (currentAreas.includes(area)) {
      // Remove area if already selected
      onChange({
        focusArea: currentAreas.filter((a) => a !== area),
      })
    } else {
      // Add area if not already selected
      onChange({
        focusArea: [...currentAreas, area],
      })
    }
  }

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
      {/* Session Type */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t("booking.sessionType", "Art der Session")} *
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => onChange({ sessionType: "1:1" })}
            className={`px-4 py-3 rounded-lg border ${
              formData.sessionType === "1:1"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors`}
          >
            <div className="text-left">
              <span className="block text-sm font-medium">1:1 {t("booking.privateSession", "Einzelunterricht")}</span>
              <span className="text-xs text-gray-400 mt-1 block">
                {t("booking.personalizedCoaching", "Personalisiertes Coaching")}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ sessionType: "group" })}
            className={`px-4 py-3 rounded-lg border ${
              formData.sessionType === "group"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors`}
          >
            <div className="text-left">
              <span className="block text-sm font-medium">{t("booking.groupSession", "Gruppenunterricht")}</span>
              <span className="text-xs text-gray-400 mt-1 block">
                {t("booking.learnWithOthers", "Lernen in der Gruppe")}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ sessionType: "online" })}
            className={`px-4 py-3 rounded-lg border ${
              formData.sessionType === "online"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors`}
          >
            <div className="text-left">
              <span className="block text-sm font-medium">{t("booking.onlineSession", "Online Coaching")}</span>
              <span className="text-xs text-gray-400 mt-1 block">
                {t("booking.remoteTraining", "Fernunterricht via Video")}
              </span>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Skill Level */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
          <BarChart className="w-4 h-4 mr-1 text-[#C8A97E]" />
          {t("booking.skillLevel", "Erfahrungslevel")} *
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onChange({ skillLevel: "beginner" })}
            className={`px-3 py-2 rounded-lg border ${
              formData.skillLevel === "beginner"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors text-sm`}
          >
            {t("booking.beginner", "Anfänger")}
          </button>

          <button
            type="button"
            onClick={() => onChange({ skillLevel: "intermediate" })}
            className={`px-3 py-2 rounded-lg border ${
              formData.skillLevel === "intermediate"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors text-sm`}
          >
            {t("booking.intermediate", "Fortgeschritten")}
          </button>

          <button
            type="button"
            onClick={() => onChange({ skillLevel: "advanced" })}
            className={`px-3 py-2 rounded-lg border ${
              formData.skillLevel === "advanced"
                ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white"
                : "border-gray-700 text-gray-400 hover:border-gray-600"
            } transition-colors text-sm`}
          >
            {t("booking.advanced", "Profi")}
          </button>
        </div>
      </motion.div>

      {/* Focus Areas */}
      <motion.div variants={itemVariants}>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
          <Target className="w-4 h-4 mr-1 text-[#C8A97E]" />
          {t("booking.focusAreas", "Schwerpunkte")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="range"
              checked={formData.focusArea?.includes("range") || false}
              onChange={() => handleFocusAreaChange("range")}
              className="w-4 h-4 mr-2 accent-[#C8A97E]"
            />
            <label htmlFor="range" className="text-gray-300 text-sm">
              {t("booking.vocalRange", "Stimmumfang")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="breath"
              checked={formData.focusArea?.includes("breath") || false}
              onChange={() => handleFocusAreaChange("breath")}
              className="w-4 h-4 mr-2 accent-[#C8A97E]"
            />
            <label htmlFor="breath" className="text-gray-300 text-sm">
              {t("booking.breathControl", "Atemkontrolle")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="technique"
              checked={formData.focusArea?.includes("technique") || false}
              onChange={() => handleFocusAreaChange("technique")}
              className="w-4 h-4 mr-2 accent-[#C8A97E]"
            />
            <label htmlFor="technique" className="text-gray-300 text-sm">
              {t("booking.technique", "Technik")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="stage"
              checked={formData.focusArea?.includes("stage") || false}
              onChange={() => handleFocusAreaChange("stage")}
              className="w-4 h-4 mr-2 accent-[#C8A97E]"
            />
            <label htmlFor="stage" className="text-gray-300 text-sm">
              {t("booking.stagePresence", "Bühnenpräsenz")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="style"
              checked={formData.focusArea?.includes("style") || false}
              onChange={() => handleFocusAreaChange("style")}
              className="w-4 h-4 mr-2 accent-[#C8A97E]"
            />
            <label htmlFor="style" className="text-gray-300 text-sm">
              {t("booking.style", "Stilentwicklung")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="interpretation"
              checked={formData.focusArea?.includes("interpretation") || false}
              onChange={() => handleFocusAreaChange("interpretation")}
              className="w-4 h-4 mr-2 accent-[#C8A97E]"
            />
            <label htmlFor="interpretation" className="text-gray-300 text-sm">
              {t("booking.interpretation", "Interpretation")}
            </label>
          </div>
        </div>
      </motion.div>

      {/* Preferred Date and Time */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-[#C8A97E] mr-2" />
          <h3 className="text-sm font-medium text-white">{t("booking.calendarIntegration", "Terminplanung")} *</h3>
        </div>

        <div className="bg-[#111]/50 border border-[#C8A97E]/20 rounded-lg p-3">
          <p className="text-xs text-gray-300 mb-3">
            {t(
              "booking.googleCalendarInfo",
              "Wählen Sie einen Termin für Ihre Vocal Coaching Session. Verfügbare Zeiten basieren auf meinem Kalender.",
            )}
          </p>

          <GoogleCalendarPicker
            onChange={(date, timeSlot) => {
              if (date) {
                onChange({
                  preferredDate: date.toISOString().split("T")[0],
                  preferredTime: timeSlot,
                })
              } else {
                onChange({
                  preferredDate: undefined,
                  preferredTime: undefined,
                })
              }
            }}
            value={formData.preferredDate ? new Date(formData.preferredDate) : undefined}
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
          placeholder={t("booking.coachingGoals", "Ihre Ziele und Erwartungen an das Coaching")}
        />
      </motion.div>
    </motion.div>
  )
}

