"use client"

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ProgressBar from './progress-bar'
import ServiceSelection from './service-selection'
import LiveSingingForm from './live-singing-form'
import VocalCoachingForm from './vocal-coaching-form'
import WorkshopForm from './workshop-form'
import ConfirmationStep from './confirmation-step'
import SubmitButton from './submit-button'
import { useRouter } from 'next/navigation'

// Service types
type ServiceType = 'gesangsunterricht' | 'vocal-coaching' | 'professioneller-gesang' | null

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
  
  // Get step title
  const getStepTitle = () => {
    switch (currentStep) {
      case 0:
        return t('booking.selectService', 'Dienst auswählen')
      case 1:
        return t('booking.personalInfo', 'Persönliche Informationen')
      case 2:
        return t('booking.serviceDetails', 'Details zum Dienst')
      case 3:
        return t('booking.confirmation', 'Bestätigung')
      default:
        return ''
    }
  }
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <ServiceSelection 
            selectedService={selectedService} 
            onSelect={handleServiceSelect} 
          />
        )
      case 1:
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
      case 2:
        switch (selectedService) {
          case 'professioneller-gesang':
            return (
              <LiveSingingForm 
                formData={formData} 
                onChange={handleFormChange} 
              />
            )
          case 'vocal-coaching':
            return (
              <VocalCoachingForm 
                formData={formData} 
                onChange={handleFormChange} 
              />
            )
          case 'gesangsunterricht':
            return (
              <WorkshopForm 
                formData={formData} 
                onChange={handleFormChange} 
              />
            )
          default:
            return null
        }
      case 3:
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
      case 0:
        return !!selectedService
      case 1:
        return !!formData.name && !!formData.email && !!formData.phone
      case 2:
        // Basic validation for service-specific forms
        if (selectedService === 'professioneller-gesang') {
          return !!formData.eventType && !!formData.eventDate
        } else if (selectedService === 'vocal-coaching') {
          return !!formData.sessionType && !!formData.skillLevel
        } else if (selectedService === 'gesangsunterricht') {
          return !!formData.workshopTheme && !!formData.groupSize
        }
        return false
      case 3:
        return formData.termsAccepted && formData.privacyAccepted
      default:
        return false
    }
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={4} 
          labels={[
            t('booking.service', 'Dienst'),
            t('booking.personal', 'Persönlich'),
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
          {currentStep === 0 && t('booking.selectServiceDesc', 'Wählen Sie den gewünschten Dienst aus.')}
          {currentStep === 1 && t('booking.personalInfoDesc', 'Geben Sie Ihre Kontaktdaten ein.')}
          {currentStep === 2 && t('booking.serviceDetailsDesc', 'Geben Sie weitere Details zu Ihrer Anfrage an.')}
          {currentStep === 3 && t('booking.confirmationDesc', 'Überprüfen Sie Ihre Angaben und senden Sie die Anfrage ab.')}
        </p>
      </div>
      
      <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 mb-6">
        {renderStep()}
      </div>
      
      <div className="mt-8 flex justify-between">
        {currentStep > 0 && (
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            {t('booking.back', 'Zurück')}
          </button>
        )}
        
        <div className={currentStep > 0 ? 'ml-auto' : 'w-full'}>
          {currentStep < 3 ? (
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
    </div>
  )
} 