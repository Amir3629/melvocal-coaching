export type ServiceType = 'gesangsunterricht' | 'vocal-coaching' | 'professioneller-gesang' | null;

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  serviceType?: ServiceType;
  
  // Live Singing fields
  eventType?: 'wedding' | 'corporate' | 'private' | 'other';
  eventDate?: string;
  guestCount?: string;
  musicPreferences?: string[];
  jazzStandards?: string;
  performanceType?: 'solo' | 'band';
  
  // Vocal Coaching fields
  sessionType?: '1:1' | 'group' | 'online';
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  focusArea?: string[];
  preferredDate?: string;
  preferredTime?: string;
  experience?: string;
  goals?: string;
  
  // Workshop fields
  workshopTheme?: string;
  groupSize?: string;
  preferredDates?: string[];
  workshopDuration?: string;
  
  // Additional fields
  location?: string;
  audienceSize?: string;
  repertoire?: string;
  genre?: string;
  duration?: string;
  
  // Legal
  termsAccepted: boolean;
  privacyAccepted: boolean;
  
  // Allow additional properties
  [key: string]: any;
}

// Export FormData as an alias to BookingFormData for backward compatibility
export type FormData = BookingFormData; 