"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Users, Calendar, Info, Clock, ExternalLink } from 'lucide-react'

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
  onFormDataChange: (data: Partial<FormData>) => void;
}

export default function WorkshopForm({ formData, onFormDataChange }: WorkshopFormProps) {
  const { t } = useTranslation()
  
  // Handle date selection
  const handlePreferredDateChange = (date: string) => {
    const currentDates = formData.preferredDates || []
    let newDates

    if (currentDates.includes(date)) {
      newDates = currentDates.filter(d => d !== date)
    } else {
      newDates = [...currentDates, date]
    }

    onFormDataChange({ preferredDates: newDates })
  }
  
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
              onChange={(e) => onFormDataChange({ name: e.target.value })}
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
              onChange={(e) => onFormDataChange({ email: e.target.value })}
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
              onChange={(e) => onFormDataChange({ phone: e.target.value })}
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
              onClick={() => onFormDataChange({ workshopTheme: 'jazz-improv' })}
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
              onClick={() => onFormDataChange({ workshopTheme: 'vocal-health' })}
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
              onClick={() => onFormDataChange({ workshopTheme: 'performance' })}
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
            onChange={(e) => onFormDataChange({ workshopDuration: e.target.value })}
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
            onChange={(e) => onFormDataChange({ groupSize: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors appearance-none"
          >
            <option value="">{t('booking.selectOption', 'Bitte wählen')}</option>
            <option value="2-5">{t('booking.small', 'Klein (2-5 Personen)')}</option>
            <option value="6-10">{t('booking.medium', 'Mittel (6-10 Personen)')}</option>
            <option value="11-20">{t('booking.large', 'Groß (11-20 Personen)')}</option>
            <option value="20+">{t('booking.extraLarge', 'Sehr groß (20+ Personen)')}</option>
          </select>
        </div>
        
        {/* Preferred Dates */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-[#C8A97E]" />
            {t('booking.preferredDates', 'Bevorzugte Termine')} 
            <span className="text-xs text-gray-400 ml-2">({t('booking.selectUpTo', 'bis zu 3 auswählen')})</span>
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weekday-morning"
                checked={formData.preferredDates?.includes('weekday-morning') || false}
                onChange={() => handlePreferredDateChange('weekday-morning')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
                disabled={formData.preferredDates?.length === 3 && !formData.preferredDates?.includes('weekday-morning')}
              />
              <label htmlFor="weekday-morning" className="text-gray-300 text-sm">
                {t('booking.weekdayMorning', 'Wochentags vormittags')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weekday-afternoon"
                checked={formData.preferredDates?.includes('weekday-afternoon') || false}
                onChange={() => handlePreferredDateChange('weekday-afternoon')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
                disabled={formData.preferredDates?.length === 3 && !formData.preferredDates?.includes('weekday-afternoon')}
              />
              <label htmlFor="weekday-afternoon" className="text-gray-300 text-sm">
                {t('booking.weekdayAfternoon', 'Wochentags nachmittags')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weekday-evening"
                checked={formData.preferredDates?.includes('weekday-evening') || false}
                onChange={() => handlePreferredDateChange('weekday-evening')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
                disabled={formData.preferredDates?.length === 3 && !formData.preferredDates?.includes('weekday-evening')}
              />
              <label htmlFor="weekday-evening" className="text-gray-300 text-sm">
                {t('booking.weekdayEvening', 'Wochentags abends')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weekend-morning"
                checked={formData.preferredDates?.includes('weekend-morning') || false}
                onChange={() => handlePreferredDateChange('weekend-morning')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
                disabled={formData.preferredDates?.length === 3 && !formData.preferredDates?.includes('weekend-morning')}
              />
              <label htmlFor="weekend-morning" className="text-gray-300 text-sm">
                {t('booking.weekendMorning', 'Wochenende vormittags')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weekend-afternoon"
                checked={formData.preferredDates?.includes('weekend-afternoon') || false}
                onChange={() => handlePreferredDateChange('weekend-afternoon')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
                disabled={formData.preferredDates?.length === 3 && !formData.preferredDates?.includes('weekend-afternoon')}
              />
              <label htmlFor="weekend-afternoon" className="text-gray-300 text-sm">
                {t('booking.weekendAfternoon', 'Wochenende nachmittags')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="weekend-evening"
                checked={formData.preferredDates?.includes('weekend-evening') || false}
                onChange={() => handlePreferredDateChange('weekend-evening')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
                disabled={formData.preferredDates?.length === 3 && !formData.preferredDates?.includes('weekend-evening')}
              />
              <label htmlFor="weekend-evening" className="text-gray-300 text-sm">
                {t('booking.weekendEvening', 'Wochenende abends')}
              </label>
            </div>
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
            onChange={(e) => onFormDataChange({ message: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg text-white focus:border-[#C8A97E] focus:outline-none transition-colors min-h-[100px]"
            placeholder={t('booking.workshopGoals', 'Spezifische Wünsche oder Anforderungen für den Workshop')}
          />
        </div>
      </div>
    </div>
  )
} 