import { google } from 'googleapis'
import { format } from 'date-fns'

// Initialize Google Calendar API
const calendar = google.calendar('v3')

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

// Set credentials
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
})

const CALENDAR_ID = process.env.CALENDAR_ID || '03f666a170f6a57c27dc6dc2593214eb912d75be29b4080777dccdb7e51cc3d0@group.calendar.google.com'

export async function getAvailableSlots(date: Date) {
  try {
    // Get events for the specified date
    const response = await calendar.events.list({
      auth: oauth2Client,
      calendarId: CALENDAR_ID,
      timeMin: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
      timeMax: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = response.data.items || []
    const busySlots = events.map(event => ({
      start: new Date(event.start?.dateTime || ''),
      end: new Date(event.end?.dateTime || '')
    }))

    // Generate all possible time slots for the day
    const allSlots = []
    const startHour = 9 // 9 AM
    const endHour = 20 // 8 PM
    const slotDuration = 60 // 60 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = new Date(date)
      slotStart.setHours(hour, 0, 0, 0)
      
      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotStart.getMinutes() + slotDuration)

      // Check if slot overlaps with any busy slots
      const isAvailable = !busySlots.some(busy => 
        (slotStart >= busy.start && slotStart < busy.end) ||
        (slotEnd > busy.start && slotEnd <= busy.end) ||
        (slotStart <= busy.start && slotEnd >= busy.end)
      )

      if (isAvailable) {
        allSlots.push({
          time: format(slotStart, 'HH:mm') + ' - ' + format(slotEnd, 'HH:mm'),
          available: true
        })
      }
    }

    return allSlots
  } catch (error) {
    console.error('Error fetching calendar slots:', error)
    return []
  }
}

export async function createBooking(bookingData: {
  date: Date
  time: string
  name: string
  email: string
  phone?: string
  level?: string
  message?: string
}) {
  try {
    const [startTime] = bookingData.time.split(' - ')
    const [hours, minutes] = startTime.split(':')
    
    const startDateTime = new Date(bookingData.date)
    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)
    
    const endDateTime = new Date(startDateTime)
    endDateTime.setHours(startDateTime.getHours() + 1)

    const event = {
      summary: `Gesangsstunde - ${bookingData.name}`,
      description: `
Level: ${bookingData.level || 'Nicht angegeben'}
Email: ${bookingData.email}
Telefon: ${bookingData.phone || 'Nicht angegeben'}
Nachricht: ${bookingData.message || 'Keine Nachricht'}
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
        { email: bookingData.email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 hours
          { method: 'popup', minutes: 30 }, // 30 minutes
        ],
      },
    }

    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: CALENDAR_ID,
      requestBody: event,
      sendUpdates: 'all', // Send emails to attendees
    })

    return response.data
  } catch (error) {
    console.error('Error creating calendar event:', error)
    throw error
  }
} 