"use client"

import React from "react"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Check } from "lucide-react"

// Define the type for form steps
type FormStep = "service" | "details" | "confirm"

// Props for the MobileProgressBar component
interface MobileProgressBarProps {
  currentStep: FormStep
  totalSteps: number
  labels: string[]
}

export default function MobileProgressBar({ currentStep, totalSteps, labels }: MobileProgressBarProps) {
  const { t } = useTranslation()

  // Check if a step is completed
  const isCompleted = (step: string): boolean => {
    if (step === "service") {
      return currentStep !== "service"
    } else if (step === "details") {
      return currentStep === "confirm"
    }
    return false
  }

  // Check if a step is active
  const isActive = (step: string): boolean => {
    return currentStep === step
  }

  // Define step data for rendering
  const steps = [
    {
      id: "service",
      name: t("booking.service", "Dienst"),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
    },
    {
      id: "details",
      name: t("booking.details", "Details"),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: "confirm",
      name: t("booking.confirm", "Bestätigen"),
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  ]

  return (
    <div className="px-4 py-3 bg-[#0A0A0A] border-b border-gray-800">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted(step.id) ? "#C8A97E" : isActive(step.id) ? "#1f2937" : "#111827",
                  borderColor: isCompleted(step.id) ? "#C8A97E" : isActive(step.id) ? "#C8A97E" : "#374151",
                  scale: isActive(step.id) ? 1.1 : 1,
                }}
                className="h-8 w-8 rounded-full border-2 flex items-center justify-center shadow-md mb-1"
                transition={{ duration: 0.2 }}
              >
                {isCompleted(step.id) ? (
                  <Check className="h-4 w-4 text-black" />
                ) : (
                  <div className={`${isActive(step.id) ? "text-[#C8A97E]" : "text-gray-400"}`}>{step.icon}</div>
                )}
              </motion.div>

              {/* Step label */}
              <motion.span
                initial={false}
                animate={{
                  color: isActive(step.id) ? "#C8A97E" : isCompleted(step.id) ? "#d1d5db" : "#9ca3af",
                }}
                className="text-xs font-medium"
                transition={{ duration: 0.2 }}
              >
                {step.name}
              </motion.span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 relative">
                <motion.div
                  initial={false}
                  animate={{
                    width: (() => {
                      if (isCompleted(step.id) && isCompleted(steps[index + 1].id)) return "100%"
                      if (isCompleted(step.id) && isActive(steps[index + 1].id)) return "100%"
                      if (isActive(step.id) && steps[index + 1].id === "details") return "0%"
                      if (isActive(step.id) && steps[index + 1].id === "confirm") return "0%"
                      return "0%"
                    })(),
                  }}
                  className="absolute inset-0 bg-[#C8A97E]"
                  transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gray-700" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

