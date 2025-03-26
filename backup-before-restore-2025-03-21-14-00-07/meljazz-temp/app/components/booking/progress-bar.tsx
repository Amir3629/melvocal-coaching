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
    <div className="max-w-4xl mx-auto mb-6 relative">
      <div className="flex justify-between items-center">
        {/* Step 1: Service */}
        <div className="flex flex-col items-center relative z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
            currentStep === 'service' 
              ? 'bg-[#C8A97E] text-black' 
              : currentStep === 'details' || currentStep === 'confirm'
                ? 'bg-[#2A2A2A] text-[#C8A97E] border border-[#C8A97E]'
                : 'bg-[#2A2A2A] text-white'
          }`}>
            {currentStep === 'details' || currentStep === 'confirm' ? (
              <Check size={18} className="text-[#C8A97E]" />
            ) : (
              <Music size={18} />
            )}
          </div>
          <span className={`text-sm ${
            currentStep === 'service' ? 'text-[#C8A97E] font-medium' : 'text-gray-400'
          }`}>
            {t('booking.dienst', 'Dienst')}
          </span>
        </div>
        
        {/* Connector */}
        <div className="flex-1 h-0.5 mx-2 bg-gray-800 relative z-0">
          <motion.div 
            className="h-full bg-[#C8A97E]"
            initial={{ width: '0%' }}
            animate={{ width: currentStep === 'service' ? '0%' : currentStep === 'details' ? '50%' : '100%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Step 2: Details */}
        <div className="flex flex-col items-center relative z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
            currentStep === 'details' 
              ? 'bg-[#C8A97E] text-black' 
              : currentStep === 'confirm'
                ? 'bg-[#2A2A2A] text-[#C8A97E] border border-[#C8A97E]'
                : 'bg-[#2A2A2A] text-gray-500'
          }`}>
            {currentStep === 'confirm' ? (
              <Check size={18} className="text-[#C8A97E]" />
            ) : (
              <Calendar size={18} />
            )}
          </div>
          <span className={`text-sm ${
            currentStep === 'details' ? 'text-[#C8A97E] font-medium' : 'text-gray-400'
          }`}>
            {t('booking.details', 'Details')}
          </span>
        </div>
        
        {/* Connector */}
        <div className="flex-1 h-0.5 mx-2 bg-gray-800 relative z-0">
          <motion.div 
            className="h-full bg-[#C8A97E]"
            initial={{ width: '0%' }}
            animate={{ width: currentStep === 'confirm' ? '100%' : '0%' }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Step 3: Confirmation */}
        <div className="flex flex-col items-center relative z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
            currentStep === 'confirm' 
              ? 'bg-[#C8A97E] text-black' 
              : 'bg-[#2A2A2A] text-gray-500'
          }`}>
            <FileText size={18} />
          </div>
          <span className={`text-sm ${
            currentStep === 'confirm' ? 'text-[#C8A97E] font-medium' : 'text-gray-400'
          }`}>
            {t('booking.confirm', 'Bestätigen')}
          </span>
        </div>
      </div>
    </div>
  )
} 