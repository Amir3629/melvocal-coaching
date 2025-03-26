"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, Music, Calendar, FileText } from 'lucide-react'

// Form step type
type FormStep = 'service' | 'details' | 'confirm' | number

interface ProgressBarProps {
  currentStep: FormStep;
  totalSteps?: number;
  labels?: string[];
}

export default function ProgressBar({ currentStep, totalSteps = 3, labels }: ProgressBarProps) {
  const { t } = useTranslation()
  
  return (
    <div className="max-w-4xl mx-auto mb-6 sm:mb-8 relative px-4 sm:px-6">
      <div className="flex justify-between items-center">
        {/* Step 1: Service */}
        <div className="flex flex-col items-center relative z-10">
          <motion.div 
            initial={false}
            animate={{
              backgroundColor: currentStep === 'service' 
                ? '#C8A97E' 
                : (currentStep === 'details' || currentStep === 'confirm') 
                  ? '#2A2A2A' 
                  : '#2A2A2A',
              borderColor: (currentStep === 'details' || currentStep === 'confirm')
                ? '#C8A97E'
                : currentStep === 'service'
                  ? 'transparent'
                  : '#4B5563',
              scale: currentStep === 'service' ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3 border-2"
          >
            {currentStep === 'details' || currentStep === 'confirm' ? (
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8A97E]" />
            ) : (
              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-center" style={{ color: currentStep === 'service' ? '#000000' : '#FFFFFF' }} />
            )}
          </motion.div>
          <motion.span 
            initial={false}
            animate={{
              color: currentStep === 'service' 
                ? '#C8A97E' 
                : (currentStep === 'details' || currentStep === 'confirm')
                  ? '#D1D5DB'
                  : '#9CA3AF'
            }}
            transition={{ duration: 0.3 }}
            className="text-sm sm:text-base font-medium whitespace-nowrap text-center"
          >
            {t('booking.dienst', 'Dienst')}
          </motion.span>
        </div>
        
        {/* Connector */}
        <div className="flex-1 h-1 sm:h-1.5 mx-2 sm:mx-4 bg-gray-800 relative z-0 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#C8A97E]"
            initial={{ width: '0%' }}
            animate={{ 
              width: 
                currentStep === 'service' ? '0%' : 
                currentStep === 'details' ? '100%' : 
                '100%'
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Step 2: Details */}
        <div className="flex flex-col items-center relative z-10">
          <motion.div 
            initial={false}
            animate={{
              backgroundColor: currentStep === 'details' 
                ? '#C8A97E' 
                : currentStep === 'confirm'
                  ? '#2A2A2A' 
                  : '#2A2A2A',
              borderColor: currentStep === 'confirm'
                ? '#C8A97E'
                : currentStep === 'details'
                  ? 'transparent'
                  : '#4B5563',
              scale: currentStep === 'details' ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3 border-2"
          >
            {currentStep === 'confirm' ? (
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-[#C8A97E]" />
            ) : (
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-center" style={{ color: currentStep === 'details' ? '#000000' : '#FFFFFF' }} />
            )}
          </motion.div>
          <motion.span 
            initial={false}
            animate={{
              color: currentStep === 'details' 
                ? '#C8A97E' 
                : currentStep === 'confirm'
                  ? '#D1D5DB'
                  : '#9CA3AF'
            }}
            transition={{ duration: 0.3 }}
            className="text-sm sm:text-base font-medium whitespace-nowrap text-center"
          >
            {t('booking.details', 'Details')}
          </motion.span>
        </div>
        
        {/* Connector */}
        <div className="flex-1 h-1 sm:h-1.5 mx-2 sm:mx-4 bg-gray-800 relative z-0 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#C8A97E]"
            initial={{ width: '0%' }}
            animate={{ width: currentStep === 'confirm' ? '100%' : '0%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Step 3: Confirmation */}
        <div className="flex flex-col items-center relative z-10">
          <motion.div 
            initial={false}
            animate={{
              backgroundColor: currentStep === 'confirm' 
                ? '#C8A97E' 
                : '#2A2A2A',
              borderColor: currentStep === 'confirm'
                ? 'transparent'
                : '#4B5563',
              scale: currentStep === 'confirm' ? 1.05 : 1
            }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 sm:mb-3 border-2"
          >
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-center" style={{ color: currentStep === 'confirm' ? '#000000' : '#FFFFFF' }} />
          </motion.div>
          <motion.span 
            initial={false}
            animate={{
              color: currentStep === 'confirm' 
                ? '#C8A97E' 
                : '#9CA3AF'
            }}
            transition={{ duration: 0.3 }}
            className="text-sm sm:text-base font-medium whitespace-nowrap text-center"
          >
            {t('booking.confirm', 'Bestätigen')}
          </motion.span>
        </div>
      </div>
    </div>
  )
} 