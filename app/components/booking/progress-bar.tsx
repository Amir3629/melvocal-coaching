"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, FileText } from 'lucide-react'

// Form step type
type FormStep = 'service' | 'details' | 'confirm'

interface ProgressBarProps {
  currentStep: FormStep;
  totalSteps?: number;
  labels?: string[];
}

export default function ProgressBar({ currentStep, labels }: ProgressBarProps) {
  const { t } = useTranslation()
  
  const steps = [
    {
      id: 'service',
      label: labels?.[0] || t('booking.dienst', 'Dienst'),
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L10.6667 14.6667H13.3333L12 4Z" fill="currentColor"/>
        <path d="M7.33333 9.33333L6 20H8.66667L7.33333 9.33333Z" fill="currentColor"/>
        <path d="M16.6667 9.33333L15.3333 20H18L16.6667 9.33333Z" fill="currentColor"/>
      </svg>
    },
    {
      id: 'details',
      label: labels?.[1] || t('booking.details', 'Details'),
      icon: <FileText className="w-6 h-6" />
    },
    {
      id: 'confirm',
      label: labels?.[2] || t('booking.confirm', 'Bestätigen'),
      icon: <Check className="w-6 h-6" />
    }
  ]

  return (
    <div className="flex justify-between items-center max-w-md mx-auto px-4 py-2">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step */}
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                color: currentStep === step.id 
                  ? '#C8A97E' 
                  : (steps.findIndex(s => s.id === currentStep) > steps.findIndex(s => s.id === step.id))
                    ? '#C8A97E'
                    : '#4B5563',
                scale: currentStep === step.id ? 1.1 : 1
              }}
              className="mb-1"
            >
              {step.icon}
            </motion.div>
            <span className="text-xs text-gray-400">
              {step.label}
            </span>
          </div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <motion.div 
              className="h-[2px] flex-1 mx-2"
              animate={{
                backgroundColor: steps.findIndex(s => s.id === currentStep) > index 
                  ? '#C8A97E' 
                  : '#4B5563'
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
} 