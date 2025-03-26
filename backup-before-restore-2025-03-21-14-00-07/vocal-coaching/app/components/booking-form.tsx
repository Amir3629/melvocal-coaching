"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from './language-switcher'
import { useTranslation } from 'react-i18next'
import ServiceSelection from './booking/service-selection'
import ProgressBar from './booking/progress-bar'
import LiveSingingForm from './booking/live-singing-form'
import VocalCoachingForm from './booking/vocal-coaching-form'
import WorkshopForm from './booking/workshop-form'
import ConfirmationStep from './booking/confirmation-step'
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react'

// Service types
type ServiceType = 'gesangsunterricht' | 'vocal-coaching' | 'professioneller-gesang' | null

// Form step type
type FormStep = 'service' | 'details' | 'confirm'

// Form data interface
interface FormData {
  // Common fields
  name: string;
  email: string;
  phone: string;
  message: string;
  
  // Live Singing fields
  eventType?: 'wedding' | 'corporate' | 'private' | 'other';
  eventDate?: string;
  guestCount?: string;
  musicPreferences?: string[];
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

// Props interface
interface BookingFormProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function BookingForm({ isOpen: externalIsOpen, onClose }: BookingFormProps) {
  const { currentLang } = useLanguage()
  const { t } = useTranslation()
  
  // State for showing the booking form
  const [isOpen, setIsOpen] = useState(false)
  
  // State for current step and service type
  const [currentStep, setCurrentStep] = useState<FormStep>('service')
  const [serviceType, setServiceType] = useState<ServiceType>(null)
  
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    termsAccepted: false,
    privacyAccepted: false
  })
  
  // State for legal document modals
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  
  // Handle external isOpen prop
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);
  
  // Handle service selection
  const handleServiceSelect = (service: ServiceType) => {
    setServiceType(service)
    setCurrentStep('details')
  }
  
  // Handle form data changes
  const handleFormChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }
  
  // Handle legal document click
  const handleLegalDocumentClick = (type: 'terms' | 'privacy') => {
    if (type === 'terms') {
      setShowTermsModal(true)
    } else if (type === 'privacy') {
      setShowPrivacyModal(true)
    }
  }
  
  // Go to next step
  const goToNextStep = () => {
    if (currentStep === 'service') {
      setCurrentStep('details')
    } else if (currentStep === 'details') {
      setCurrentStep('confirm')
    }
  }
  
  // Go to previous step
  const goToPrevStep = () => {
    if (currentStep === 'details') {
      setCurrentStep('service')
    } else if (currentStep === 'confirm') {
      setCurrentStep('details')
    }
  }
  
  // Submit form
  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData)
    
    // Show success message and close form
    alert(t('booking.successMessage', 'Buchung erfolgreich eingereicht! Wir werden uns in Kürze bei Ihnen melden.'))
    closeBookingForm()
  }
  
  // Close booking form
  const closeBookingForm = () => {
    setIsOpen(false)
    // Reset form state
    setCurrentStep('service')
    setServiceType(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      termsAccepted: false,
      privacyAccepted: false
    })
    
    // Call external onClose if provided
    if (onClose) {
      onClose();
    }
  }
  
  // Determine if form is valid for current step
  const isCurrentStepValid = () => {
    if (currentStep === 'service') {
      return serviceType !== null
    }
    
    if (currentStep === 'details') {
      // Basic validation for details step
      return formData.name.trim() !== '' && 
             formData.email.trim() !== '' && 
             formData.phone.trim() !== ''
    }
    
    if (currentStep === 'confirm') {
      return formData.termsAccepted
    }
    
    return false
  }
  
  // Render service-specific form based on selected service
  const renderServiceForm = () => {
    switch(serviceType) {
      case 'professioneller-gesang':
        return (
          <LiveSingingForm 
            formData={formData} 
            onFormDataChange={handleFormChange} 
          />
        )
      case 'vocal-coaching':
        return (
          <VocalCoachingForm 
            formData={formData} 
            onFormDataChange={handleFormChange} 
          />
        )
      case 'gesangsunterricht':
        return (
          <WorkshopForm 
            formData={formData} 
            onFormDataChange={handleFormChange} 
          />
        )
      default:
        return null
    }
  }
  
  return (
    <>
      {/* Booking Form Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeBookingForm}
          >
            <motion.div
              className="w-full max-w-3xl bg-gradient-to-b from-[#0A0A0A] to-[#151515] rounded-xl shadow-2xl overflow-hidden border border-[#222]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4, type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 relative">
                {/* Close button */}
                <button 
                  onClick={closeBookingForm}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close booking form"
                >
                  <X size={24} />
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-8 text-center">
                  {currentStep === 'service' 
                    ? t('booking.title', 'Buchung') 
                    : currentStep === 'details' && serviceType === 'professioneller-gesang'
                      ? t('booking.liveSingingTitle', 'Live Gesang buchen')
                      : currentStep === 'details' && serviceType === 'vocal-coaching'
                        ? t('booking.vocalCoachingTitle', 'Vocal Coaching buchen')
                        : currentStep === 'details' && serviceType === 'gesangsunterricht'
                          ? t('booking.workshopTitle', 'Gesangsunterricht buchen')
                          : t('booking.confirmTitle', 'Buchung bestätigen')
                  }
                </h2>
                
                {/* Progress Bar */}
                <div className="mb-10">
                  <ProgressBar currentStep={currentStep} />
                </div>
                
                {/* Step 1: Service Selection */}
                {currentStep === 'service' && (
                  <ServiceSelection
                    selectedService={serviceType}
                    onSelect={handleServiceSelect}
                  />
                )}
                
                {/* Step 2: Service-specific Form */}
                {currentStep === 'details' && renderServiceForm()}
                
                {/* Step 3: Confirmation */}
                {currentStep === 'confirm' && (
                  <ConfirmationStep 
                    formData={formData} 
                    onFormDataChange={handleFormChange}
                    onSubmit={handleSubmit}
                    onLegalDocumentClick={handleLegalDocumentClick}
                  />
                )}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                  {currentStep !== 'service' ? (
                      <button
                      onClick={goToPrevStep}
                      className="px-6 py-2 border border-gray-700 text-gray-300 rounded-full hover:border-gray-500 transition-colors flex items-center"
                      >
                      <ArrowLeft size={16} className="mr-2" />
                        {t('booking.back', 'Zurück')}
                      </button>
                  ) : (
                    <div></div> // Empty div to maintain flex spacing
                  )}
                  
                  {currentStep !== 'confirm' ? (
                    <button
                      onClick={goToNextStep}
                      disabled={!isCurrentStepValid()}
                      className={`px-6 py-2 rounded-full flex items-center ${
                        isCurrentStepValid()
                          ? 'bg-[#C8A97E] text-black font-medium hover:bg-[#D4AF37] transition-colors'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {t('booking.continue', 'Weiter')}
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  ) : (
                      <button
                      onClick={handleSubmit}
                      disabled={!isCurrentStepValid()}
                      className={`px-6 py-2 rounded-full flex items-center ${
                        isCurrentStepValid()
                          ? 'bg-[#C8A97E] text-black font-medium hover:bg-[#D4AF37] transition-colors'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {t('booking.submit', 'Absenden')}
                      <Check size={16} className="ml-2" />
                      </button>
                  )}
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}