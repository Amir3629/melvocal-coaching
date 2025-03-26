import { useTranslation } from 'react-i18next';
import { FormData } from '@/app/types/booking';

interface GesangsunterrichtFormProps {
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
}

export default function GesangsunterrichtForm({ formData, onFormDataChange }: GesangsunterrichtFormProps) {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-300 mb-1">
          {t('forms.preferredDate', 'Bevorzugtes Datum')}
        </label>
        <input
          type="date"
          id="preferredDate"
          name="preferredDate"
          value={formData.preferredDate || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-300 mb-1">
          {t('forms.preferredTime', 'Bevorzugte Uhrzeit')}
        </label>
        <input
          type="time"
          id="preferredTime"
          name="preferredTime"
          value={formData.preferredTime || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-300 mb-1">
          {t('forms.experience', 'Gesangserfahrung')}
        </label>
        <select
          id="experience"
          name="experience"
          value={formData.experience || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
          required
        >
          <option value="">{t('forms.selectExperience', 'Bitte wählen')}</option>
          <option value="beginner">{t('forms.beginner', 'Anfänger')}</option>
          <option value="intermediate">{t('forms.intermediate', 'Fortgeschritten')}</option>
          <option value="advanced">{t('forms.advanced', 'Fortgeschritten')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="goals" className="block text-sm font-medium text-gray-300 mb-1">
          {t('forms.goals', 'Ihre Ziele')}
        </label>
        <textarea
          id="goals"
          name="goals"
          value={formData.goals || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
          placeholder={t('forms.goalsPlaceholder', 'Beschreiben Sie Ihre Gesangsziele...')}
          required
        />
      </div>
    </div>
  );
} 