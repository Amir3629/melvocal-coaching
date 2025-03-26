export type ServiceType = 'vocal-coaching' | 'gesangsunterricht' | 'professioneller-gesang';

export interface FormData {
  // Common fields
  name: string;
  email: string;
  phone: string;
  message: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  serviceType?: ServiceType;
  
  // Gesangsunterricht form fields
  experience?: string;
  preferredDate?: string;
  preferredTime?: string;
  goals?: string;
  
  // Professional singing form fields
  eventType?: string;
  eventDate?: string;
  location?: string;
  audienceSize?: string;
  repertoire?: string;
  
  // Vocal coaching form fields
  sessionType?: string;
  skillLevel?: string;
  genre?: string;
  preferredDates?: string[];
  
  // Workshop form fields
  workshopTheme?: string;
  groupSize?: string;
  duration?: string;
  
  // Other possible fields
  [key: string]: any;
} 