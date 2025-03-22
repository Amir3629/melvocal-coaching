import { NextResponse } from 'next/server'
import { getAvailableSlots, createBooking } from '@/app/lib/google-calendar'
import { sendBookingConfirmationEmail } from '@/app/lib/email-service'
import { createPayPalOrder } from '@/app/lib/payment-service'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const dateStr = searchParams.get('date')

  if (!dateStr) {
    return NextResponse.json(
      { error: 'Date parameter is required' },
      { status: 400 }
    )
  }

  const date = new Date(dateStr)
  const slots = await getAvailableSlots(date)

  return NextResponse.json({ slots })
}

export async function POST(request: Request) {
  try {
    const bookingData = await request.json()
    
    // Validate required fields
    if (!bookingData.date || !bookingData.time || !bookingData.name || !bookingData.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert date string to Date object
    bookingData.date = new Date(bookingData.date)

    // Create PayPal order for deposit
    const order = await createPayPalOrder()

    // Create temporary booking in Google Calendar
    const calendarEvent = await createBooking(bookingData)

    // Send confirmation email with payment link
    await sendBookingConfirmationEmail(
      bookingData.email,
      bookingData.name,
      new Date(bookingData.date),
      bookingData.time,
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/${order.id}`
    )

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      eventId: calendarEvent.id,
      orderId: order.id,
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
} 