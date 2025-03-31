# Booking Process Documentation - Part 5: Email Integration and Responsive Design

## Email Service Integration

The `email-service.ts` file handles sending email notifications:

```typescript
import nodemailer from 'nodemailer';

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send contact form email
export async function sendContactEmail(formData: {
  name: string;
  email: string;
  message: string;
  phone?: string;
  type?: 'contact' | 'booking';
}) {
  try {
    const { name, email, message, phone, type = 'contact' } = formData;
    
    const mailOptions = {
      from: `"Melanie Becker Website" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@melanie-wainwright.de',
      subject: type === 'contact' 
        ? `Neue Kontaktanfrage von ${name}`
        : `Neue Buchungsanfrage von ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${type === 'contact' ? 'Neue Kontaktanfrage' : 'Neue Buchungsanfrage'}</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>E-Mail:</strong> ${email}</p>
          ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ''}
          <div style="margin-top: 20px;">
            <p><strong>Nachricht:</strong></p>
            <p style="white-space: pre-line;">${message}</p>
          </div>
        </div>
      `,
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
}

// Send booking confirmation email
export async function sendBookingConfirmationEmail(formData: {
  name: string;
  email: string;
  service: string;
  date?: string;
  time?: string;
  details?: string;
}) {
  try {
    const { name, email, service, date, time, details } = formData;
    
    const mailOptions = {
      from: `"Melanie Becker Vocal Coaching" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Bestätigung Ihrer Buchung - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Buchungsbestätigung</h2>
          <p>Hallo ${name},</p>
          <p>vielen Dank für Ihre Buchung. Wir haben Ihre Anfrage erhalten und werden uns in Kürze bei Ihnen melden.</p>
          
          <div style="margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;">
            <h3 style="color: #333; margin-top: 0;">Buchungsdetails</h3>
            <p><strong>Service:</strong> ${service}</p>
            ${date ? `<p><strong>Datum:</strong> ${date}</p>` : ''}
            ${time ? `<p><strong>Uhrzeit:</strong> ${time}</p>` : ''}
            ${details ? `<p><strong>Details:</strong> ${details}</p>` : ''}
          </div>
          
          <p>Falls Sie Fragen haben, kontaktieren Sie uns bitte unter <a href="mailto:info@melanie-wainwright.de">info@melanie-wainwright.de</a>.</p>
          
          <p>Mit freundlichen Grüßen,<br>Melanie Becker<br>Vocal Coaching</p>
        </div>
      `,
    };
    
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
}
```

## Responsive Design Considerations

The booking process components are designed to be responsive across different devices. Here are the key considerations:

### Desktop vs Mobile Progress Indicators

The booking flow uses two different progress indicators:

1. **Desktop Progress Bar (`progress-bar.tsx`)**: A horizontal, step-by-step indicator for larger screens.
2. **Mobile Progress Bar (`mobile-progress-bar.tsx`)**: A vertical, more compact progress indicator for mobile devices.

The appropriate component is shown based on screen size:

```tsx
{/* Desktop progress bar (hidden on mobile) */}
<div className="hidden sm:block mb-8">
  <ProgressBar 
    currentStep={getStepIdentifier()} 
    totalSteps={4} 
    labels={[
      t('booking.service', 'Dienst'),
      t('booking.personal', 'Persönlich'),
      t('booking.details', 'Details'),
      t('booking.confirm', 'Bestätigen')
    ]}
  />
</div>

{/* Mobile progress bar (hidden on desktop) */}
<div className="sm:hidden">
  <MobileProgressBar 
    currentStep={getStepIdentifier()} 
    totalSteps={4} 
    labels={[
      t('booking.service', 'Dienst'),
      t('booking.personal', 'Persönlich'),
      t('booking.details', 'Details'),
      t('booking.confirm', 'Bestätigen')
    ]}
  />
</div>
```

### Responsive Form Layouts

The form layouts use Tailwind CSS responsive classes to adjust spacing and layout on different screen sizes:

```tsx
<div className="max-w-4xl mx-auto px-4 sm:px-6">
  {/* Form content */}
  <div className="bg-[#121212] border border-gray-800 rounded-xl p-4 sm:p-6 mb-6 overflow-hidden">
    {renderStep()}
  </div>
  
  {/* Navigation buttons */}
  <div className="mt-6 mb-8 flex justify-between items-center">
    {currentStep > 0 ? (
      <button
        type="button"
        onClick={handlePrevStep}
        className="px-4 sm:px-6 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#222] transition-colors border border-gray-700"
      >
        {t('booking.back', 'Zurück')}
      </button>
    ) : (
      <div></div>
    )}
    
    <div className={currentStep === 0 ? 'w-full' : 'w-auto'}>
      {/* Next/Submit button */}
    </div>
  </div>
</div>
```

## Optimization Opportunities

Here are some potential optimizations for the booking process:

### 1. Google Calendar Integration Enhancement

The Google Calendar integration could be enhanced to:

- Show a visual calendar with available slots
- Allow real-time selection of available time slots
- Implement busy/occupied dates to show limited availability (2-3 events per month)

```tsx
// Example component for enhanced calendar integration
const EnhancedCalendar = ({ onDateSelect, preBookedDates }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Fetch available dates from Google Calendar
    const fetchAvailableDates = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/calendar/available-dates');
        const data = await response.json();
        setAvailableDates(data.dates);
      } catch (error) {
        console.error('Error fetching available dates:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAvailableDates();
  }, []);
  
  // Render calendar with available, pre-booked, and unavailable dates
  // ...
};
```

### 2. Form Validation Improvements

The form validation could be enhanced using a form validation library:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define validation schema using zod
const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().min(6, 'Ungültige Telefonnummer'),
});

const PersonalInfoStep = ({ formData, onChange }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: formData,
  });
  
  const onSubmit = (data) => {
    onChange(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields with validation */}
    </form>
  );
};
```

