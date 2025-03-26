import { useTranslation } from 'react-i18next';
import { FormData } from '@/app/types/booking';

interface ProfessionalSingingFormProps {
  formData: FormData;
  onFormDataChange: (data: Partial<FormData>) => void;
}

export default function ProfessionalSingingForm({ formData, onFormDataChange }: ProfessionalSingingFormProps) {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-300 mb-1">
          {t('forms.eventDate', 'Veranstaltungsdatum')}
        </label>
        <input
          type="date"
          id="eventDate"
          name="eventDate"
          value={formData.eventDate || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="eventTime" className="block text-sm font-medium text-gray-300 mb-1">
          {t('forms.eventTime', 'Veranstaltungszeit')}
        </label>
        <input
          type="time"
          id="eventTime"
          name="eventTime"
          value={formData.eventTime || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
          required
        />
      </div>

      <div>
        <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-300 mb-1">
          {t('forms.eventLocation', 'Veranstaltungsort')}
        </label>
        <input
          type="text"
          id="eventLocation"
          name="eventLocation"
          value={formData.eventLocation || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
          placeholder={t('forms.eventLocationPlaceholder', 'Adresse oder Name des Veranstaltungsorts')}
          required
        />
      </div>

      <div>
        <label htmlFor="eventType" className="block text-sm font-medium text-gray-300 mb-1">
          {t('forms.eventType', 'Art der Veranstaltung')}
        </label>
        <select
          id="eventType"
          name="eventType"
          value={formData.eventType || ''}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
          required
        >
          <option value="">{t('forms.selectEventType', 'Bitte wählen')}</option>
          <option value="wedding">{t('forms.wedding', 'Hochzeit')}</option>
          <option value="corporate">{t('forms.corporate', 'Firmenveranstaltung')}</option>
          <option value="private">{t('forms.private', 'Private Veranstaltung')}</option>
          <option value="other">{t('forms.other', 'Sonstiges')}</option>
        </select>
      </div>

      <div>
        <label htmlFor="eventDetails" className="block text-sm font-medium text-gray-300 mb-1">
          {t('forms.eventDetails', 'Details zur Veranstaltung')}
        </label>
        <textarea
          id="eventDetails"
          name="eventDetails"
          value={formData.eventDetails || ''}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#C8A97E] focus:border-transparent"
          placeholder={t('forms.eventDetailsPlaceholder', 'Beschreiben Sie die Details Ihrer Veranstaltung...')}
          required
        />
      </div>
    </div>
  );
} 