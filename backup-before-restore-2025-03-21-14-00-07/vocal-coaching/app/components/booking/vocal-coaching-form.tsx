"use client"

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Users, BarChart, Target, Info, Calendar, Clock, ExternalLink } from 'lucide-react'

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  sessionType?: '1:1' | 'group' | 'online';
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: string[];
  preferredDate?: string;
  preferredTime?: string;
  termsAccepted: boolean;
}

interface VocalCoachingFormProps {
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
}

export default function VocalCoachingForm({ formData, onFormDataChange }: VocalCoachingFormProps) {
  const { t } = useTranslation()
  
  // Handle checkbox changes for focus areas
  const handleFocusAreaChange = (area: string) => {
    const currentAreas = formData.focusArea || []
    let newAreas

    if (currentAreas.includes(area)) {
      newAreas = currentAreas.filter(a => a !== area)
    } else {
      newAreas = [...currentAreas, area]
    }

    onFormDataChange({ focusArea: newAreas })
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
          <Users className="w-5 h-5 mr-2 text-[#C8A97E]" />
          {t('booking.sessionDetails', 'Session Details')}
        </h3>
        
        {/* Session Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('booking.sessionType', 'Art der Session')} *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onFormDataChange({ sessionType: '1:1' })}
              className={`px-4 py-3 rounded-lg border ${
                formData.sessionType === '1:1'
                  ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              } transition-colors`}
            >
              <div className="text-center">
                <span className="block text-sm font-medium">1:1 {t('booking.privateSession', 'Einzelunterricht')}</span>
                <span className="text-xs text-gray-400 mt-1 block">
                  {t('booking.personalizedCoaching', 'Personalisiertes Coaching')}
                </span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => onFormDataChange({ sessionType: 'group' })}
              className={`px-4 py-3 rounded-lg border ${
                formData.sessionType === 'group'
                  ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              } transition-colors`}
            >
              <div className="text-center">
                <span className="block text-sm font-medium">{t('booking.groupSession', 'Gruppenunterricht')}</span>
                <span className="text-xs text-gray-400 mt-1 block">
                  {t('booking.learnWithOthers', 'Lernen in der Gruppe')}
                </span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => onFormDataChange({ sessionType: 'online' })}
              className={`px-4 py-3 rounded-lg border ${
                formData.sessionType === 'online'
                  ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              } transition-colors`}
            >
              <div className="text-center">
                <span className="block text-sm font-medium">{t('booking.onlineSession', 'Online Coaching')}</span>
                <span className="text-xs text-gray-400 mt-1 block">
                  {t('booking.remoteTraining', 'Fernunterricht via Video')}
                </span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Skill Level */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <BarChart className="w-4 h-4 mr-1 text-[#C8A97E]" />
            {t('booking.skillLevel', 'Erfahrungslevel')} *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onFormDataChange({ skillLevel: 'beginner' })}
              className={`px-4 py-2 rounded-lg border ${
                formData.skillLevel === 'beginner'
                  ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              } transition-colors text-sm`}
            >
              {t('booking.beginner', 'Anfänger')}
            </button>
            
            <button
              type="button"
              onClick={() => onFormDataChange({ skillLevel: 'intermediate' })}
              className={`px-4 py-2 rounded-lg border ${
                formData.skillLevel === 'intermediate'
                  ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              } transition-colors text-sm`}
            >
              {t('booking.intermediate', 'Fortgeschritten')}
            </button>
            
            <button
              type="button"
              onClick={() => onFormDataChange({ skillLevel: 'advanced' })}
              className={`px-4 py-2 rounded-lg border ${
                formData.skillLevel === 'advanced'
                  ? 'bg-[#C8A97E]/20 border-[#C8A97E] text-white'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
              } transition-colors text-sm`}
            >
              {t('booking.advanced', 'Profi')}
            </button>
          </div>
        </div>
        
        {/* Focus Areas */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
            <Target className="w-4 h-4 mr-1 text-[#C8A97E]" />
            {t('booking.focusAreas', 'Schwerpunkte')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="range"
                checked={formData.focusArea?.includes('range') || false}
                onChange={() => handleFocusAreaChange('range')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
              />
              <label htmlFor="range" className="text-gray-300 text-sm">
                {t('booking.vocalRange', 'Stimmumfang')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="breath"
                checked={formData.focusArea?.includes('breath') || false}
                onChange={() => handleFocusAreaChange('breath')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
              />
              <label htmlFor="breath" className="text-gray-300 text-sm">
                {t('booking.breathControl', 'Atemkontrolle')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="technique"
                checked={formData.focusArea?.includes('technique') || false}
                onChange={() => handleFocusAreaChange('technique')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
              />
              <label htmlFor="technique" className="text-gray-300 text-sm">
                {t('booking.technique', 'Technik')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="stage"
                checked={formData.focusArea?.includes('stage') || false}
                onChange={() => handleFocusAreaChange('stage')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
              />
              <label htmlFor="stage" className="text-gray-300 text-sm">
                {t('booking.stagePresence', 'Bühnenpräsenz')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="style"
                checked={formData.focusArea?.includes('style') || false}
                onChange={() => handleFocusAreaChange('style')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
              />
              <label htmlFor="style" className="text-gray-300 text-sm">
                {t('booking.style', 'Stilentwicklung')}
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="interpretation"
                checked={formData.focusArea?.includes('interpretation') || false}
                onChange={() => handleFocusAreaChange('interpretation')}
                className="w-4 h-4 mr-2 accent-[#C8A97E]"
              />
              <label htmlFor="interpretation" className="text-gray-300 text-sm">
                {t('booking.interpretation', 'Interpretation')}
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preferred Date and Time */}
      <div className="space-y-4">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-[#C8A97E] mr-2" />
          <h3 className="text-lg font-medium text-white">
            {t('booking.calendarIntegration', 'Terminplanung')}
          </h3>
        </div>
        
        <div className="bg-[#1A1A1A]/50 border border-[#C8A97E]/20 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="preferredDate" className="block text-sm font-medium text-white">
                {t('booking.preferredDate', 'Bevorzugtes Datum')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="date"
                  id="preferredDate"
                  value={formData.preferredDate || ''}
                  onChange={(e) => onFormDataChange({ preferredDate: e.target.value })}
                  className="w-full pl-10 px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="preferredTime" className="block text-sm font-medium text-white">
                {t('booking.preferredTime', 'Bevorzugte Uhrzeit')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <select
                  id="preferredTime"
                  value={formData.preferredTime || ''}
                  onChange={(e) => onFormDataChange({ preferredTime: e.target.value })}
                  className="w-full pl-10 px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white appearance-none"
                >
                  <option value="">{t('booking.selectOption', 'Bitte wählen')}</option>
                  <option value="morning">{t('booking.morning', 'Vormittag (9:00 - 12:00)')}</option>
                  <option value="afternoon">{t('booking.afternoon', 'Nachmittag (12:00 - 17:00)')}</option>
                  <option value="evening">{t('booking.evening', 'Abend (17:00 - 20:00)')}</option>
                </select>
              </div>
            </div>
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
          placeholder={t('booking.coachingGoals', 'Ihre Ziele und Erwartungen an das Coaching')}
        />
      </div>
    </div>
  )
} 