import { NextRequest, NextResponse } from 'next/server'
import { createBooking } from '@/lib/google-calendar'
import { sendBookingConfirmationEmail, sendBookingNotificationEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    // Get form data from request
    const formData = await request.json()

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.serviceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Determine date and time from the form based on service type
    let bookingDate = ''
    let bookingTime = ''
    
    if (formData.serviceType === 'professioneller-gesang') {
      bookingDate = formData.eventDate
      bookingTime = formData.eventTime || '12:00 - 13:00' // Default time
    } else if (formData.serviceType === 'vocal-coaching') {
      bookingDate = formData.preferredDate
      bookingTime = formData.preferredTime || '12:00 - 13:00'
    } else if (formData.serviceType === 'gesangsunterricht') {
      // For workshopo, take the first preferred date
      bookingDate = formData.preferredDates?.[0] || ''
      bookingTime = formData.workshopTime || '12:00 - 13:00'
    }
    
    // Create booking in Google Calendar
    const details = `${formData.message || ''}
${formData.serviceType === 'professioneller-gesang' ? `Event Type: ${formData.eventType || ''}\nGuest Count: ${formData.guestCount || ''}\nPerformance Type: ${formData.performanceType || ''}` : ''}
${formData.serviceType === 'vocal-coaching' ? `Session Type: ${formData.sessionType || ''}\nSkill Level: ${formData.skillLevel || ''}\nFocus Area: ${formData.focusArea?.join(', ') || ''}` : ''}
${formData.serviceType === 'gesangsunterricht' ? `Workshop Theme: ${formData.workshopTheme || ''}\nGroup Size: ${formData.groupSize || ''}\nWorkshop Duration: ${formData.workshopDuration || ''}` : ''}
`
    
    // Create event in Google Calendar
    const calendarEvent = await createBooking({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      date: bookingDate,
      time: bookingTime,
        service: formData.serviceType,
      details
    })
    
    // Get service name based on serviceType
    let serviceName = ""
    switch (formData.serviceType) {
      case 'professioneller-gesang':
        serviceName = 'Live Jazz Performance'
        break
      case 'vocal-coaching':
        serviceName = 'Vocal Coaching & Gesangsunterricht'
        break
      case 'gesangsunterricht':
        serviceName = 'Jazz Workshop'
        break
      default:
        serviceName = formData.serviceType
    }
    
    // Send confirmation email to user
    await sendBookingConfirmationEmail({
      name: formData.name,
      email: formData.email,
      date: bookingDate,
      time: bookingTime,
      service: serviceName,
      details: formData.message
    })
    
    // Send notification email to admin
    await sendBookingNotificationEmail({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: bookingDate,
      time: bookingTime,
      service: serviceName,
      details: formData.message
    })
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      eventId: calendarEvent.id
    })
    
  } catch (error: any) {
    console.error('Error creating booking:', error)
    
    return NextResponse.json(
      { error: error.message || 'Error processing booking' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'GET method not supported for this endpoint' },
    { status: 405 }
  )
}

