"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Check, AlertCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { ServiceType, FormData } from "@/app/types/booking"

interface ConfirmationStepProps {
  formData: FormData
  serviceType: ServiceType
  onChange: (data: Partial<FormData>) => void
  onSubmit: () => void
  isSubmitting: boolean
}

// Letter animation variants for success message
const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
}

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.2,
      duration: 0.5,
    },
  },
}

// Animated text component for letter-by-letter animation
const AnimatedText = ({ text }: { text: string }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="inline-flex flex-wrap justify-center"
    >
      {text.split(" ").map((word, wordIndex) => (
        <span key={`word-${wordIndex}`} className="whitespace-nowrap mr-1">
          {Array.from(word).map((letter, letterIndex) => (
            <motion.span
              key={`letter-${wordIndex}-${letterIndex}`}
              variants={letterVariants}
              custom={wordIndex * 5 + letterIndex}
              style={{
                display: "inline-block",
                textAlign: "center",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  )
}

export default function ConfirmationStep({
  formData,
  serviceType,
  onChange,
  onSubmit,
  isSubmitting,
}: ConfirmationStepProps) {
  const { t } = useTranslation()
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // Get service name based on type
  const getServiceName = () => {
    switch (serviceType) {
      case "gesangsunterricht":
        return t("booking.jazzWorkshop", "Jazz Workshop")
      case "vocal-coaching":
        return t("booking.vocalCoachingAndGesang", "Vocal Coaching & Gesangsunterricht")
      case "professioneller-gesang":
        return t("booking.liveJazzPerformance", "Live Jazz Performance")
      default:
        return ""
    }
  }

  // Get event type name
  const getEventTypeName = () => {
    switch (formData.eventType) {
      case "wedding":
        return t("booking.wedding", "Hochzeit")
      case "corporate":
        return t("booking.corporate", "Firmenevent")
      case "private":
        return t("booking.private", "Private Feier")
      case "other":
        return t("booking.other", "Sonstiges")
      default:
        return ""
    }
  }

  // Get performance type name
  const getPerformanceTypeName = () => {
    switch (formData.performanceType) {
      case "solo":
        return t("booking.solo", "Solo")
      case "band":
        return t("booking.withBand", "Mit Band")
      default:
        return ""
    }
  }

  // Get session type name
  const getSessionTypeName = () => {
    switch (formData.sessionType) {
      case "1:1":
        return t("booking.privateSession", "Einzelunterricht")
      case "group":
        return t("booking.groupSession", "Gruppenunterricht")
      case "online":
        return t("booking.onlineSession", "Online Coaching")
      default:
        return ""
    }
  }

  // Get skill level name
  const getSkillLevelName = () => {
    switch (formData.skillLevel) {
      case "beginner":
        return t("booking.beginner", "Anfänger")
      case "intermediate":
        return t("booking.intermediate", "Fortgeschritten")
      case "advanced":
        return t("booking.advanced", "Profi")
      default:
        return ""
    }
  }

  // Get workshop theme name
  const getWorkshopThemeName = () => {
    switch (formData.workshopTheme) {
      case "jazz-improv":
        return t("booking.jazzImprov", "Jazz Improvisation")
      case "vocal-health":
        return t("booking.vocalHealth", "Stimmgesundheit")
      case "performance":
        return t("booking.performance", "Performance Skills")
      default:
        return ""
    }
  }

  // Check if all required fields are filled
  const validateForm = () => {
    const missing: string[] = []

    if (!formData.termsAccepted) {
      missing.push(t("booking.termsAndConditions", "AGB"))
    }

    if (!formData.privacyAccepted) {
      missing.push(t("booking.privacyPolicy", "Datenschutzerklärung"))
    }

    setMissingFields(missing)
    return missing.length === 0
  }

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!validateForm()) {
      return
    }

    // Call the onSubmit function passed from parent
    onSubmit()

    // Show success notification
    setShowSuccessNotification(true)

    // Hide success notification after a delay
    setTimeout(() => {
      setShowSuccessNotification(false)
    }, 3000)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div className="bg-[#1A1A1A] rounded-lg p-4 border border-gray-800 shadow-lg">
          {/* Service Type */}
          <div className="mb-4 pb-3 border-b border-gray-800">
            <h4 className="text-base font-medium text-white mb-1">
              {t("booking.selectedService", "Ausgewählter Dienst")}
            </h4>
            <p className="text-[#C8A97E] font-medium">{getServiceName()}</p>
          </div>

          {/* Personal Information */}
          <div className="mb-4 pb-3 border-b border-gray-800">
            <h4 className="text-base font-medium text-white mb-1">
              {t("booking.personalInfo", "Persönliche Informationen")}
            </h4>
            <div className="space-y-1">
              <div>
                <p className="text-gray-400 text-xs">{t("booking.name", "Name")}:</p>
                <p className="text-white">{formData.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">{t("booking.email", "E-Mail")}:</p>
                <p className="text-white">{formData.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">{t("booking.phone", "Telefon")}:</p>
                <p className="text-white">{formData.phone || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Service-specific details */}
          {serviceType === "professioneller-gesang" && (
            <div className="mb-4 pb-3 border-b border-gray-800">
              <h4 className="text-base font-medium text-white mb-1">
                {t("booking.eventDetails", "Veranstaltungsdetails")}
              </h4>
              <div className="space-y-1">
                {formData.eventType && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.eventType", "Art der Veranstaltung")}:</p>
                    <p className="text-white">{getEventTypeName()}</p>
                  </div>
                )}
                {formData.performanceType && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.performanceType", "Auftrittsart")}:</p>
                    <p className="text-white">{getPerformanceTypeName()}</p>
                  </div>
                )}
                {formData.eventDate && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.eventDate", "Datum der Veranstaltung")}:</p>
                    <p className="text-white">{formatDate(formData.eventDate)}</p>
                  </div>
                )}
                {formData.eventTime && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.eventTime", "Uhrzeit")}:</p>
                    <p className="text-white">{formData.eventTime}</p>
                  </div>
                )}
                {formData.guestCount && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.guestCount", "Anzahl der Gäste")}:</p>
                    <p className="text-white">{formData.guestCount}</p>
                  </div>
                )}
                {formData.jazzStandards && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.jazzStandards", "Jazz Standards")}:</p>
                    <p className="text-white">{formData.jazzStandards}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {serviceType === "vocal-coaching" && (
            <div className="mb-4 pb-3 border-b border-gray-800">
              <h4 className="text-base font-medium text-white mb-1">
                {t("booking.sessionDetails", "Session Details")}
              </h4>
              <div className="space-y-1">
                {formData.sessionType && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.sessionType", "Art der Session")}:</p>
                    <p className="text-white">{getSessionTypeName()}</p>
                  </div>
                )}
                {formData.skillLevel && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.skillLevel", "Erfahrungslevel")}:</p>
                    <p className="text-white">{getSkillLevelName()}</p>
                  </div>
                )}
                {formData.focusArea && formData.focusArea.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.focusAreas", "Schwerpunkte")}:</p>
                    <p className="text-white">{formData.focusArea.join(", ")}</p>
                  </div>
                )}
                {formData.preferredDate && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.preferredDate", "Bevorzugtes Datum")}:</p>
                    <p className="text-white">{formatDate(formData.preferredDate)}</p>
                  </div>
                )}
                {formData.preferredTime && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.preferredTime", "Bevorzugte Uhrzeit")}:</p>
                    <p className="text-white">{formData.preferredTime}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {serviceType === "gesangsunterricht" && (
            <div className="mb-4 pb-3 border-b border-gray-800">
              <h4 className="text-base font-medium text-white mb-1">
                {t("booking.workshopDetails", "Workshop Details")}
              </h4>
              <div className="space-y-1">
                {formData.workshopTheme && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.workshopTheme", "Workshop-Thema")}:</p>
                    <p className="text-white">{getWorkshopThemeName()}</p>
                  </div>
                )}
                {formData.groupSize && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.groupSize", "Gruppengröße")}:</p>
                    <p className="text-white">{formData.groupSize}</p>
                  </div>
                )}
                {formData.workshopDuration && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.workshopDuration", "Workshop-Dauer")}:</p>
                    <p className="text-white">{formData.workshopDuration}</p>
                  </div>
                )}
                {formData.preferredDates && formData.preferredDates.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.preferredDate", "Bevorzugtes Datum")}:</p>
                    <p className="text-white">{formatDate(formData.preferredDates[0])}</p>
                  </div>
                )}
                {formData.preferredTime && (
                  <div>
                    <p className="text-gray-400 text-xs">{t("booking.preferredTime", "Bevorzugte Uhrzeit")}:</p>
                    <p className="text-white">{formData.preferredTime}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          {formData.message && (
            <div>
              <h4 className="text-base font-medium text-white mb-1">
                {t("booking.additionalInfo", "Zusätzliche Informationen")}
              </h4>
              <p className="text-white text-sm whitespace-pre-line">{formData.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="pt-2">
        {/* Error message for missing fields */}
        <AnimatePresence>
          {missingFields.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-200 text-sm">
                  {t("booking.acceptTermsError", "Bitte akzeptieren Sie die folgenden Bedingungen:")}
                </p>
                <ul className="list-disc list-inside text-red-300 text-sm mt-1">
                  {missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3 bg-[#121212] rounded-lg p-4 border border-gray-800 shadow-lg">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => onChange({ termsAccepted: e.target.checked })}
                className="w-4 h-4 accent-[#C8A97E] focus:ring-[#C8A97E] focus:ring-2"
                required
              />
            </div>
            <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
              {t("booking.termsAgreement", "Ich akzeptiere die ")}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-[#C8A97E] hover:underline focus:outline-none"
              >
                {t("booking.termsAndConditions", "AGB")}
              </button>
              . *
            </label>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="privacy"
                type="checkbox"
                checked={formData.privacyAccepted}
                onChange={(e) => onChange({ privacyAccepted: e.target.checked })}
                className="w-4 h-4 accent-[#C8A97E] focus:ring-[#C8A97E] focus:ring-2"
                required
              />
            </div>
            <label htmlFor="privacy" className="ml-2 text-sm text-gray-300">
              {t("booking.privacyAgreement", "Ich akzeptiere die ")}
              <button
                type="button"
                onClick={() => setShowPrivacyModal(true)}
                className="text-[#C8A97E] hover:underline focus:outline-none"
              >
                {t("booking.privacyPolicy", "Datenschutzerklärung")}
              </button>
              . *
            </label>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="bg-[#1A1A1A] border border-[#C8A97E] rounded-lg shadow-lg p-6 max-w-md mx-4 flex flex-col items-center text-center"
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-[#C8A97E]/20 flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.2,
                }}
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, duration: 0.3 }}>
                  <Check className="w-8 h-8 text-[#C8A97E]" />
                </motion.div>
              </motion.div>
              <h4 className="text-white font-medium text-xl mb-2">
                <AnimatedText text={t("booking.bookingSuccess", "Buchung erfolgreich!")} />
              </h4>
              <p className="text-gray-300">
                <AnimatedText text={t("booking.bookingSuccessMessage", "Wir werden uns in Kürze bei Ihnen melden.")} />
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#121212] border border-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="text-lg font-medium text-white">{t("booking.termsAndConditions", "AGB")}</h3>
                <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="prose prose-sm prose-invert">
                  <h4>Allgemeine Geschäftsbedingungen</h4>
                  <p>
                    Dies ist ein Platzhaltertext für die AGB. In einer realen Implementierung würden hier die
                    vollständigen AGB stehen.
                  </p>
                  <p>
                    Die AGB regeln die Bedingungen für die Buchung und Durchführung von Gesangsunterricht, Vocal
                    Coaching und Live-Auftritten.
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-800 flex justify-end">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="px-4 py-2 bg-[#C8A97E] text-black rounded-lg"
                >
                  {t("booking.close", "Schließen")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#121212] border border-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="text-lg font-medium text-white">{t("booking.privacyPolicy", "Datenschutzerklärung")}</h3>
                <button onClick={() => setShowPrivacyModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="prose prose-sm prose-invert">
                  <h4>Datenschutzerklärung</h4>
                  <p>
                    Dies ist ein Platzhaltertext für die Datenschutzerklärung. In einer realen Implementierung würde
                    hier die vollständige Datenschutzerklärung stehen.
                  </p>
                  <p>
                    Die Datenschutzerklärung informiert über die Erhebung, Verarbeitung und Nutzung personenbezogener
                    Daten im Rahmen der Buchung und Durchführung von Gesangsunterricht, Vocal Coaching und
                    Live-Auftritten.
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-gray-800 flex justify-end">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-4 py-2 bg-[#C8A97E] text-black rounded-lg"
                >
                  {t("booking.close", "Schließen")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

