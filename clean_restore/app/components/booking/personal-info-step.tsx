"use client"

import { useTranslation } from 'react-i18next';

interface PersonalInfoStepProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  onChange: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
  onFormDataChange?: (data: any) => void;
}

export default function PersonalInfoStep({ 
  formData, 
  onChange, 
  onNext, 
  onBack,
  onFormDataChange 
}: PersonalInfoStepProps) {
  const { t } = useTranslation();
  
  // Use the appropriate change handler (support both naming conventions)
  const handleChange = (data: any) => {
    if (onFormDataChange) {
      onFormDataChange(data);
    } else if (onChange) {
      onChange(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-white">
            {t('booking.name', 'Name')} *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange({ name: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-white">
            {t('booking.email', 'E-Mail')} *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleChange({ email: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-white">
            {t('booking.phone', 'Telefon')} *
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange({ phone: e.target.value })}
            className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-white">
          {t('booking.message', 'Nachricht')}
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange({ message: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 bg-[#1A1A1A] border border-gray-800 rounded-lg focus:ring-[#C8A97E] focus:border-[#C8A97E] text-white"
        />
      </div>
      
      {/* Add navigation buttons if onNext/onBack are provided */}
      {(onNext || onBack) && (
        <div className="flex justify-between mt-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 bg-transparent border border-gray-700 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              {t('booking.back', 'Zurück')}
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={onNext}
              className="px-4 py-2 bg-[#C8A97E] text-white rounded-lg hover:bg-[#B89A6E] transition-colors ml-auto"
            >
              {t('booking.continue', 'Weiter')}
            </button>
          )}
        </div>
      )}
    </div>
  );
} 