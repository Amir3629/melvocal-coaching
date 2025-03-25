"use client"

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ProgressBar from './progress-bar'
import MobileProgressBar from './mobile-progress-bar'
import ServiceSelection from './service-selection'
import LiveSingingForm from './live-singing-form'
import VocalCoachingForm from './vocal-coaching-form'
import WorkshopForm from './workshop-form'
import ConfirmationStep from './confirmation-step'
import SubmitButton from './submit-button'
import { useRouter, useSearchParams } from 'next/navigation'
import LegalDocumentModal from '../legal-document-modal'
import { ServiceType, FormData } from '@/app/types/booking'
import PersonalInfoStep from './personal-info-step'

export default function BookingForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
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
  
  // Handle service selection from URL parameter
  useEffect(() => {
    if (searchParams) {
      const serviceParam = searchParams.get('service')
      if (serviceParam && ['gesangsunterricht', 'vocal-coaching', 'professioneller-gesang'].includes(serviceParam)) {
        setSelectedService(serviceParam as ServiceType)
      }
    }
  }, [searchParams])
  
  // Handle service selection
  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service)
  }
  
  // Handle form data changes
  const handleFormChange = (data: Partial<FormData>) => {
    setFormData({ ...formData, ...data })
  }
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      // Scroll to top when changing steps
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      // Scroll to top when changing steps
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
  
  // Convert step number to step string for progress bars
  const getStepIdentifier = (): 'service' | 'details' | 'confirm' => {
    if (currentStep === 0) return 'service';
    if (currentStep === 1 || currentStep === 2) return 'details';
    return 'confirm';
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
          <PersonalInfoStep
            formData={formData}
            onChange={handleFormChange}
          />
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Desktop progress bar (hidden on mobile) */}
      <div className="hidden sm:block mb-8">
        <ProgressBar 
          currentStep={getStepIdentifier()} 
          totalSteps={4} 
          labels={[
            t('booking.service', 'Dienst'),
            t('booking.personal', 'Persönlich'),
            t('booking.details', 'Details'),
            t('booking.confirm', 'Bestätigen')
          ]}
        />
      </div>
      
      {/* Mobile progress bar (hidden on desktop) */}
      <div className="sm:hidden">
        <MobileProgressBar 
          currentStep={getStepIdentifier()} 
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
      
      <div className="bg-[#121212] border border-gray-800 rounded-xl p-4 sm:p-6 mb-6 overflow-hidden">
        {renderStep()}
      </div>
      
      <div className="mt-6 mb-8 flex justify-between items-center">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-4 sm:px-6 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#222] transition-colors border border-gray-700"
          >
            {t('booking.back', 'Zurück')}
          </button>
        ) : (
          <div></div>
        )}
        
        <div className={currentStep === 0 ? 'w-full' : 'w-auto'}>
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