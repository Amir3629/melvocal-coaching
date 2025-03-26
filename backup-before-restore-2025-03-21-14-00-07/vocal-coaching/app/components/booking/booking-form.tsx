"use client"

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ProgressBar from './progress-bar'
import ServiceSelection from './service-selection'
import LiveSingingForm from './live-singing-form'
import VocalCoachingForm from './vocal-coaching-form'
import WorkshopForm from './workshop-form'
import ConfirmationStep from './confirmation-step'
import SubmitButton from './submit-button'
import { useRouter, useSearchParams } from 'next/navigation'
import { XMarkIcon } from '@heroicons/react/24/outline'
import ServiceSelectionStep from './service-selection-step'
import PersonalInfoStep from './personal-info-step'
import ServiceSpecificStep from './service-specific-step'
import LegalDocumentModal from './legal-document-modal'
import { ServiceType, FormData } from '@/app/types/booking'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface BookingFormProps {
  onClose: () => void;
}

interface Step {
  id: number;
  name: string;
}

export default function BookingForm({ onClose }: BookingFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLegalDocument, setShowLegalDocument] = useState(false)
  const [documentType, setDocumentType] = useState<'terms' | 'privacy'>('terms')
  
  // Initialize form data with empty values
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    termsAccepted: false,
    privacyAccepted: false,
    serviceType: null
  })
  
  const steps: Step[] = [
    { id: 1, name: t('booking.steps.serviceSelection', 'Service Auswahl') },
    { id: 2, name: t('booking.steps.details', 'Details') },
    { id: 3, name: t('booking.steps.confirmation', 'Bestätigung') },
  ]
  
  // Handle service selection from URL parameter
  useEffect(() => {
    const serviceParam = searchParams.get('service')
    if (serviceParam && ['gesangsunterricht', 'vocal-coaching', 'professioneller-gesang'].includes(serviceParam)) {
      setSelectedService(serviceParam as ServiceType)
    }
  }, [searchParams])
  
  // Handle service selection
  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service)
    setCurrentStep(2)
  }
  
  // Handle form data changes
  const handleFormChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }
  
  // Go to next step
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  // Go to previous step
  const handleBack = () => {
    if (currentStep > 1) {
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
  
  const handleLegalDocumentClick = (type: 'terms' | 'privacy') => {
    setDocumentType(type)
    setShowLegalDocument(true)
  }
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ServiceSelectionStep
            selectedService={selectedService}
            onServiceSelect={handleServiceSelect}
          />
        )
      case 2:
        return (
          <ServiceSpecificStep
            formData={formData}
            onFormDataChange={handleFormChange}
            onNext={handleNext}
            onBack={handleBack}
            serviceType={selectedService!}
          />
        )
      case 3:
        return (
          <ConfirmationStep
            formData={formData}
            onFormDataChange={handleFormChange}
            onSubmit={handleSubmit}
            onLegalDocumentClick={handleLegalDocumentClick}
          />
        )
      default:
        return null
    }
  }
  
  // Check if the current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!selectedService
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6 sm:align-middle"
        >
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div className="max-h-[80vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {t('booking.title', 'Buchungsanfrage')}
                    </h3>
                  </div>

                  <div className="mt-2">
                    {currentStep === 0 && (
                      <ServiceSelectionStep
                        selectedService={formData.serviceType || null}
                        onServiceSelect={(service) => handleFormChange({ serviceType: service })}
                      />
                    )}
                    {currentStep === 1 && (
                      <PersonalInfoStep
                        formData={formData}
                        onFormDataChange={handleFormChange}
                        onNext={handleNext}
                        onBack={handleBack}
                      />
                    )}
                    {currentStep === 2 && (
                      <ServiceSpecificStep
                        formData={formData}
                        onFormDataChange={handleFormChange}
                        onNext={handleNext}
                        onBack={handleBack}
                        serviceType={selectedService!}
                      />
                    )}
                    {currentStep === 3 && (
                      <ConfirmationStep
                        formData={formData}
                        onFormDataChange={handleFormChange}
                        onSubmit={handleSubmit}
                        onLegalDocumentClick={handleLegalDocumentClick}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <LegalDocumentModal
        isOpen={showLegalDocument}
        onClose={() => setShowLegalDocument(false)}
        title={documentType === 'terms' ? 'Allgemeine Geschäftsbedingungen' : 'Datenschutzerklärung'}
      >
        {documentType === 'terms' ? (
          <div className="prose prose-sm">
            <h2>Allgemeine Geschäftsbedingungen</h2>
            <p>Dies sind die allgemeinen Geschäftsbedingungen für die Vocal Coaching Services.</p>
            {/* Add more terms content here */}
          </div>
        ) : (
          <div className="prose prose-sm">
            <h2>Datenschutzerklärung</h2>
            <p>Dies ist die Datenschutzerklärung für die Vocal Coaching Services.</p>
            {/* Add more privacy content here */}
          </div>
        )}
      </LegalDocumentModal>
    </div>
  )
} 