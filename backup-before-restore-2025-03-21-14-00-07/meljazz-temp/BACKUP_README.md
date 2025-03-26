# Vocal Coaching Website Backup

This is a backup of the Vocal Coaching website project created on March 17, 2025.

## Project Overview

This is a Next.js project for a vocal coaching website with the following features:
- Booking system for various services (Vocal Coaching, Live Jazz Performance, Jazz Workshop)
- Google Calendar integration
- Multi-language support (German and English)
- Responsive design

## Key Components

1. **Booking System**:
   - Service selection
   - Service-specific forms
   - Confirmation step
   - Email notifications

2. **Pages**:
   - Home page
   - Booking page
   - Calendar page
   - Success page
   - Legal pages (AGB, Datenschutz, Impressum)

3. **Technologies Used**:
   - Next.js 14.2.16
   - React 18
   - Tailwind CSS
   - Framer Motion
   - i18next for translations
   - EmailJS for email notifications

## How to Restore

1. **Install Dependencies**:
   ```
   npm install
   ```

2. **Development Server**:
   ```
   npm run dev
   ```

3. **Build for Production**:
   ```
   npm run build
   ```

4. **Deploy to GitHub Pages**:
   ```
   npm run deploy
   ```

## Recent Fixes

- Fixed issues with @headlessui/react by downgrading to version 1.7.17
- Updated FormData interface to include all required fields
- Fixed prop name mismatch in ServiceSelection component
- Updated ProgressBar component to accept both string and number types for currentStep

## Notes for Future Development

- The booking system is fully functional with Google Calendar integration
- All forms are set up for jazz-focused services
- The GitHub Pages deployment is configured in the workflow file
- The project uses a custom domain configuration in next.config.js

This backup was created to preserve the working state of the project after fixing build errors and ensuring successful deployment to GitHub Pages. 