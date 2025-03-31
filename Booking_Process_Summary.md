# Booking Process Optimization for Vercel

## Current Issues

The booking step process cards in the vocal coaching website aren't displaying correctly on mobile devices, despite working fine on desktop. The main problems include:

1. Progress bars not rendering correctly on mobile
2. Form cards having inconsistent spacing and alignment on mobile 
3. Google Calendar integration not showing properly on mobile
4. Service selection cards not being properly sized on smaller screens

## Required Files for Context

These are the key files needed to understand and fix the booking process:

1. `app/components/booking/booking-form.tsx` - Main container component
2. `app/components/booking/progress-bar.tsx` - Desktop progress indicator
3. `app/components/booking/mobile-progress-bar.tsx` - Mobile progress indicator
4. `app/components/booking/service-selection.tsx` - Service selection step
5. `app/components/booking/personal-info-step.tsx` - Personal information form
6. `app/components/booking/confirmation-step.tsx` - Booking confirmation step
7. `app/types/booking.ts` - Type definitions
8. `app/lib/google-calendar.ts` - Google Calendar integration
9. `app/styles/responsive.css` - Responsive styling
10. `app/booking/page.tsx` - Booking page container

## Google Calendar Integration

The Google Calendar integration needs to be embedded directly in the booking flow to:
1. Show calendar availability without redirecting to Google Calendar
2. Display 2-3 pre-filled "busy" events per month to demonstrate service popularity
3. Connect with the email (info@melanie-wainwright.de) for form submissions

Google Calendar iframe code:
```html
<iframe src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ30T2yfDb7XKvIARrVply2KIPItFAg7-YUnQlejiuhoJalU3tvpj3ZR6Vn5klhf33WZjAu9QmYR?gv=true" style="border: 0" width="100%" height="600" frameborder="0"></iframe>
```

## Design Requirements

- Maintain the existing gold/black color scheme (#C8A97E for gold accents)
- Ensure consistent styling across desktop and mobile
- Keep the responsive card design with proper spacing
- Fix bullet points in the service cards
- Optimize image coverage in the background of cards

## Mobile Optimizations Needed

1. **Progress Bar**:
   - Ensure the mobile progress indicator works correctly
   - Fix alignment and spacing issues

2. **Service Selection Cards**:
   - Make cards more compact on mobile
   - Ensure proper spacing and alignment
   - Fix animation performance issues

3. **Form Fields**:
   - Optimize spacing and sizing for mobile input
   - Ensure labels and fields align properly
   - Fix validation message positioning

4. **Calendar Integration**:
   - Make the calendar responsive
   - Ensure date selection works on touch devices
   - Display availability in a mobile-friendly format

5. **Confirmation Screen**:
   - Optimize layout for smaller screens
   - Ensure all information is clearly visible
   - Fix button positioning

## Implementation Notes

- All form submissions should go to info@melanie-wainwright.de
- The booking process should maintain the current multi-step approach
- Custom Google Calendar integration should show some pre-booked dates
- The overall design language should match the existing site

For detailed code references, please see the comprehensive files in the `BookingProcess_README_Part1.md` through `BookingProcess_README_Part5.md` which contain all the relevant code components.

## Expected Deliverables

1. Mobile-optimized booking process components
2. Integrated Google Calendar component
3. Fixed responsive styling
4. Email integration for form submissions
5. "Fake booking" implementation to show busy schedule 