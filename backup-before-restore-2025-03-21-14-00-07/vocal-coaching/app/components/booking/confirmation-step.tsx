"use client"

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Calendar, Users, Music, BookOpen, Target, Info, Clock, AlertCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LegalDocumentModal from '../legal-document-modal'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { FormData } from '@/app/types/booking'

// Dynamically import legal document contents
const DatenschutzContent = dynamic(
  () => import("@/app/datenschutz/page").catch(() => () => (
    <div className="text-red-500">Failed to load Datenschutz content</div>
  )),
  { loading: () => <p className="text-gray-400">Loading...</p>, ssr: false }
)

const AGBContent = dynamic(
  () => import("@/app/agb/page").catch(() => () => (
    <div className="text-red-500">Failed to load AGB content</div>
  )),
  { loading: () => <p className="text-gray-400">Loading...</p>, ssr: false }
)

// Service types
type ServiceType = 'gesangsunterricht' | 'vocal-coaching' | 'professioneller-gesang' | null

interface ConfirmationStepProps {
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
  onSubmit: () => void;
  onLegalDocumentClick: (type: 'terms' | 'privacy') => void;
}

export default function ConfirmationStep({ 
  formData, 
  onFormDataChange, 
  onSubmit,
  onLegalDocumentClick 
}: ConfirmationStepProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const [showAGB, setShowAGB] = useState(false)
  const [showDatenschutz, setShowDatenschutz] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [acceptedPrivacyPolicy, setAcceptedPrivacyPolicy] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(undefined, {
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
    switch(formData.serviceType) {
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
    
    return formData.preferredDates.map((d: string) => dateMap[d] || d).join(', ');
  }
  
  // Get service-specific details for email
  const getServiceSpecificDetails = () => {
    switch (formData.serviceType) {
      case 'professioneller-gesang':
        return {
          event_type: formData.eventType,
          event_date: formData.eventDate,
          guest_count: formData.guestCount,
          jazz_standards: formData.jazzStandards
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
    const requiredFields = ['name', 'email', 'phone', 'termsAccepted', 'privacyAccepted']
    const missing = requiredFields.filter(field => !formData[field as keyof FormData])
    
    if (missing.length > 0) {
      setMissingFields(missing)
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Prepare email data
      const emailData = {
        service_id: 'service_xxxxxxx', // Replace with your EmailJS service ID
        template_id: 'template_xxxxxxx', // Replace with your EmailJS template ID
        user_id: 'user_xxxxxxxxxx', // Replace with your EmailJS user ID
        template_params: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          service_type: formData.serviceType,
          ...getServiceSpecificDetails()
        }
      }
      
      // Send email (commented out for now)
      // const response = await emailjs.send(
      //   emailData.service_id,
      //   emailData.template_id,
      //   emailData.template_params,
      //   emailData.user_id
      // )
      
      // Show success notification
      setShowSuccessNotification(true)
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowSuccessNotification(false)
      }, 5000)
      
      // No redirection to success page
    } catch (error) {
      console.error('Error sending email:', error)
      // Handle error
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onFormDataChange({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Bestätigung</h3>
        <p className="text-sm text-gray-500">
          Bitte überprüfen Sie Ihre Eingaben und bestätigen Sie die Datenschutzerklärung.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="privacy"
              name="privacyAccepted"
              type="checkbox"
              checked={formData.privacyAccepted}
              onChange={(e) => onFormDataChange({ privacyAccepted: e.target.checked })}
              className="h-4 w-4 text-[#C8A97E] focus:ring-[#C8A97E] border-gray-600 rounded"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="privacy" className="font-medium text-gray-700">
              Ich akzeptiere die{' '}
              <button
                type="button"
                onClick={() => onLegalDocumentClick('privacy')}
                className="text-blue-600 hover:text-blue-500"
              >
                Datenschutzerklärung
              </button>
            </label>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="termsAccepted"
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => onFormDataChange({ termsAccepted: e.target.checked })}
              className="h-4 w-4 text-[#C8A97E] focus:ring-[#C8A97E] border-gray-600 rounded"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              Ich akzeptiere die{' '}
              <button
                type="button"
                onClick={() => onLegalDocumentClick('terms')}
                className="text-blue-600 hover:text-blue-500"
              >
                AGB
              </button>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!formData.privacyAccepted || !formData.termsAccepted}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Anfrage senden
        </button>
      </div>

      {isPrivacyPolicyOpen && (
        <LegalDocumentModal
          isOpen={isPrivacyPolicyOpen}
          onClose={() => setIsPrivacyPolicyOpen(false)}
          title="Datenschutzerklärung"
        >
          <DatenschutzContent />
        </LegalDocumentModal>
      )}

      {isTermsOpen && (
        <LegalDocumentModal
          isOpen={isTermsOpen}
          onClose={() => setIsTermsOpen(false)}
          title="AGB"
        >
          <AGBContent />
        </LegalDocumentModal>
      )}

      <AnimatePresence>
        {showSuccessNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-[100]"
          >
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check className="h-6 w-6 text-green-600" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Vielen Dank für Ihre Anfrage!
                </h3>
                <p className="text-sm text-gray-500">
                  Wir werden uns in Kürze bei Ihnen melden.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 