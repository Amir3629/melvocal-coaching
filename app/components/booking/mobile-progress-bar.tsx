"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CheckIcon } from '@heroicons/react/24/solid'

// Define the type for form steps
type FormStep = 'service' | 'details' | 'confirm'

// Props for the MobileProgressBar component
interface MobileProgressBarProps {
  currentStep: FormStep
  totalSteps: number
  labels: string[]
}

export default function MobileProgressBar({ 
  currentStep,
  totalSteps,
  labels 
}: MobileProgressBarProps) {
  const { t } = useTranslation()
  
  // Check if a step is completed
  const isCompleted = (step: string): boolean => {
    if (step === 'service') {
      return currentStep !== 'service'
    } else if (step === 'details') {
      return currentStep === 'confirm'
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
      id: 'service',
      name: t('booking.service', 'Dienst'),
      description: t('booking.selectService', 'Dienst auswählen'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'details',
      name: t('booking.details', 'Details'),
      description: t('booking.enterDetails', 'Details eingeben'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'confirm',
      name: t('booking.confirm', 'Bestätigen'),
      description: t('booking.confirmation', 'Bestätigung'),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
  ]

  return (
    <div className="sm:hidden mb-6 px-2 py-4 bg-[#121212] border border-gray-800 rounded-xl">
      <div className="space-y-5">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Connect lines between steps */}
            {index < steps.length - 1 && (
              <div 
                className="absolute left-4 top-10 h-full w-0.5 -ml-px" 
                style={{
                  background: `linear-gradient(to bottom, 
                    ${isCompleted(step.id) ? '#C8A97E' : '#374151'} 0%, 
                    ${isCompleted(steps[index + 1].id) ? '#C8A97E' : '#374151'} 100%)`
                }}
              />
            )}
            
            <div className="relative flex items-start group">
              {/* Step circle */}
              <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted(step.id) 
                      ? '#C8A97E' 
                      : isActive(step.id) 
                        ? '#1f2937' 
                        : '#111827',
                    borderColor: isCompleted(step.id) 
                      ? '#C8A97E' 
                      : isActive(step.id) 
                        ? '#C8A97E' 
                        : '#374151',
                    scale: isActive(step.id) ? 1.1 : 1
                  }}
                  className="h-8 w-8 rounded-full border-2 flex items-center justify-center shadow-md"
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted(step.id) ? (
                    <CheckIcon className="h-5 w-5 text-black" />
                  ) : (
                    <div className={`${isActive(step.id) ? 'text-[#C8A97E]' : 'text-gray-400'}`}>
                      {step.icon}
                    </div>
                  )}
                </motion.div>
              </div>
              
              {/* Step text */}
              <div className="ml-4 pt-0.5">
                <motion.div
                  initial={false}
                  animate={{
                    color: isCompleted(step.id) 
                      ? '#d1d5db' 
                      : isActive(step.id) 
                        ? '#C8A97E' 
                        : '#9ca3af'
                  }}
                  className="text-sm font-medium"
                  transition={{ duration: 0.2 }}
                >
                  {step.name}
                </motion.div>
                <motion.div
                  initial={false}
                  animate={{
                    color: isActive(step.id) ? '#d1d5db' : '#6b7280'
                  }}
                  className="text-xs"
                  transition={{ duration: 0.2 }}
                >
                  {step.description}
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
