import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Initialize the Google Calendar API client
const auth = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

// Set credentials
auth.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: 'v3', auth });

// Calendar ID for your booking calendar
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

// Function to get available time slots
export async function getAvailableTimeSlots(date: string) {
  try {
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date(date).toISOString(),
      timeMax: new Date(new Date(date).setDate(new Date(date).getDate() + 1)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    const busySlots = events.map(event => ({
      start: new Date(event.start?.dateTime || event.start?.date || ''),
      end: new Date(event.end?.dateTime || event.end?.date || ''),
    }));

    // Generate available time slots (assuming 1-hour slots)
    const availableSlots = [];
    const startTime = new Date(date);
    startTime.setHours(9, 0, 0, 0); // Start at 9 AM
    const endTime = new Date(date);
    endTime.setHours(18, 0, 0, 0); // End at 6 PM

    while (startTime < endTime) {
      const slotStart = new Date(startTime);
      const slotEnd = new Date(startTime);
      slotEnd.setHours(slotEnd.getHours() + 1);

      // Check if slot overlaps with any busy slots
      const isAvailable = !busySlots.some(busySlot => 
        (slotStart >= busySlot.start && slotStart < busySlot.end) ||
        (slotEnd > busySlot.start && slotEnd <= busySlot.end)
      );

      if (isAvailable) {
        availableSlots.push({
          start: new Date(slotStart),
          end: new Date(slotEnd),
        });
      }

      startTime.setHours(startTime.getHours() + 1);
    }

    return availableSlots;
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    throw error;
  }
}

// Function to create a booking
export async function createBooking(
  startTime: string,
  endTime: string,
  customerName: string,
  customerEmail: string,
  serviceType: string,
  additionalDetails: string
) {
  try {
    const event = {
      summary: `${serviceType} - ${customerName}`,
      description: `Customer: ${customerName}\nEmail: ${customerEmail}\nService: ${serviceType}\n\nAdditional Details:\n${additionalDetails}`,
      start: {
        dateTime: startTime,
        timeZone: 'Europe/Berlin',
      },
      end: {
        dateTime: endTime,
        timeZone: 'Europe/Berlin',
      },
    };

    const response = await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: event,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// Function to check if a time slot is available
export async function isTimeSlotAvailable(startTime: string, endTime: string) {
  try {
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: startTime,
      timeMax: endTime,
      singleEvents: true,
    });

    return !response.data.items || response.data.items.length === 0;
  } catch (error) {
    console.error('Error checking time slot availability:', error);
    throw error;
  }
} 