### 3. Performance Optimizations

#### Lazy Loading Components

Non-critical components could be lazy-loaded to improve initial load performance:

```tsx
import dynamic from 'next/dynamic';

// Lazy load service-specific forms
const LiveSingingForm = dynamic(() => import('./live-singing-form'));
const VocalCoachingForm = dynamic(() => import('./vocal-coaching-form'));
const WorkshopForm = dynamic(() => import('./workshop-form'));
```

#### Image Optimization

Optimize images used in the booking process:

```tsx
import Image from 'next/image';

// Example optimized image in a service card
<div className="relative h-24 w-24 rounded-full overflow-hidden">
  <Image
    src="/images/services/vocal-coaching.jpg"
    alt="Vocal Coaching"
    fill
    sizes="(max-width: 768px) 96px, 128px"
    className="object-cover"
  />
</div>
```

### 4. Mobile UX Improvements

#### Touch-Friendly Controls

Ensure all interactive elements are touch-friendly with appropriate sizing:

```css
.touch-friendly-button {
  min-height: 44px;  /* Minimum recommended touch target size */
  min-width: 44px;
  padding: 12px 16px;
  font-size: 16px;   /* Minimum recommended font size on mobile */
}
```

#### Simplified Mobile Forms

Simplify form layouts on mobile devices:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Form fields that stack on mobile but display in 2 columns on desktop */}
</div>
```

## Integration with Email and Calendar

To connect the booking process with email and calendar:

1. Create an API route to handle form submissions:

```typescript
// pages/api/booking.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { createBooking } from '@/app/lib/google-calendar';
import { sendBookingConfirmationEmail, sendContactEmail } from '@/app/lib/email-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const formData = req.body;
    
    // Create booking in Google Calendar
    await createBooking({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.preferredDate || formData.eventDate,
      time: formData.preferredTime || '12:00',
      service: formData.serviceType,
      level: formData.skillLevel,
      message: formData.message,
    });
    
    // Send confirmation email to user
    await sendBookingConfirmationEmail({
      name: formData.name,
      email: formData.email,
      service: formData.serviceType,
      date: formData.preferredDate || formData.eventDate,
      time: formData.preferredTime,
      details: formData.message,
    });
    
    // Send notification email to admin
    await sendContactEmail({
      name: formData.name,
      email: formData.email,
      message: `Neue Buchung für ${formData.serviceType}`,
      phone: formData.phone,
      type: 'booking',
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error handling booking:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

2. Connect the front-end form to the API:

```typescript
// In confirmation-step.tsx
const handleSubmit = async () => {
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  
  try {
    const response = await fetch('/api/booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        serviceType,
      }),
    });
    
    if (response.ok) {
      setShowSuccessNotification(true);
      // Redirect to success page
      setTimeout(() => {
        router.push('/booking/success');
      }, 2000);
    } else {
      throw new Error('Failed to submit booking');
    }
  } catch (error) {
    console.error('Error submitting booking:', error);
    // Show error notification
  } finally {
    setIsSubmitting(false);
  }
};
``` 