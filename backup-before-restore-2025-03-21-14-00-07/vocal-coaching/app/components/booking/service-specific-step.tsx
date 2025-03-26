"use client"

import { useTranslation } from 'react-i18next';
import { ServiceType } from '@/app/types/booking';
import VocalCoachingForm from './vocal-coaching-form';
import GesangsunterrichtForm from './gesangsunterricht-form';
import ProfessionalSingingForm from './professional-singing-form';

interface ServiceSpecificStepProps {
  serviceType: ServiceType;
  formData: any;
  onFormDataChange: (data: any) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export default function ServiceSpecificStep({ 
  serviceType, 
  formData, 
  onFormDataChange,
  onNext,
  onBack
}: ServiceSpecificStepProps) {
  const { t } = useTranslation();

  // Handle case where serviceType is undefined
  if (!serviceType) {
    return <div className="text-red-500">{t('booking.error.noServiceSelected', 'Bitte wählen Sie zuerst einen Dienst aus.')}</div>;
  }

  const renderServiceForm = () => {
    switch (serviceType) {
      case 'vocal-coaching':
        return (
          <VocalCoachingForm
            formData={formData}
            onFormDataChange={onFormDataChange}
          />
        );
      case 'gesangsunterricht':
        return (
          <GesangsunterrichtForm
            formData={formData}
            onFormDataChange={onFormDataChange}
          />
        );
      case 'professioneller-gesang':
        return (
          <ProfessionalSingingForm
            formData={formData}
            onFormDataChange={onFormDataChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {renderServiceForm()}
      
      {/* Navigation buttons */}
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