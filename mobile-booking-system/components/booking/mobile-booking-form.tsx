"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import ServiceSelection from "./service-selection"
import PersonalInfoStep from "./personal-info-step"
import LiveSingingForm from "./live-singing-form"
import VocalCoachingForm from "./vocal-coaching-form"
import WorkshopForm from "./workshop-form"
import ConfirmationStep from "./confirmation-step"
import MobileProgressBar from "./mobile-progress-bar"
import type { ServiceType, FormData } from "@/app/types/booking"
import { fetchGoogleCalendarAvailability } from "@/lib/google-calendar"

interface MobileBookingFormProps {
  isOpen: boolean
  onClose: () => void
  initialService?: ServiceType
}

export default function MobileBookingForm({ isOpen, onClose, initialService }: MobileBookingFormProps) {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedService, setSelectedService] = useState<ServiceType>(initialService || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calendarAvailability, setCalendarAvailability] = useState<{ [date: string]: string[] }>({})

  // Initialize form data with empty values
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
    termsAccepted: false,
    privacyAccepted: false,
  })

  // Fetch Google Calendar availability when component mounts
  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        const availability = await fetchGoogleCalendarAvailability()
        setCalendarAvailability(availability)
      } catch (error) {
        console.error("Failed to fetch calendar availability:", error)
      }
    }

    if (isOpen) {
      loadCalendarData()
    }
  }, [isOpen])

  // Handle service selection
  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service)
  }

  // Handle form data changes
  const handleFormChange = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data })
  }

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      // Scroll to top when changing steps
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      // Scroll to top when changing steps
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Here you would integrate with your backend to save the booking
      // and create the Google Calendar event

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message and close form
      setIsSubmitting(false)
      onClose()

      // Reset form for next use
      setCurrentStep(0)
      setSelectedService(null)
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        termsAccepted: false,
        privacyAccepted: false,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setIsSubmitting(false)
    }
  }

  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return t("booking.selectService", "Dienst auswählen")
      case 1:
        return t("booking.personalInfo", "Persönliche Informationen")
      case 2:
        return t("booking.serviceDetails", "Details zum Dienst")
      case 3:
        return t("booking.confirmation", "Bestätigung")
      default:
        return ""
    }
  }

  // Convert step number to step string for progress bars
  const getStepIdentifier = (): "service" | "details" | "confirm" => {
    if (currentStep === 0) return "service"
    if (currentStep === 1 || currentStep === 2) return "details"
    return "confirm"
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ServiceSelection selectedService={selectedService} onSelect={handleServiceSelect} />
      case 1:
        return <PersonalInfoStep formData={formData} onChange={handleFormChange} />
      case 2:
        switch (selectedService) {
          case "professioneller-gesang":
            return (
              <LiveSingingForm
                formData={formData}
                onChange={handleFormChange}
                calendarAvailability={calendarAvailability}
              />
            )
          case "vocal-coaching":
            return (
              <VocalCoachingForm
                formData={formData}
                onChange={handleFormChange}
                calendarAvailability={calendarAvailability}
              />
            )
          case "gesangsunterricht":
            return (
              <WorkshopForm
                formData={formData}
                onChange={handleFormChange}
                calendarAvailability={calendarAvailability}
              />
            )
          default:
            return null
        }
      case 3:
        return (
          <ConfirmationStep
            formData={formData}
            serviceType={selectedService}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )
      default:
        return null
    }
  }

  // Check if the current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return !!selectedService
      case 1:
        return !!formData.name && !!formData.email && !!formData.phone
      case 2:
        // Basic validation for service-specific forms
        if (selectedService === "professioneller-gesang") {
          return !!formData.eventType && !!formData.eventDate
        } else if (selectedService === "vocal-coaching") {
          return !!formData.sessionType && !!formData.skillLevel && !!formData.preferredDate
        } else if (selectedService === "gesangsunterricht") {
          return !!formData.workshopTheme && !!formData.groupSize && formData.preferredDates?.length > 0
        }
        return false
      case 3:
        return formData.termsAccepted && formData.privacyAccepted
      default:
        return false
    }
  }

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] } },
    exit: { opacity: 0, y: 50, transition: { duration: 0.3 } },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg mx-auto my-4 bg-[#121212] rounded-xl shadow-xl overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">
                {selectedService === "professioneller-gesang"
                  ? t("booking.livePerformanceTitle", "Live Gesang buchen")
                  : selectedService === "vocal-coaching"
                    ? t("booking.vocalCoachingTitle", "Gesangsunterricht buchen")
                    : selectedService === "gesangsunterricht"
                      ? t("booking.workshopTitle", "Jazz Workshop buchen")
                      : t("booking.bookAppointment", "Termin buchen")}
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Bar */}
            <MobileProgressBar
              currentStep={getStepIdentifier()}
              totalSteps={4}
              labels={[
                t("booking.service", "Dienst"),
                t("booking.personal", "Persönlich"),
                t("booking.details", "Details"),
                t("booking.confirm", "Bestätigen"),
              ]}
            />

            {/* Content */}
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-white">{getStepTitle()}</h3>
              </div>

              <div className="mb-6">{renderStep()}</div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#222] transition-colors border border-gray-700"
                  >
                    {t("booking.back", "Zurück")}
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={!isStepValid()}
                    className={`px-4 py-2 bg-[#C8A97E] text-black font-medium rounded-lg transition-colors ${
                      !isStepValid() ? "opacity-50 cursor-not-allowed" : "hover:bg-[#D4AF37]"
                    }`}
                  >
                    {t("booking.next", "Weiter")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isStepValid() || isSubmitting}
                    className={`px-4 py-2 bg-[#C8A97E] text-black font-medium rounded-lg transition-colors flex items-center ${
                      !isStepValid() || isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#D4AF37]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {t("booking.submitting", "Wird gesendet...")}
                      </>
                    ) : (
                      t("booking.submit", "Absenden")
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

