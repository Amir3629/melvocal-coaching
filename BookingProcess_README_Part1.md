# Booking Process Documentation - Part 1: Structure and Overview

## Overview of Booking Process

The booking system is a multi-step process that allows users to book different services:
1. Live Jazz Performance
2. Vocal Coaching & Gesangsunterricht
3. Jazz Workshop

The process consists of these main steps:
1. Service Selection
2. Personal Information
3. Service-specific Details
4. Confirmation

## File Structure

### Main Components
- `app/booking/page.tsx` - Main booking page
- `app/components/booking/booking-form.tsx` - Container component for the booking process
- `app/components/booking/service-selection.tsx` - Service selection step
- `app/components/booking/personal-info-step.tsx` - Personal information form
- `app/components/booking/live-singing-form.tsx` - Live performance booking form
- `app/components/booking/vocal-coaching-form.tsx` - Vocal coaching booking form
- `app/components/booking/workshop-form.tsx` - Workshop booking form
- `app/components/booking/confirmation-step.tsx` - Booking confirmation step
- `app/components/booking/progress-bar.tsx` - Desktop progress bar
- `app/components/booking/mobile-progress-bar.tsx` - Mobile-optimized progress bar
- `app/types/booking.ts` - Type definitions for the booking process

### Calendar Integration
- `app/lib/google-calendar.ts` - Integration with Google Calendar API

## Data Types

The `app/types/booking.ts` file defines the types for the booking process:

```typescript
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
```

## Main Booking Page

The `app/booking/page.tsx` file is the entry point for the booking process:

```tsx
import React from 'react'
import BookingForm from '../components/booking/booking-form'

export const metadata = {
  title: 'Booking | Melanie Becker Vocal Coaching',
  description: 'Book a jazz performance, vocal coaching session, or workshop with Melanie Becker.',
}

export default function BookingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Booking
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Buchen Sie einen Live-Auftritt, eine Coaching-Session oder einen Workshop.
          Füllen Sie das Formular aus und wir melden uns bei Ihnen.
        </p>
      </div>
      
      <BookingForm />
    </div>
  )
}
``` 