// Type definitions for the booking system

// Service types
export type ServiceType = "gesangsunterricht" | "vocal-coaching" | "professioneller-gesang" | null

// Form data interface
export interface FormData {
  name: string
  email: string
  phone: string
  message: string

  // Live Singing fields
  eventType?: "wedding" | "corporate" | "private" | "other"
  eventDate?: string
  eventTime?: string
  guestCount?: string
  musicPreferences?: string[]
  jazzStandards?: string
  performanceType?: "solo" | "band"

  // Vocal Coaching fields
  sessionType?: "1:1" | "group" | "online"
  skillLevel?: "beginner" | "intermediate" | "advanced"
  focusArea?: string[]
  preferredDate?: string
  preferredTime?: string

  // Workshop fields
  workshopTheme?: string
  groupSize?: string
  preferredDates?: string[]
  workshopDuration?: string

  // Legal
  termsAccepted: boolean
  privacyAccepted: boolean
}

