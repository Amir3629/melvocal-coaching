// This file handles Google Calendar integration

import { google } from "googleapis"

// Initialize Google Calendar API
const initCalendarClient = () => {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  })

  return google.calendar({ version: "v3", auth })
}

// Get available time slots
export async function getAvailableTimeSlots(date: string) {
  try {
    const calendar = initCalendarClient()

    // Get start and end of the day
    const startDate = new Date(date)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(date)
    endDate.setHours(23, 59, 59, 999)

    // Get events for the day
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    })

    const events = response.data.items || []

    // Generate all possible time slots (9:00 - 18:00, 30 min intervals)
    const allTimeSlots = []
    for (let hour = 9; hour <= 18; hour++) {
      if (hour !== 13) {
        // Skip lunch hour
        allTimeSlots.push(`${hour}:00`)
        if (hour !== 18) allTimeSlots.push(`${hour}:30`)
      }
    }

    // Filter out booked time slots
    const bookedTimeSlots = events.map((event) => {
      const start = new Date(event.start?.dateTime || "")
      return `${start.getHours()}:${start.getMinutes() === 0 ? "00" : "30"}`
    })

    const availableTimeSlots = allTimeSlots.filter((slot) => !bookedTimeSlots.includes(slot))

    return availableTimeSlots
  } catch (error) {
    console.error("Error fetching available time slots:", error)
    return []
  }
}

// Create a booking in Google Calendar
export async function createBooking(bookingData: {
  name: string
  email: string
  phone: string
  date: string
  time: string
  service: string
  level?: string
  message?: string
}) {
  try {
    const calendar = initCalendarClient()

    // Parse date and time
    const [year, month, day] = bookingData.date.split("-").map(Number)
    const [hour, minute] = bookingData.time.split(":").map(Number)

    // Create start and end times (1 hour duration)
    const startTime = new Date(year, month - 1, day, hour, minute)
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // Add 1 hour

    // Create event
    const event = {
      summary: `${bookingData.service} - ${bookingData.name}`,
      description: `
        Name: ${bookingData.name}
        Email: ${bookingData.email}
        Phone: ${bookingData.phone}
        ${bookingData.level ? `Level: ${bookingData.level}` : ""}
        ${bookingData.message ? `Message: ${bookingData.message}` : ""}
      `,
      start: {
        dateTime: startTime.toISOString(),
        timeZone: "Europe/Berlin",
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: "Europe/Berlin",
      },
      attendees: [{ email: bookingData.email }, { email: "info@melanie-wainwright.de" }],
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 day before
          { method: "popup", minutes: 60 }, // 1 hour before
        ],
      },
    }

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      requestBody: event,
      sendUpdates: "all",
    })

    return response.data
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

