"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from './language-switcher'
import { useTranslation } from 'react-i18next'
import ServiceSelection from './booking/service-selection'
import ProgressBar from './booking/progress-bar'
import LiveSingingForm from './booking/live-singing-form'
import VocalCoachingForm from './booking/vocal-coaching-form'
import WorkshopForm from './booking/workshop-form-new'
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
  serviceType: ServiceType | null;
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
    privacyAccepted: false,
    serviceType: null
  })
  
  // Effect to handle modal open/close
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen)
      if (externalIsOpen) {
        document.documentElement.classList.add('modal-open')
      } else {
        document.documentElement.classList.remove('modal-open')
      }
    }
    
    // Cleanup when component unmounts
    return () => {
      document.documentElement.classList.remove('modal-open')
    }
  }, [externalIsOpen])
  
  // Handle service selection
  const handleServiceSelect = (service: ServiceType) => {
    setServiceType(service)
    setCurrentStep('details')
  }
  
  // Handle form data changes
  const handleFormChange = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
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
    // Use smoother exit animation
    setIsOpen(false);
    
    // Reset form state after animation completes
    setTimeout(() => {
      setCurrentStep('service');
      setServiceType(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        termsAccepted: false,
        privacyAccepted: false,
        serviceType: null
      });
      
      // Call external onClose if provided
      if (onClose) {
        onClose();
      }
    }, 600); // Match the duration of the exit animation
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
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBookingForm}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 overflow-y-auto z-[101]">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                className="relative w-full max-w-2xl bg-[#0A0A0A] rounded-xl border border-[#C8A97E]/20 shadow-2xl overflow-hidden"
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="p-5 relative overflow-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
                  {/* Close button */}
                  <button 
                    onClick={closeBookingForm}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
                    aria-label="Close booking form"
                  >
                    <X size={24} />
                  </button>
                  
                  <h2 className="text-lg font-bold text-white mb-5 text-center mt-1">
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
                  <div className="mb-6">
                    <ProgressBar currentStep={currentStep} />
                  </div>
                  
                  {/* Scrollable content area */}
                  <div className="max-h-[50vh] overflow-y-auto pr-2 mb-4 custom-scrollbar">

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
                        serviceType={serviceType}
                        onChange={handleFormChange}
                        onClose={closeBookingForm}
                      />
                    )}
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-4">
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
                    
                    {currentStep !== 'confirm' && (
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
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}