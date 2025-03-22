"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Users, Calendar, Info, Clock, ExternalLink } from 'lucide-react'
import GoogleCalendarPicker from '../ui/google-calendar-picker'

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  workshopTheme?: string;
  groupSize?: string;
  preferredDates?: string[];
  workshopDuration?: string;
  termsAccepted: boolean;
}

interface WorkshopFormProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
}

export default function WorkshopForm({ formData, onChange }: WorkshopFormProps) {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4">
          {t('booking.personalInfo', 'Persönliche Informationen')}
        </h3>
        
        {/* Name, Email, Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              {t('booking.name', 'Name')} *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors"
              placeholder={t('booking.namePlaceholder', 'Ihr vollständiger Name')}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              {t('booking.email', 'E-Mail')} *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => onChange({ email: e.target.value })}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors"
              placeholder={t('booking.emailPlaceholder', 'Ihre E-Mail-Adresse')}
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
              {t('booking.phone', 'Telefon')} *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors"
              placeholder={t('booking.phonePlaceholder', 'Ihre Telefonnummer')}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-6 space-y-4">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-[#C8A97E]" />
          {t('booking.jazzWorkshopDetails', 'Jazz Workshop Details')}
        </h3>
        
        {/* Workshop Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('booking.workshopTheme', 'Workshop-Thema')} *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onChange({ workshopTheme: 'jazz-improv' })}
              className={`px-4 py-3 rounded-lg border ${
                formData.workshopTheme === 'jazz-improv'
                  ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              } transition-colors`}
            >
              <div className="text-center">
                <span className="block text-sm font-medium">{t('booking.jazzImprov', 'Jazz Improvisation')}</span>
                <span className="text-xs text-gray-400 mt-1 block">
                  {t('booking.jazzImprovDesc', 'Scat-Gesang & Jazz-Phrasierung')}
                </span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => onChange({ workshopTheme: 'vocal-health' })}
              className={`px-4 py-3 rounded-lg border ${
                formData.workshopTheme === 'vocal-health'
                  ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              } transition-colors`}
            >
              <div className="text-center">
                <span className="block text-sm font-medium">{t('booking.vocalHealth', 'Stimmgesundheit')}</span>
                <span className="text-xs text-gray-400 mt-1 block">
                  {t('booking.vocalHealthDesc', 'Stimmhygiene & Prävention')}
                </span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => onChange({ workshopTheme: 'performance' })}
              className={`px-4 py-3 rounded-lg border ${
                formData.workshopTheme === 'performance'
                  ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              } transition-colors`}
            >
              <div className="text-center">
                <span className="block text-sm font-medium">{t('booking.performance', 'Performance Skills')}</span>
                <span className="text-xs text-gray-400 mt-1 block">
                  {t('booking.performanceDesc', 'Bühnenpräsenz & Ausdruck')}
                </span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Workshop Duration */}
        <div>
          <label htmlFor="workshopDuration" className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
            <Clock className="w-4 h-4 mr-1 text-[#C8A97E]" />
            {t('booking.workshopDuration', 'Workshop-Dauer')} *
          </label>
          <select
            id="workshopDuration"
            value={formData.workshopDuration || ''}
            onChange={(e) => onChange({ workshopDuration: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors appearance-none"
          >
            <option value="">{t('booking.selectOption', 'Bitte wählen')}</option>
            <option value="2h">{t('booking.twoHours', '2 Stunden')}</option>
            <option value="4h">{t('booking.fourHours', '4 Stunden')}</option>
            <option value="full-day">{t('booking.fullDay', 'Ganztägig (6-8 Stunden)')}</option>
            <option value="multi-day">{t('booking.multiDay', 'Mehrtägig (nach Vereinbarung)')}</option>
          </select>
        </div>
        
        {/* Group Size */}
        <div>
          <label htmlFor="groupSize" className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
            <Users className="w-4 h-4 mr-1 text-[#C8A97E]" />
            {t('booking.groupSize', 'Gruppengröße')} *
          </label>
          <select
            id="groupSize"
            value={formData.groupSize || ''}
            onChange={(e) => onChange({ groupSize: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors appearance-none"
          >
            <option value="">{t('booking.selectOption', 'Bitte wählen')}</option>
            <option value="2-5">{t('booking.small', 'Klein (2-5 Personen)')}</option>
            <option value="6-10">{t('booking.medium', 'Mittel (6-10 Personen)')}</option>
            <option value="11-20">{t('booking.large', 'Groß (11-20 Personen)')}</option>
            <option value="20+">{t('booking.extraLarge', 'Sehr groß (20+ Personen)')}</option>
          </select>
        </div>
        
        {/* Preferred Dates with Google Calendar */}
        <div className="space-y-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-[#C8A97E] mr-2" />
            <h3 className="text-lg font-medium text-white">
              {t('booking.workshopScheduling', 'Workshop-Termin')}
            </h3>
          </div>
          
          <div className="bg-[#111]/50 border border-[#C8A97E]/20 rounded-lg p-4">
            <p className="text-sm text-gray-300 mb-4">
              {t('booking.workshopCalendarInfo', 'Wählen Sie einen Termin für Ihren Workshop. Verfügbare Zeiten basieren auf meinem Kalender.')}
            </p>
            
            <GoogleCalendarPicker 
              onChange={(date) => {
                if (date) {
                  // Convert the selected date to a string representation
                  const dateStr = date.toISOString().split('T')[0];
                  // Store the date in the preferredDates array
                  onChange({ 
                    preferredDates: [dateStr] 
                  });
                } else {
                  onChange({ preferredDates: [] });
                }
              }}
              value={formData.preferredDates && formData.preferredDates.length > 0
                ? new Date(formData.preferredDates[0])
                : undefined}
              placeholder={t('booking.selectDatePlaceholder', 'Datum auswählen')}
              className="mb-4"
            />
          </div>
        </div>
        
        {/* Additional Information */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
            <Info className="w-4 h-4 mr-1 text-[#C8A97E]" />
            {t('booking.additionalInfo', 'Zusätzliche Informationen')}
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => onChange({ message: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors min-h-[100px]"
            placeholder={t('booking.workshopGoals', 'Spezifische Wünsche oder Anforderungen für den Workshop')}
          />
        </div>
      </div>
    </div>
  )
} 