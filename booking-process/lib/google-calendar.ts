import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Define fake bookings to make the schedule appear busy
export const FAKE_BOOKINGS = [
  { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), time: '14:00' },
  { date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), time: '10:00' },
  { date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), time: '16:30' },
  { date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), time: '11:00' },
  { date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), time: '15:00' },
];

// Create a new OAuth2 client with the credentials
const getAuthClient = (): OAuth2Client => {
  // For service account authentication
  if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL) {
    return new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
  }
  
  // For OAuth2 authentication (alternative)
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  return oauth2Client;
};

// Get Google Calendar client
const getCalendarClient = () => {
  const auth = getAuthClient();
  return google.calendar({ version: 'v3', auth });
};

// Get all events for a specific date
export async function getEventsForDate(date: Date): Promise<any[]> {
  try {
    const calendar = getCalendarClient();
    
    // Set time boundaries for the day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get events from Google Calendar
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    // Add fake bookings
    const realEvents = response.data.items || [];
    
    // Get fake bookings for this date
    const fakesForDate = FAKE_BOOKINGS.filter(booking => {
      const bookingDate = new Date(booking.date);
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    });
    
    // Convert fake bookings to event format
    const fakeEvents = fakesForDate.map(fake => {
      const [hours, minutes] = fake.time.split(':').map(Number);
      
      const start = new Date(date);
      start.setHours(hours, minutes, 0, 0);
      
      const end = new Date(start);
      end.setHours(end.getHours() + 1); // 1-hour slots
      
      return {
        id: `fake-${start.toISOString()}`,
        summary: 'Booked',
        start: {
          dateTime: start.toISOString(),
          timeZone: 'Europe/Berlin',
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: 'Europe/Berlin',
        },
        isFake: true
      };
    });
    
    return [...realEvents, ...fakeEvents];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Get available time slots for a specific date
export async function getAvailableTimeSlots(date: Date): Promise<any[]> {
  try {
    // Get all events for the date (real and fake)
    const events = await getEventsForDate(date);
    
    // Define business hours (9:00 AM to 6:00 PM)
    const businessHours = {
      start: 9, // 9:00 AM
      end: 18,  // 6:00 PM
    };
    
    // Define slot duration in minutes
    const slotDuration = 60; // 1 hour
    
    // Create array of all possible time slots
    const allSlots = [];
    
    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
      
      // Check if slot overlaps with any event
      const isAvailable = !events.some(event => {
        const eventStart = new Date(event.start.dateTime || event.start.date);
        const eventEnd = new Date(event.end.dateTime || event.end.date);
        
        return (
          (slotStart >= eventStart && slotStart < eventEnd) ||
          (slotEnd > eventStart && slotEnd <= eventEnd) ||
          (slotStart <= eventStart && slotEnd >= eventEnd)
        );
      });
      
      if (isAvailable) {
        allSlots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
          formattedTime: `${hour.toString().padStart(2, '0')}:00 - ${hour + 1}:00`,
        });
      }
    }
    
    return allSlots;
  } catch (error) {
    console.error('Error getting available time slots:', error);
    return [];
  }
}

// Create a new booking in Google Calendar
export async function createBooking(bookingData: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  details?: string;
}) {
  try {
    const calendar = getCalendarClient();
    
    // Parse date and time
    const [startTime] = bookingData.time.split(' - ');
    const [hours, minutes] = startTime.split(':').map(Number);
    
    // Create start and end dates
    const startDateTime = new Date(bookingData.date);
    startDateTime.setHours(hours, minutes, 0, 0);
    
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1); // 1-hour booking
    
    // Create event
    const event = {
      summary: `Booking: ${bookingData.service} - ${bookingData.name}`,
      description: `
Name: ${bookingData.name}
Email: ${bookingData.email}
Phone: ${bookingData.phone}
Service: ${bookingData.service}
${bookingData.details ? `Details: ${bookingData.details}` : ''}
      `.trim(),
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Europe/Berlin',
      },
      attendees: [
        { email: bookingData.email },
        { email: process.env.CONTACT_EMAIL || 'info@melanie-wainwright.de' }
      ],
      reminders: {
        useDefault: true,
      },
    };
    
    // Insert event into calendar
    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
      sendUpdates: 'all', // Send email updates to attendees
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
} 