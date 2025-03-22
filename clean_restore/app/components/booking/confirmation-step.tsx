"use client"

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Calendar, Users, Music, BookOpen, Target, Info, Clock, AlertCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LegalDocumentModal from '../legal-document-modal'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

// Service types
type ServiceType = 'gesangsunterricht' | 'vocal-coaching' | 'professioneller-gesang' | null

interface FormData {
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

interface ConfirmationStepProps {
  formData: FormData;
  serviceType: ServiceType;
  onChange: (data: Partial<FormData>) => void;
  onClose?: () => void;
}

// Dynamically import legal document contents
const DatenschutzContent = dynamic(
  () => import("@/app/legal/datenschutz/page").catch(() => () => (
    <div className="text-red-500">Failed to load Datenschutz content</div>
  )),
  { loading: () => <p className="text-gray-400">Loading...</p>, ssr: false }
)

const AGBContent = dynamic(
  () => import("@/app/legal/agb/page").catch(() => () => (
    <div className="text-red-500">Failed to load AGB content</div>
  )),
  { loading: () => <p className="text-gray-400">Loading...</p>, ssr: false }
)

// Letter animation variants for success message
const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.2,
      duration: 0.5,
    },
  },
};

// Animated text component for letter-by-letter animation
const AnimatedText = ({ text }: { text: string }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="inline-flex flex-wrap justify-center"
    >
      {text.split(' ').map((word, wordIndex) => (
        <span key={`word-${wordIndex}`} className="whitespace-nowrap mr-1">
          {Array.from(word).map((letter, letterIndex) => (
            <motion.span
              key={`letter-${wordIndex}-${letterIndex}`}
              variants={letterVariants}
              custom={wordIndex * 5 + letterIndex}
              style={{ 
                display: 'inline-block',
                textAlign: 'center'
              }}
            >
              {letter}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

export default function ConfirmationStep({ formData, serviceType, onChange, onClose }: ConfirmationStepProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [showAGB, setShowAGB] = useState(false)
  const [showDatenschutz, setShowDatenschutz] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  }
  
  // Get service name based on type
  const getServiceName = () => {
    switch(serviceType) {
      case 'gesangsunterricht':
        return t('booking.jazzWorkshop', 'Jazz Workshop');
      case 'vocal-coaching':
        return t('booking.vocalCoachingAndGesang', 'Vocal Coaching & Gesangsunterricht');
      case 'professioneller-gesang':
        return t('booking.liveJazzPerformance', 'Live Jazz Performance');
      default:
        return '';
    }
  }
  
  // Get event type name
  const getEventTypeName = () => {
    switch(formData.eventType) {
      case 'wedding':
        return t('booking.wedding', 'Hochzeit');
      case 'corporate':
        return t('booking.corporate', 'Firmenevent');
      case 'private':
        return t('booking.private', 'Private Feier');
      case 'other':
        return t('booking.other', 'Sonstiges');
      default:
        return '';
    }
  }
  
  // Get performance type name
  const getPerformanceTypeName = () => {
    switch(formData.performanceType) {
      case 'solo':
        return t('booking.solo', 'Solo');
      case 'band':
        return t('booking.withBand', 'Mit Band');
      default:
        return '';
    }
  }
  
  // Get session type name
  const getSessionTypeName = () => {
    switch(formData.sessionType) {
      case '1:1':
        return t('booking.privateSession', 'Einzelunterricht');
      case 'group':
        return t('booking.groupSession', 'Gruppenunterricht');
      case 'online':
        return t('booking.onlineSession', 'Online Coaching');
      default:
        return '';
    }
  }
  
  // Get skill level name
  const getSkillLevelName = () => {
    switch(formData.skillLevel) {
      case 'beginner':
        return t('booking.beginner', 'Anfänger');
      case 'intermediate':
        return t('booking.intermediate', 'Fortgeschritten');
      case 'advanced':
        return t('booking.advanced', 'Profi');
      default:
        return '';
    }
  }
  
  // Get workshop theme name
  const getWorkshopThemeName = () => {
    switch(formData.workshopTheme) {
      case 'jazz-improv':
        return t('booking.jazzImprov', 'Jazz Improvisation');
      case 'vocal-health':
        return t('booking.vocalHealth', 'Stimmgesundheit');
      case 'performance':
        return t('booking.performance', 'Performance Skills');
      default:
        return '';
    }
  }
  
  // Get workshop duration
  const getWorkshopDuration = () => {
    switch(formData.workshopDuration) {
      case '2h':
        return t('booking.twoHours', '2 Stunden');
      case '4h':
        return t('booking.fourHours', '4 Stunden');
      case 'full-day':
        return t('booking.fullDay', 'Ganztägig (6-8 Stunden)');
      case 'multi-day':
        return t('booking.multiDay', 'Mehrtägig (nach Vereinbarung)');
      default:
        return '';
    }
  }
  
  // Get preferred dates formatted
  const getPreferredDatesFormatted = () => {
    if (!formData.preferredDates || formData.preferredDates.length === 0) return '';
    
    const dateMap: Record<string, string> = {
      'weekday-morning': t('booking.weekdayMorning', 'Wochentags vormittags'),
      'weekday-afternoon': t('booking.weekdayAfternoon', 'Wochentags nachmittags'),
      'weekday-evening': t('booking.weekdayEvening', 'Wochentags abends'),
      'weekend-morning': t('booking.weekendMorning', 'Wochenende vormittags'),
      'weekend-afternoon': t('booking.weekendAfternoon', 'Wochenende nachmittags'),
      'weekend-evening': t('booking.weekendEvening', 'Wochenende abends')
    };
    
    return formData.preferredDates.map(d => dateMap[d] || d).join(', ');
  }
  
  // Get service-specific details for email
  const getServiceSpecificDetails = () => {
    switch (serviceType) {
      case 'professioneller-gesang':
        return {
          event_type: formData.eventType,
          event_date: formData.eventDate,
          guest_count: formData.guestCount,
          jazz_standards: formData.jazzStandards,
          performance_type: formData.performanceType
        }
      case 'vocal-coaching':
        return {
          session_type: formData.sessionType,
          skill_level: formData.skillLevel,
          focus_areas: formData.focusArea?.join(', '),
          preferred_date: formData.preferredDate,
          preferred_time: formData.preferredTime
        }
      case 'gesangsunterricht':
        return {
          workshop_theme: formData.workshopTheme,
          group_size: formData.groupSize,
          preferred_dates: formData.preferredDates?.join(', '),
          workshop_duration: formData.workshopDuration
        }
      default:
        return {}
    }
  }
  
  // Check if all required fields are filled
  const validateForm = () => {
    const missing: string[] = [];
    
    if (!formData.termsAccepted) {
      missing.push(t('booking.termsAndConditions', 'AGB'));
    }
    
    if (!formData.privacyAccepted) {
      missing.push(t('booking.privacyPolicy', 'Datenschutzerklärung'));
    }
    
    setMissingFields(missing);
    return missing.length === 0;
  }
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the booking data to send
      const bookingData = {
        service_type: serviceType,
        contact: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        },
        // Add service-specific details
        ...getServiceSpecificDetails(),
        // Add legal acceptance
        terms_accepted: formData.termsAccepted,
        privacy_accepted: formData.privacyAccepted,
        timestamp: new Date().toISOString()
      };
      
      // Simulate API call with a delay
      console.log('Booking data to be sent:', bookingData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success notification with animated text
      setShowSuccessNotification(true);
      
      // After showing the success notification for a moment
      setTimeout(() => {
        // First fade out the success notification
        setShowSuccessNotification(false);
        
        // Then close the modal with a slight delay
        if (onClose) {
          setTimeout(() => {
            // Call onClose to close the booking form
            onClose();
            
            // After modal is closed, scroll smoothly to top
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
          }, 500);
        } else {
          // If no onClose function, just scroll to top after notification is gone
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 500);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error sending data:', error);
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="py-4 space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">
          {t('booking.bookingSummary', 'Buchung bestätigen')}
        </h3>
        
        <div className="bg-[#1A1A1A] rounded-lg p-5 border border-gray-800 shadow-lg">
          {/* Service Type */}
          <div className="mb-4 pb-3 border-b border-gray-800">
            <h4 className="text-lg font-medium text-white mb-2">
              {t('booking.selectedService', 'Ausgewählter Dienst')}
            </h4>
            <p className="text-[#C8A97E] font-medium">{getServiceName()}</p>
          </div>
          
          {/* Personal Information */}
          <div className="mb-4 pb-3 border-b border-gray-800">
            <h4 className="text-lg font-medium text-white mb-2">
              {t('booking.personalInfo', 'Persönliche Informationen')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-gray-400 text-sm">{t('booking.name', 'Name')}:</p>
                <p className="text-white font-medium">{formData.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">{t('booking.email', 'E-Mail')}:</p>
                <p className="text-white font-medium">{formData.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">{t('booking.phone', 'Telefon')}:</p>
                <p className="text-white font-medium">{formData.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
          
          {/* Service-specific details */}
          {serviceType === 'professioneller-gesang' && (
            <div className="mb-4 pb-3 border-b border-gray-800">
              <h4 className="text-lg font-medium text-white mb-2">
                {t('booking.eventDetails', 'Veranstaltungsdetails')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.eventType && (
                  <div>
                    <p className="text-gray-400 text-sm">{t('booking.eventType', 'Art der Veranstaltung')}:</p>
                    <p className="text-white font-medium">{getEventTypeName()}</p>
                  </div>
                )}
                {formData.performanceType && (
                  <div>
                    <p className="text-gray-400 text-sm">{t('booking.performanceType', 'Auftrittsart')}:</p>
                    <p className="text-white font-medium">
                      {formData.performanceType === 'solo' 
                        ? t('booking.solo', 'Solo') 
                        : t('booking.withBand', 'Mit Band')}
                    </p>
                  </div>
                )}
                {formData.eventDate && (
                  <div>
                    <p className="text-gray-400 text-sm">{t('booking.eventDate', 'Datum der Veranstaltung')}:</p>
                    <p className="text-white font-medium">{formatDate(formData.eventDate)}</p>
                  </div>
                )}
                {formData.guestCount && (
                  <div>
                    <p className="text-gray-400 text-sm">{t('booking.guestCount', 'Anzahl der Gäste')}:</p>
                    <p className="text-white font-medium">{formData.guestCount}</p>
                  </div>
                )}
                {formData.jazzStandards && (
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm">{t('booking.jazzStandards', 'Jazz Standards')}:</p>
                    <p className="text-white font-medium">{formData.jazzStandards}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {serviceType === 'vocal-coaching' && (
            <div className="mb-4 pb-3 border-b border-gray-800">
              <h4 className="text-lg font-medium text-white mb-2">
                {t('booking.sessionDetails', 'Session Details')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.sessionType && (
                  <div>
                    <p className="text-gray-400 text-sm">{t('booking.sessionType', 'Art der Session')}:</p>
                    <p className="text-white font-medium">{getSessionTypeName()}</p>
                  </div>
                )}
                {formData.skillLevel && (
                  <div>
                    <p className="text-gray-400 text-sm">{t('booking.skillLevel', 'Erfahrungslevel')}:</p>
                    <p className="text-white font-medium">{getSkillLevelName()}</p>
                  </div>
                )}
                {formData.focusArea && formData.focusArea.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm">{t('booking.focusAreas', 'Schwerpunkte')}:</p>
                    <p className="text-white font-medium">{formData.focusArea.join(', ')}</p>
                  </div>
                )}
                {formData.preferredDate && (
                  <div>
                    <p className="text-gray-400 text-sm">{t('booking.preferredDate', 'Bevorzugtes Datum')}:</p>
                    <p className="text-white font-medium">{formatDate(formData.preferredDate)}</p>
                  </div>
                )}
                {formData.preferredTime && (
                  <div>
                    <p className="text-gray-400 text-sm">{t('booking.preferredTime', 'Bevorzugte Uhrzeit')}:</p>
                    <p className="text-white font-medium">{formData.preferredTime}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {serviceType === 'gesangsunterricht' && (
            <div className="mb-4 pb-3 border-b border-gray-800">
              <h4 className="text-lg font-medium text-white mb-2">
                {t('booking.workshopDetails', 'Workshop Details')}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {formData.workshopTheme && (
                  <div>
                    <p className="text-gray-400 text-sm">{t('booking.workshopTheme', 'Workshop-Thema')}:</p>
                    <p className="text-white font-medium">{getWorkshopThemeName()}</p>
                  </div>
                )}
                {formData.groupSize && (
                  <div>
                    <p className="text-gray-400 text-sm">{t('booking.groupSize', 'Gruppengröße')}:</p>
                    <p className="text-white font-medium">{formData.groupSize}</p>
                  </div>
                )}
                {formData.workshopDuration && (
                  <div>
                    <p className="text-gray-400 text-sm">{t('booking.workshopDuration', 'Workshop-Dauer')}:</p>
                    <p className="text-white font-medium">{getWorkshopDuration()}</p>
                  </div>
                )}
                {formData.preferredDates && formData.preferredDates.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-gray-400 text-sm">{t('booking.preferredDates', 'Bevorzugte Termine')}:</p>
                    <p className="text-white font-medium">{getPreferredDatesFormatted()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Additional Information */}
          {formData.message && (
            <div className="mb-4 pb-3 border-b border-gray-800">
              <h4 className="text-lg font-medium text-white mb-2">
                {t('booking.additionalInfo', 'Zusätzliche Informationen')}
              </h4>
              <p className="text-white whitespace-pre-line">{formData.message}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Terms and Conditions */}
      <div className="pt-4">
        {/* Error message for missing fields */}
        <AnimatePresence>
          {missingFields.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start"
            >
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-200 text-sm">
                  {t('booking.acceptTermsError', 'Bitte akzeptieren Sie die folgenden Bedingungen:')}
                </p>
                <ul className="list-disc list-inside text-red-300 text-sm mt-1">
                  {missingFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="space-y-3 bg-[#121212] rounded-lg p-4 border border-gray-800 shadow-lg">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => onChange({ termsAccepted: e.target.checked })}
                className="w-4 h-4 accent-[#C8A97E] focus:ring-[#C8A97E] focus:ring-2"
                required
              />
            </div>
            <label htmlFor="terms" className="ml-2 text-sm text-gray-300">
              {t('booking.termsAgreement', 'Ich akzeptiere die ')}
              <button 
                type="button"
                onClick={() => setShowAGB(true)}
                className="text-[#C8A97E] hover:underline focus:outline-none"
              >
                {t('booking.termsAndConditions', 'AGB')}
              </button>
              . *
            </label>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="privacy"
                type="checkbox"
                checked={formData.privacyAccepted}
                onChange={(e) => onChange({ privacyAccepted: e.target.checked })}
                className="w-4 h-4 accent-[#C8A97E] focus:ring-[#C8A97E] focus:ring-2"
                required
              />
            </div>
            <label htmlFor="privacy" className="ml-2 text-sm text-gray-300">
              {t('booking.privacyAgreement', 'Ich akzeptiere die ')}
              <button 
                type="button"
                onClick={() => setShowDatenschutz(true)}
                className="text-[#C8A97E] hover:underline focus:outline-none"
              >
                {t('booking.privacyPolicy', 'Datenschutzerklärung')}
              </button>
              . *
            </label>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="py-3 px-10 w-full md:w-auto md:min-w-[200px] bg-[#C8A97E] text-black font-medium rounded-lg hover:bg-[#D4AF37] transition-colors flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('booking.submitting', 'Wird gesendet...')}
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                {t('booking.submit', 'Absenden')}
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur-sm"
            style={{ position: 'fixed' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1
              }}
              className="bg-[#1A1A1A] border border-[#C8A97E] rounded-lg shadow-lg p-6 max-w-md mx-4 flex flex-col items-center text-center"
            >
              <motion.div 
                className="w-16 h-16 rounded-full bg-[#C8A97E]/20 flex items-center justify-center mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.2
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Check className="w-8 h-8 text-[#C8A97E]" />
                </motion.div>
              </motion.div>
              <h4 className="text-white font-medium text-xl mb-2">
                <AnimatedText text={t('booking.bookingSuccess', 'Buchung erfolgreich!')} />
              </h4>
              <p className="text-gray-300">
                <AnimatedText text={t('booking.bookingSuccessMessage', 'Wir werden uns in Kürze bei Ihnen melden.')} />
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Legal Document Modals */}
      <LegalDocumentModal 
        isOpen={showAGB} 
        onClose={() => setShowAGB(false)}
        title={t('booking.termsAndConditions', 'AGB')}
      >
        <div className="p-1 legal-agb">
          <AGBContent />
        </div>
      </LegalDocumentModal>
      
      <LegalDocumentModal 
        isOpen={showDatenschutz} 
        onClose={() => setShowDatenschutz(false)}
        title={t('booking.privacyPolicy', 'Datenschutzerklärung')}
      >
        <div className="p-1 legal-datenschutz">
          <DatenschutzContent />
        </div>
      </LegalDocumentModal>
    </div>
  )
} 