"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

// Types
type FormStep = 'service' | 'details' | 'confirm' | number

interface MobileProgressBarProps {
  currentStep: FormStep;
  totalSteps: number;
  labels?: string[];
  onStepClick?: (step: number) => void;
}

// Reusable step button component
const StepButton = ({ 
  step, 
  currentStep, 
  label, 
  onClick 
}: { 
  step: number; 
  currentStep: FormStep; 
  label: string; 
  onClick?: () => void; 
}) => {
  const isActive = currentStep === step || 
                  (typeof currentStep === 'string' && 
                   (currentStep === 'service' && step === 0) || 
                   (currentStep === 'details' && step === 1) || 
                   (currentStep === 'confirm' && step === 2));
  
  const isCompleted = typeof currentStep === 'number' 
    ? currentStep > step 
    : (currentStep === 'details' && step === 0) || 
      (currentStep === 'confirm' && (step === 0 || step === 1));

  return (
    <button 
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center
        ${isActive || isCompleted ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}
      `}
      role="button"
      tabIndex={0}
    >
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center mb-1
        transition-all duration-300
        ${isActive 
          ? 'bg-[#C8A97E] text-black' 
          : isCompleted
            ? 'bg-[#2A2A2A] text-[#C8A97E] border border-[#C8A97E]'
            : 'bg-[#2A2A2A] text-gray-500'
        }
      `}>
        {isCompleted ? (
          <Check size={16} className="text-[#C8A97E]" />
        ) : (
          <span>{step + 1}</span>
        )}
      </div>
      
      <span className={`
        text-xs
        ${isActive 
          ? 'text-[#C8A97E] font-medium' 
          : isCompleted 
            ? 'text-[#C8A97E]' 
            : 'text-gray-400'
        }
      `}>
        {label}
      </span>
    </button>
  );
};

export default function MobileProgressBar({ 
  currentStep, 
  totalSteps, 
  labels = [],
  onStepClick
}: MobileProgressBarProps) {
  const { t } = useTranslation();
  
  // Convert string currentStep to number for progress calculation
  const currentStepNumber = typeof currentStep === 'number' 
    ? currentStep 
    : currentStep === 'service' 
      ? 0 
      : currentStep === 'details' 
        ? 1 
        : currentStep === 'confirm' 
          ? 2 
          : 0;
  
  // Default labels if not provided
  const stepLabels = labels.length === totalSteps 
    ? labels 
    : Array(totalSteps).fill(0).map((_, i) => 
        i === 0 
          ? t('booking.service', 'Dienst') 
          : i === totalSteps - 1 
            ? t('booking.confirm', 'Bestätigen') 
            : t('booking.details', 'Details')
      );
  
  // Handle step click
  const handleStepClick = (step: number) => {
    // Only allow clicking on completed steps or the current step
    if (onStepClick && (step <= currentStepNumber)) {
      onStepClick(step);
    }
  };
  
  return (
    <div className="w-full py-2 px-1 booking-progress-mobile">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-gray-800 rounded-full mb-4">
        <motion.div 
          className="absolute left-0 top-0 h-full bg-[#C8A97E] rounded-full"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${(currentStepNumber / (totalSteps - 1)) * 100}%` 
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between items-start">
        {Array.from({ length: totalSteps }, (_, i) => (
          <StepButton 
            key={i}
            step={i}
            currentStep={currentStep}
            label={stepLabels[i]}
            onClick={() => handleStepClick(i)}
          />
        ))}
      </div>
    </div>
  );
}

