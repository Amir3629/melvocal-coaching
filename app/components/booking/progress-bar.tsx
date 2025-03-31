"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const { t } = useTranslation()

  const steps = [
    { id: 0, label: t('booking.selectService', 'Dienst') },
    { id: 1, label: t('booking.personalInfo', 'Info') },
    { id: 2, label: t('booking.serviceDetails', 'Details') },
    { id: 3, label: t('booking.confirmation', 'Bestätigung') },
  ]
  
  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0 mb-8">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-800">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#C8A97E]"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
          <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                  index <= currentStep
                    ? 'bg-[#C8A97E] text-black'
                    : 'bg-[#1A1A1A] border border-gray-800 text-gray-400'
                }`}
            initial={false}
            animate={{
                  scale: index === currentStep ? 1.1 : 1,
                  transition: { duration: 0.2 }
                }}
              >
                {index < currentStep ? (
                  <Check className="w-4 h-4" />
            ) : (
                  <span className="text-sm font-medium">{step.id + 1}</span>
            )}
          </motion.div>
              <span
                className={`mt-2 text-xs sm:text-sm font-medium ${
                  index <= currentStep ? 'text-white' : 'text-gray-400'
                }`}
          >
                {step.label}
              </span>
        </div>
          ))}
        </div>
      </div>
    </div>
  )
} 