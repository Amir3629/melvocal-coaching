import { NextResponse } from 'next/server'
import { createBooking, isTimeSlotAvailable } from '@/lib/google-calendar'
import { sendBookingConfirmation, sendAdminNotification } from '@/lib/email-service'

// Adding static export configuration for GitHub Pages compatibility
export const config = {
  api: {
    bodyParser: true,
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      startTime,
      endTime,
      customerName,
      customerEmail,
      serviceType,
      additionalDetails,
    } = body

    // Validate required fields
    if (!startTime || !endTime || !customerName || !customerEmail || !serviceType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // For static export (GitHub Pages), return a mock successful response
    if (process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production') {
      return NextResponse.json({ 
        success: true, 
        booking: {
          id: 'mock-booking-id',
          startTime,
          endTime,
          customerName,
          customerEmail,
          serviceType,
          status: 'confirmed'
        },
        message: 'This is a mock response for static deployment. In production, this would create a real booking.'
      });
    }

    // Check if the time slot is available
    const isAvailable = await isTimeSlotAvailable(startTime, endTime)
    if (!isAvailable) {
      return NextResponse.json(
        { error: 'Selected time slot is no longer available' },
        { status: 409 }
      )
    }

    // Create the booking in Google Calendar
    const booking = await createBooking(
      startTime,
      endTime,
      customerName,
      customerEmail,
      serviceType,
      additionalDetails
    )

    // Send confirmation email to customer
    await sendBookingConfirmation(
      customerEmail,
      customerName,
      serviceType,
      startTime,
      endTime,
      additionalDetails
    )

    // Send notification email to admin
    await sendAdminNotification(
      customerName,
      customerEmail,
      serviceType,
      startTime,
      endTime,
      additionalDetails
    )

    return NextResponse.json({ success: true, booking })
  } catch (error) {
    console.error('Error processing booking:', error)
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    )
  }
} 