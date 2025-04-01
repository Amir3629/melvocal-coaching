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
import { X, ArrowLeft, ArrowRight, Check, Mic, Music, Calendar } from 'lucide-react'
import AdvancedErrorBoundary from './AdvancedErrorBoundary'
import { ensureString } from '@/lib/formatters'

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
  eventType?: 'vernissage' | 'jazz-festivals' | 'private-feier';
  eventDate?: string;
  guestCount?: string;
  musicPreferences?: string[];
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
          <AdvancedErrorBoundary context="LiveSingingForm">
            <LiveSingingForm 
              formData={formData} 
              onChange={handleFormChange} 
            />
          </AdvancedErrorBoundary>
        )
      case 'vocal-coaching':
        return (
          <AdvancedErrorBoundary context="VocalCoachingForm">
            <VocalCoachingForm 
              formData={formData} 
              onChange={handleFormChange} 
            />
          </AdvancedErrorBoundary>
        )
      case 'gesangsunterricht':
        return (
          <AdvancedErrorBoundary context="WorkshopForm">
            <WorkshopForm 
              formData={formData} 
              onChange={handleFormChange} 
            />
          </AdvancedErrorBoundary>
        )
      default:
        return null
    }
  }
  
  return (
    <AdvancedErrorBoundary context="BookingForm">
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
              <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
                <motion.div
                  className="relative w-full max-w-lg bg-[#0A0A0A] rounded-xl border border-[#C8A97E]/20 shadow-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-3 sm:p-5 relative overflow-auto" style={{ maxHeight: 'calc(100vh - 40px)' }}>
                    {/* Close button */}
                    <button 
                      onClick={closeBookingForm}
                      className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors z-10"
                      aria-label="Close booking form"
                    >
                      <X size={20} />
                    </button>
                    
                    <h2 className="text-lg font-bold text-white mb-5 text-center mt-1">
                      {currentStep === 'service' 
                        ? t('booking.title', 'Buchung') 
                        : currentStep === 'details' && serviceType === 'professioneller-gesang'
                          ? t('booking.liveSingingTitle', 'Live Gesang buchen')
                          : currentStep === 'details' && serviceType === 'vocal-coaching'
                            ? t('booking.vocalCoachingTitle', 'Vocal Coaching buchen')
                            : currentStep === 'details' && serviceType === 'gesangsunterricht'
                              ? t('booking.jazzWorkshopTitle', 'Jazz Workshop buchen')
                              : t('booking.confirmTitle', 'Buchung bestätigen')
                      }
                    </h2>
                    
                    {/* Progress indicator */}
                    <div className="mb-4 sm:mb-6">
                      {currentStep === 'service' && (
                        <div className="flex justify-center">
                          <div className="flex items-center space-x-1 text-[#C8A97E]">
                            <div className="w-5 h-5 rounded-full bg-[#C8A97E] flex items-center justify-center">
                              <span className="text-[10px] font-medium text-black">1</span>
                            </div>
                            <span className="text-xs font-medium">
                              {t('booking.dienst', 'Dienst')}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {currentStep === 'details' && (
                        <div className="flex justify-center">
                          <div className="flex items-center space-x-1 text-[#C8A97E]">
                            <div className="w-5 h-5 rounded-full bg-[#2A2A2A] border border-[#C8A97E] flex items-center justify-center">
                              <Check className="w-3 h-3 text-[#C8A97E]" />
                            </div>
                            <span className="text-xs font-medium text-gray-300 mr-3">
                              {t('booking.dienst', 'Dienst')}
                            </span>
                            
                            <div className="w-5 h-5 rounded-full bg-[#C8A97E] flex items-center justify-center">
                              <span className="text-[10px] font-medium text-black">2</span>
                            </div>
                            <span className="text-xs font-medium">
                              {t('booking.details', 'Details')}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {currentStep === 'confirm' && (
                        <div className="flex justify-center">
                          <div className="flex items-center space-x-1 text-[#C8A97E]">
                            <div className="w-5 h-5 rounded-full bg-[#2A2A2A] border border-[#C8A97E] flex items-center justify-center">
                              <Check className="w-3 h-3 text-[#C8A97E]" />
                            </div>
                            <span className="text-xs font-medium text-gray-300 mr-2">
                              {t('booking.dienst', 'Dienst')}
                            </span>
                            
                            <div className="w-5 h-5 rounded-full bg-[#2A2A2A] border border-[#C8A97E] flex items-center justify-center">
                              <Check className="w-3 h-3 text-[#C8A97E]" />
                            </div>
                            <span className="text-xs font-medium text-gray-300 mr-2">
                              {t('booking.details', 'Details')}
                            </span>
                            
                            <div className="w-5 h-5 rounded-full bg-[#C8A97E] flex items-center justify-center">
                              <span className="text-[10px] font-medium text-black">3</span>
                            </div>
                            <span className="text-xs font-medium">
                              {t('booking.confirm', 'Bestätigen')}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Form Content */}
                    <div className="mb-4">
                      <AnimatePresence mode="wait">
                        {currentStep === 'service' && (
                          <motion.div
                            key="service"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h3 className="text-sm sm:text-base font-medium text-white mb-3 text-center">
                              {t('booking.selectService', 'Dienst auswählen')}
                            </h3>
                            
                            <div className="space-y-2 sm:space-y-3">
                              {/* Live Jazz Performance */}
                              <div 
                                className={`p-3 rounded-lg border cursor-pointer ${
                                  serviceType === 'professioneller-gesang' 
                                    ? 'bg-[#1A1A1A] border-[#C8A97E]' 
                                    : 'border-gray-800 hover:border-[#C8A97E]/50'
                                }`}
                                onClick={() => handleServiceSelect('professioneller-gesang')}
                              >
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center mr-3">
                                    <Mic className="w-4 h-4 text-[#C8A97E]" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-white">
                                      {t('booking.liveJazzPerformance', 'Live Jazz Performance')}
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                      {t('booking.nachVereinbarung', 'Nach Vereinbarung')}
                                    </p>
                                  </div>
                                  {serviceType === 'professioneller-gesang' && (
                                    <div className="ml-auto">
                                      <Check className="w-5 h-5 text-[#C8A97E]" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Vocal Coaching */}
                              <div 
                                className={`p-3 rounded-lg border cursor-pointer ${
                                  serviceType === 'vocal-coaching' 
                                    ? 'bg-[#1A1A1A] border-[#C8A97E]' 
                                    : 'border-gray-800 hover:border-[#C8A97E]/50'
                                }`}
                                onClick={() => handleServiceSelect('vocal-coaching')}
                              >
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center mr-3">
                                    <Music className="w-4 h-4 text-[#C8A97E]" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-white">
                                      {t('booking.vocalCoachingAndGesang', 'Vocal Coaching & Gesangsunterricht')}
                                    </h4>
                                    <p className="text-xs text-gray-400">60 min</p>
                                  </div>
                                  {serviceType === 'vocal-coaching' && (
                                    <div className="ml-auto">
                                      <Check className="w-5 h-5 text-[#C8A97E]" />
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Jazz Workshop */}
                              <div 
                                className={`p-3 rounded-lg border cursor-pointer ${
                                  serviceType === 'gesangsunterricht' 
                                    ? 'bg-[#1A1A1A] border-[#C8A97E]' 
                                    : 'border-gray-800 hover:border-[#C8A97E]/50'
                                }`}
                                onClick={() => handleServiceSelect('gesangsunterricht')}
                              >
                                <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] flex items-center justify-center mr-3">
                                    <Calendar className="w-4 h-4 text-[#C8A97E]" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-white">
                                      {t('booking.jazzWorkshop', 'Jazz Workshop')}
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                      {t('booking.variableDuration', 'Variable Dauer')}
                                    </p>
                                  </div>
                                  {serviceType === 'gesangsunterricht' && (
                                    <div className="ml-auto">
                                      <Check className="w-5 h-5 text-[#C8A97E]" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                        
                        {currentStep === 'details' && (
                          <motion.div
                            key="details"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="space-y-4">
                              {/* Basic info form */}
                              <div className="space-y-3">
                                <div>
                                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-white mb-1">
                                    {t('booking.name', 'Name')} *
                                  </label>
                                  <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleFormChange({ name: e.target.value })}
                                    className="w-full px-3 py-2 text-xs sm:text-sm bg-[#1A1A1A] border border-gray-800 rounded focus:border-[#C8A97E] focus:outline-none focus:ring-1 focus:ring-[#C8A97E] text-white"
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-white mb-1">
                                    {t('booking.email', 'E-Mail')} *
                                  </label>
                                  <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => handleFormChange({ email: e.target.value })}
                                    className="w-full px-3 py-2 text-xs sm:text-sm bg-[#1A1A1A] border border-gray-800 rounded focus:border-[#C8A97E] focus:outline-none focus:ring-1 focus:ring-[#C8A97E] text-white"
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-white mb-1">
                                    {t('booking.phone', 'Telefon')} *
                                  </label>
                                  <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleFormChange({ phone: e.target.value })}
                                    className="w-full px-3 py-2 text-xs sm:text-sm bg-[#1A1A1A] border border-gray-800 rounded focus:border-[#C8A97E] focus:outline-none focus:ring-1 focus:ring-[#C8A97E] text-white"
                                    required
                                  />
                                </div>
                                
                                <div>
                                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-white mb-1">
                                    {t('booking.message', 'Nachricht')}
                                  </label>
                                  <textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => handleFormChange({ message: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 text-xs sm:text-sm bg-[#1A1A1A] border border-gray-800 rounded focus:border-[#C8A97E] focus:outline-none focus:ring-1 focus:ring-[#C8A97E] text-white resize-none"
                                  />
                                </div>
                              </div>
                              
                              {/* Service-specific form */}
                              {renderServiceForm()}
                            </div>
                          </motion.div>
                        )}
                        
                        {currentStep === 'confirm' && (
                          <motion.div
                            key="confirm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="space-y-4">
                              <h3 className="text-sm sm:text-base font-medium text-white mb-3 text-center">
                                {t('booking.confirmDetails', 'Bestätigen Sie Ihre Angaben')}
                              </h3>
                              
                              <div className="bg-[#1A1A1A] p-3 rounded">
                                <h4 className="text-xs font-medium text-[#C8A97E] mb-2">
                                  {t('booking.summary', 'Zusammenfassung')}
                                </h4>
                                
                                <div className="space-y-2 text-xs">
                                  <p>
                                    <span className="font-medium text-gray-400">{t('booking.service', 'Dienst')}: </span>
                                    <span className="text-white">
                                      {serviceType === 'professioneller-gesang' && t('booking.liveJazzPerformance', 'Live Jazz Performance')}
                                      {serviceType === 'vocal-coaching' && t('booking.vocalCoachingAndGesang', 'Vocal Coaching & Gesangsunterricht')}
                                      {serviceType === 'gesangsunterricht' && t('booking.jazzWorkshop', 'Jazz Workshop')}
                                    </span>
                                  </p>
                                  
                                  <p>
                                    <span className="font-medium text-gray-400">{t('booking.name', 'Name')}: </span>
                                    <span className="text-white">{formData.name}</span>
                                  </p>
                                  
                                  <p>
                                    <span className="font-medium text-gray-400">{t('booking.email', 'E-Mail')}: </span>
                                    <span className="text-white">{formData.email}</span>
                                  </p>
                                  
                                  <p>
                                    <span className="font-medium text-gray-400">{t('booking.phone', 'Telefon')}: </span>
                                    <span className="text-white">{formData.phone}</span>
                                  </p>
                                  
                                  {formData.message && (
                                    <p>
                                      <span className="font-medium text-gray-400">{t('booking.message', 'Nachricht')}: </span>
                                      <span className="text-white">{formData.message}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <input
                                    type="checkbox"
                                    id="terms"
                                    checked={formData.termsAccepted}
                                    onChange={(e) => handleFormChange({ termsAccepted: e.target.checked })}
                                    className="mt-1 h-3 w-3 rounded border-gray-700 bg-[#1A1A1A] text-[#C8A97E] focus:ring-[#C8A97E]"
                                  />
                                  <label htmlFor="terms" className="ml-2 block text-xs text-gray-300">
                                    {t('booking.termsAccept', 'Ich akzeptiere die Allgemeinen Geschäftsbedingungen')} *
                                  </label>
                                </div>
                                
                                <div className="flex items-start">
                                  <input
                                    type="checkbox"
                                    id="privacy"
                                    checked={formData.privacyAccepted}
                                    onChange={(e) => handleFormChange({ privacyAccepted: e.target.checked })}
                                    className="mt-1 h-3 w-3 rounded border-gray-700 bg-[#1A1A1A] text-[#C8A97E] focus:ring-[#C8A97E]"
                                  />
                                  <label htmlFor="privacy" className="ml-2 block text-xs text-gray-300">
                                    {t('booking.privacyAccept', 'Ich akzeptiere die Datenschutzerklärung')}
                                  </label>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex justify-between mt-6">
                      {currentStep !== 'service' ? (
                        <button
                          type="button"
                          onClick={goToPrevStep}
                          className="flex items-center text-xs sm:text-sm text-gray-300 hover:text-white transition-colors"
                        >
                          <ArrowLeft className="w-3 h-3 mr-1" />
                          {t('booking.back', 'Zurück')}
                        </button>
                      ) : (
                        <div></div>
                      )}
                      
                      {currentStep !== 'confirm' ? (
                        <button
                          type="button"
                          onClick={goToNextStep}
                          disabled={!isCurrentStepValid()}
                          className={`flex items-center px-3 py-1.5 text-xs sm:text-sm rounded-md ${
                            isCurrentStepValid()
                              ? 'bg-[#C8A97E] text-black hover:bg-[#D4AF37]'
                              : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {t('booking.next', 'Weiter')}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={!isCurrentStepValid()}
                          className={`flex items-center px-3 py-1.5 text-xs sm:text-sm rounded-md ${
                            isCurrentStepValid()
                              ? 'bg-[#C8A97E] text-black hover:bg-[#D4AF37]'
                              : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {t('booking.submit', 'Anfrage senden')}
                          <Check className="w-3 h-3 ml-1" />
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
    </AdvancedErrorBoundary>
  )
}