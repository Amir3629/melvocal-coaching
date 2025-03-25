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
}

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  const { t } = useTranslation()
  
  const steps = [
    {
      id: 'service',
      label: t('booking.dienst', 'Dienst'),
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4L10.6667 14.6667H13.3333L12 4Z" fill="currentColor"/>
        <path d="M7.33333 9.33333L6 20H8.66667L7.33333 9.33333Z" fill="currentColor"/>
        <path d="M16.6667 9.33333L15.3333 20H18L16.6667 9.33333Z" fill="currentColor"/>
      </svg>
    },
    {
      id: 'details',
      label: t('booking.details', 'Details'),
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    },
    {
      id: 'confirm',
      label: t('booking.confirm', 'Bestätigen'),
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
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