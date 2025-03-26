import { useTranslation } from 'react-i18next';
import { ServiceType } from '@/app/types/booking';

interface ServiceSelectionStepProps {
  selectedService: ServiceType | null;
  onServiceSelect: (service: ServiceType) => void;
}

export default function ServiceSelectionStep({ selectedService, onServiceSelect }: ServiceSelectionStepProps) {
  const { t } = useTranslation();

  const services = [
    {
      id: 'vocal-coaching' as ServiceType,
      name: t('services.vocalCoaching', 'Vocal Coaching'),
      description: t('services.vocalCoachingDesc', 'Professionelles Coaching für Ihre Stimme'),
    },
    {
      id: 'gesangsunterricht' as ServiceType,
      name: t('services.gesangsunterricht', 'Gesangsunterricht'),
      description: t('services.gesangsunterrichtDesc', 'Individueller Gesangsunterricht'),
    },
    {
      id: 'professioneller-gesang' as ServiceType,
      name: t('services.professionalSinging', 'Professioneller Gesang'),
      description: t('services.professionalSingingDesc', 'Professionelle Gesangsdarbietungen'),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onServiceSelect(service.id)}
            className={`p-4 rounded-lg border-2 transition-colors ${
              selectedService === service.id
                ? 'border-[#C8A97E] bg-[#C8A97E]/10'
                : 'border-gray-800 hover:border-[#C8A97E]/50'
            }`}
          >
            <h3 className="text-lg font-medium text-white mb-1">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
} 