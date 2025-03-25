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
    if (!formData.preferredDates?.length) return '';
    return formData.preferredDates.map(date => formatDate(date)).join(', ');
  }
  
  // Get service-specific details
  const getServiceSpecificDetails = () => {
    switch(serviceType) {
      case 'professioneller-gesang':
        return (
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-[#C8A97E]" />
              <span className="text-gray-400">{t('booking.eventDate', 'Datum')}:</span>
              <span className="ml-2 text-white">{formatDate(formData.eventDate)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-2 text-[#C8A97E]" />
              <span className="text-gray-400">{t('booking.guestCount', 'Gäste')}:</span>
              <span className="ml-2 text-white">{formData.guestCount}</span>
            </div>
            <div className="flex items-center text-sm">
              <Music className="w-4 h-4 mr-2 text-[#C8A97E]" />
              <span className="text-gray-400">{t('booking.performanceType', 'Performance')}:</span>
              <span className="ml-2 text-white">{getPerformanceTypeName()}</span>
            </div>
          </div>
        );
      case 'vocal-coaching':
        return (
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <BookOpen className="w-4 h-4 mr-2 text-[#C8A97E]" />
              <span className="text-gray-400">{t('booking.sessionType', 'Session')}:</span>
              <span className="ml-2 text-white">{getSessionTypeName()}</span>
            </div>
            <div className="flex items-center text-sm">
              <Target className="w-4 h-4 mr-2 text-[#C8A97E]" />
              <span className="text-gray-400">{t('booking.skillLevel', 'Level')}:</span>
              <span className="ml-2 text-white">{getSkillLevelName()}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-[#C8A97E]" />
              <span className="text-gray-400">{t('booking.preferredDate', 'Datum')}:</span>
              <span className="ml-2 text-white">{formatDate(formData.preferredDate)}</span>
            </div>
          </div>
        );
      case 'gesangsunterricht':
        return (
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <BookOpen className="w-4 h-4 mr-2 text-[#C8A97E]" />
              <span className="text-gray-400">{t('booking.workshopTheme', 'Thema')}:</span>
              <span className="ml-2 text-white">{getWorkshopThemeName()}</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-2 text-[#C8A97E]" />
              <span className="text-gray-400">{t('booking.groupSize', 'Gruppengröße')}:</span>
              <span className="ml-2 text-white">{formData.groupSize}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-[#C8A97E]" />
              <span className="text-gray-400">{t('booking.duration', 'Dauer')}:</span>
              <span className="ml-2 text-white">{getWorkshopDuration()}</span>
            </div>
            {formData.preferredDates?.length > 0 && (
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2 text-[#C8A97E]" />
                <span className="text-gray-400">{t('booking.preferredDates', 'Termine')}:</span>
                <span className="ml-2 text-white">{getPreferredDatesFormatted()}</span>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  }
  
  // Validate form
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
      // Here you would integrate with your backend to save the booking
      // and create the Google Calendar event
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success notification
      setShowSuccessNotification(true);
      
      // Hide success notification after a delay
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 3000);
      
      // Reset form for next use
      setIsSubmitting(false);
      onClose?.();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-3 sm:space-y-4">
        <div className="bg-[#1A1A1A] rounded-lg p-3 sm:p-4 border border-gray-800 shadow-lg">
          {/* Service Type */}
          <div className="mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-800">
            <h4 className="text-sm sm:text-base font-medium text-white mb-1">
              {t('booking.selectedService', 'Ausgewählter Dienst')}
            </h4>
            <p className="text-[#C8A97E] font-medium text-sm sm:text-base">{getServiceName()}</p>
          </div>
          
          {/* Personal Information */}
          <div className="mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-800">
            <h4 className="text-sm sm:text-base font-medium text-white mb-1">
              {t('booking.personalInfo', 'Persönliche Informationen')}
            </h4>
            <div className="space-y-1">
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">{t('booking.name', 'Name')}:</p>
                <p className="text-white text-sm sm:text-base">{formData.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">{t('booking.email', 'E-Mail')}:</p>
                <p className="text-white text-sm sm:text-base">{formData.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">{t('booking.phone', 'Telefon')}:</p>
                <p className="text-white text-sm sm:text-base">{formData.phone || 'N/A'}</p>
              </div>
              {formData.message && (
                  <div>
                  <p className="text-gray-400 text-xs sm:text-sm">{t('booking.message', 'Nachricht')}:</p>
                  <p className="text-white text-sm sm:text-base">{formData.message}</p>
                  </div>
                )}
              </div>
            </div>
          
          {/* Service Specific Details */}
          <div className="mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-800">
            <h4 className="text-sm sm:text-base font-medium text-white mb-1">
              {t('booking.serviceDetails', 'Details zum Dienst')}
              </h4>
            {getServiceSpecificDetails()}
            </div>
          
          {/* Terms and Privacy */}
          <div className="space-y-3">
          <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => onChange({ termsAccepted: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-gray-700 text-[#C8A97E] focus:ring-[#C8A97E] bg-[#1A1A1A]"
              />
              <label htmlFor="terms" className="ml-2 text-xs sm:text-sm text-gray-300">
                {t('booking.termsAccept', 'Ich akzeptiere die')}{' '}
              <button 
                type="button"
                onClick={() => setShowAGB(true)}
                  className="text-[#C8A97E] hover:underline"
              >
                {t('booking.termsAndConditions', 'AGB')}
              </button>
            </label>
          </div>
          
          <div className="flex items-start">
              <input
                type="checkbox"
                id="privacy"
                checked={formData.privacyAccepted}
                onChange={(e) => onChange({ privacyAccepted: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-gray-700 text-[#C8A97E] focus:ring-[#C8A97E] bg-[#1A1A1A]"
              />
              <label htmlFor="privacy" className="ml-2 text-xs sm:text-sm text-gray-300">
                {t('booking.privacyAccept', 'Ich akzeptiere die')}{' '}
              <button 
                type="button"
                onClick={() => setShowDatenschutz(true)}
                  className="text-[#C8A97E] hover:underline"
              >
                {t('booking.privacyPolicy', 'Datenschutzerklärung')}
              </button>
            </label>
            </div>
          </div>
          </div>
        </div>
        
        {/* Submit Button */}
      <div className="flex justify-end">
          <button
            onClick={handleSubmit}
          disabled={isSubmitting || !formData.termsAccepted || !formData.privacyAccepted}
          className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            isSubmitting || !formData.termsAccepted || !formData.privacyAccepted
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-[#C8A97E] text-black hover:bg-[#B69468]'
          }`}
        >
          {isSubmitting ? t('booking.submitting', 'Wird gesendet...') : t('booking.submit', 'Jetzt buchen')}
          </button>
      </div>
      
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            <AnimatedText text={t('booking.successMessage', 'Ihre Anfrage wurde erfolgreich gesendet!')} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Legal Document Modals */}
      <LegalDocumentModal 
        isOpen={showAGB} 
        onClose={() => setShowAGB(false)}
        title={t('booking.termsAndConditions', 'AGB')}
        content={<AGBContent />}
      />
      
      <LegalDocumentModal 
        isOpen={showDatenschutz} 
        onClose={() => setShowDatenschutz(false)}
        title={t('booking.privacyPolicy', 'Datenschutzerklärung')}
        content={<DatenschutzContent />}
      />
    </div>
  )
} 