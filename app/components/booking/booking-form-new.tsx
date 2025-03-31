"use client"

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProgressBar from './progress-bar'
import ServiceSelection from './service-selection'
import PersonalInfoStep from './personal-info-step'
import WorkshopFormStep from './workshop-form'
import VocalCoachingFormStep from './vocal-coaching-form'
import LiveSingingFormStep from './live-singing-form'
import ConfirmationStep from './confirmation-step'
import SubmitButton from './submit-button'
import { useRouter } from 'next/navigation'
import { ServiceType, BookingFormData } from '@/app/types/booking'
import { motion, AnimatePresence } from 'framer-motion'

// Form data interface
interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  
  // Live Singing fields
  eventType?: 'wedding' | 'corporate' | 'private' | 'other';
  eventDate?: string;
  guestCount?: string;
  jazzStandards?: string;
  performanceType?: 'solo' | 'band';
  
  // Vocal Coaching fields
  sessionType?: '1:1' | 'group' | 'online';
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: string[];
  preferredDate?: string;
  preferredTime?: string;
  
  // Workshop fields
  workshopTheme?: string;
  groupSize?: string;
  preferredDates?: string[];
  workshopDuration?: string;
  
  // Legal
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export default function BookingForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedService, setSelectedService] = useState<ServiceType>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  
  // Initialize form data with empty values
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    termsAccepted: false,
    privacyAccepted: false
  })
  
  // Handle service selection
  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service)
  }
  
  // Handle form data changes
  const handleFormChange = (data: Partial<BookingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }
  
  // Go to next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  // Go to previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  // Handle form submission
  const handleSubmit = () => {
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setIsSubmitting(false)
      
      // Redirect to success page
      router.push('/booking/success')
    }, 1500)
  }
  
  // Check if current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return selectedService !== null
      case 1:
        return formData.name && formData.email && formData.phone
      case 2:
        // Add validation for service-specific fields
        return true
      case 3:
        return formData.termsAccepted && formData.privacyAccepted
      default:
        return false
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-black text-white py-8 sm:py-12"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <ProgressBar currentStep={currentStep} totalSteps={4} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            {currentStep === 0 && (
              <ServiceSelection 
                selectedService={selectedService} 
                onSelect={handleServiceSelect} 
              />
            )}
            
            {currentStep === 1 && (
              <PersonalInfoStep
                formData={formData}
                onChange={handleFormChange}
              />
            )}
            
            {currentStep === 2 && selectedService && (
              <>
                {selectedService === 'professioneller-gesang' && (
                  <LiveSingingFormStep 
                    formData={formData} 
                    onChange={handleFormChange} 
                  />
                )}
                {selectedService === 'vocal-coaching' && (
                  <VocalCoachingFormStep 
                    formData={formData} 
                    onChange={handleFormChange} 
                  />
                )}
                {selectedService === 'gesangsunterricht' && (
                  <WorkshopFormStep 
                    formData={formData} 
                    onChange={handleFormChange} 
                  />
                )}
              </>
            )}
            
            {currentStep === 3 && (
              <ConfirmationStep
                formData={formData}
                selectedService={selectedService}
                onChange={handleFormChange}
              />
            )}
          </motion.div>
        </AnimatePresence>
        
        <div className="max-w-2xl mx-auto mt-8 sm:mt-12">
          <div className="flex justify-between items-center">
            {currentStep > 0 && (
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 text-sm sm:text-base text-white bg-transparent border border-gray-800 rounded-lg hover:border-[#C8A97E] transition-colors duration-200"
              >
                {t('booking.back', 'Zurück')}
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                disabled={!isStepValid()}
                className={`ml-auto px-6 py-2.5 text-sm sm:text-base text-white rounded-lg transition-colors duration-200 ${
                  isStepValid()
                    ? 'bg-[#C8A97E] hover:bg-[#B69468]'
                    : 'bg-gray-800 cursor-not-allowed'
                }`}
              >
                {t('booking.next', 'Weiter')}
              </button>
            ) : (
              <SubmitButton
                onClick={handleSubmit}
                isSubmitting={isSubmitting}
                disabled={!isStepValid()}
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
} 