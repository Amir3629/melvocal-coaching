"use client"

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProgressBar from './progress-bar'
import ServiceSelection from './service-selection'
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

// Form step type
type FormStep = 'service' | 'details' | 'confirm';

export default function BookingForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<FormStep>('service')
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  
  // Initialize form data with empty values
  const [formData, setFormData] = useState<FormData>({
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
  const handleFormChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 'service') {
      setCurrentStep('details')
    } else if (currentStep === 'details') {
      setCurrentStep('confirm')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep === 'confirm') {
      setCurrentStep('details')
    } else if (currentStep === 'details') {
      setCurrentStep('service')
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
  
  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 'service':
        return t('booking.selectService', 'Dienst auswählen')
      case 'details':
        return t('booking.personalInfo', 'Persönliche Informationen')
      case 'confirm':
        return t('booking.confirmation', 'Bestätigung')
      default:
        return ''
    }
  }
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 'service':
        return (
          <ServiceSelection 
            selectedService={selectedService} 
            onSelect={handleServiceSelect} 
          />
        )
      case 'details':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  {t('booking.name', 'Name')} *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleFormChange({ name: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  {t('booking.email', 'E-Mail')} *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange({ email: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-white">
                  {t('booking.phone', 'Telefon')} *
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleFormChange({ phone: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-white">
                {t('booking.message', 'Nachricht')}
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleFormChange({ message: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white"
              />
            </div>
          </div>
        )
      case 'confirm':
        return (
          <ConfirmationStep 
            formData={formData} 
            serviceType={selectedService} 
            onChange={handleFormChange} 
          />
        )
      default:
        return null
    }
  }
  
  // Check if the current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 'service':
        return !!selectedService
      case 'details':
        return !!formData.name && !!formData.email && !!formData.phone
      case 'confirm':
        return formData.termsAccepted && formData.privacyAccepted
      default:
        return false
    }
  }
  
  // Handle smooth close function
  const handleSmoothClose = (callback?: () => void) => {
    setIsVisible(false)
    setTimeout(() => {
      if (callback) callback()
    }, 500) // Match transition duration
  }
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <ProgressBar 
              currentStep={currentStep}
              labels={[
                t('booking.service', 'Dienst'),
                t('booking.details', 'Details'),
                t('booking.confirm', 'Bestätigen')
              ]}
            />
          </div>
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">
              {getStepTitle()}
            </h2>
            <p className="text-gray-400 mt-2">
              {currentStep === 'service' && t('booking.selectServiceDesc', 'Wählen Sie den gewünschten Dienst aus.')}
              {currentStep === 'details' && t('booking.personalInfoDesc', 'Geben Sie Ihre Kontaktdaten ein.')}
              {currentStep === 'confirm' && t('booking.confirmationDesc', 'Überprüfen Sie Ihre Angaben und senden Sie die Anfrage ab.')}
            </p>
          </div>
          
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 mb-6">
            {currentStep === 'confirm' ? (
              <ConfirmationStep
                formData={formData}
                serviceType={selectedService}
                onChange={handleFormChange}
                onClose={() => handleSmoothClose()}
              />
            ) : (
              renderStep()
            )}
          </div>
          
          <div className="mt-8 flex justify-between">
            {currentStep !== 'service' && (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                {t('booking.back', 'Zurück')}
              </button>
            )}
            
            <div className={currentStep !== 'service' ? 'ml-auto' : 'w-full'}>
              {currentStep !== 'confirm' ? (
                <SubmitButton 
                  onClick={handleNextStep} 
                  disabled={!isStepValid()}
                />
              ) : (
                <SubmitButton 
                  isLastStep
                  onClick={handleSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 