# Google Calendar Integration for Booking System

This document explains how to set up and use the Google Calendar integration for the booking system.

## Setup Instructions

### 1. Google Cloud Project Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API" and enable it

### 2. Create a Service Account

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Enter a name and description for the service account
4. Grant the "Calendar API" > "Calendar Editor" role
5. Click "Done"

### 3. Create and Download Service Account Key

1. Click on the newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose JSON as the key type
5. Download the key file

### 4. Share Your Calendar

1. Go to [Google Calendar](https://calendar.google.com/)
2. Find your calendar in the left sidebar
3. Click the three dots next to it and select "Settings and sharing"
4. Scroll down to "Share with specific people"
5. Click "Add people" and enter the service account email address (found in the JSON key file)
6. Set permissions to "Make changes to events"
7. Click "Send"

### 5. Set Environment Variables

Add the following environment variables to your project:

```
GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Email configuration
EMAIL_HOST=your-smtp-host
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
CONTACT_EMAIL=info@melanie-wainwright.de
```

Notes:
- `GOOGLE_CALENDAR_ID` is the ID of your Google Calendar, found in the calendar settings.
- `GOOGLE_CLIENT_EMAIL` is the email address of your service account, found in the JSON key file.
- `GOOGLE_PRIVATE_KEY` is the private key from your JSON key file. Make sure to include the newlines using `\n`.

### 6. Testing the Setup

Use the provided `test-calendar.js` script to test if your Google Calendar integration is working:

```
node test-calendar.js
```

This script will:
1. Test listing events from your calendar
2. Create a test event 
3. Delete the test event

If everything is working correctly, you'll see a success message.

## Features Implemented

### 1. Fake Bookings

The system includes "fake bookings" to make your calendar appear busier without creating real events. These fake bookings are defined in `lib/google-calendar.ts`:

```typescript
export const FAKE_BOOKINGS = [
  { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), time: '14:00' },
  { date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), time: '10:00' },
  // ...additional fake bookings
];
```

You can modify these to add more fake bookings throughout the month.

### 2. Calendar Component

The `components/calendar-integration.tsx` component provides a user-friendly interface for selecting dates and times. It shows:

- A date picker calendar
- Available time slots for the selected date
- Visual indicators for dates with bookings

### 3. API Routes

The following API routes are implemented:

- `app/api/booking/route.ts`: Handles form submissions, creates calendar events, and sends email notifications
- `app/api/booking/availability/route.ts`: Provides available time slots for a specific date

### 4. Email Notifications

When a booking is made, the system sends two email notifications:

1. A confirmation email to the customer
2. A notification email to the admin (info@melanie-wainwright.de)

## Mobile Optimization

The calendar component is fully responsive and optimized for mobile devices:

- The date picker scales to fit screen size
- Time slots are displayed in a grid that adjusts based on screen width
- Touch-friendly buttons with adequate sizing
- Visual indicators that work well on smaller screens

## Customization

### Changing Fake Bookings

To add or change fake bookings, edit the `FAKE_BOOKINGS` array in `lib/google-calendar.ts`.

### Changing Email Templates

To modify the email templates, edit the HTML strings in `lib/email-service.ts`.

### Changing Calendar Appearance

To modify the appearance of the calendar, edit the styling in `components/calendar-integration.tsx`.

## Troubleshooting

### Calendar API Access Issues

- Check that your service account has the correct permissions
- Verify that you've shared your calendar with the service account
- Ensure your environment variables are correct

### Email Sending Issues

- Check your SMTP settings in the environment variables
- Try a different email provider if necessary
- Ensure your email/password credentials are correct 
GITHUB_PAGES=false

# Google Calendar API
GOOGLE_CALENDAR_ID=your_calendar_id_here
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
SMTP_FROM=info@melanie-wainwright.de
ADMIN_EMAIL=info@melanie-wainwright.de

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000 