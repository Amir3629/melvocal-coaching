import { NextResponse } from 'next/server'
import { ensureString } from '@/lib/formatters'
// Only import these conditionally as they use Node.js specific modules
// that are not available in Edge runtime
let createBooking: any, isTimeSlotAvailable: any, sendBookingConfirmation: any, sendAdminNotification: any

// Using the new route segment config format for Next.js App Router
export const runtime = 'edge';
export const dynamic = 'force-static';

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

    // Ensure startTime and endTime are properly formatted as strings
    const startTimeStr = ensureString(typeof startTime === 'string' 
      ? startTime 
      : startTime instanceof Date 
        ? startTime.toISOString() 
        : new Date(startTime).toISOString());
    
    const endTimeStr = ensureString(typeof endTime === 'string' 
      ? endTime 
      : endTime instanceof Date 
        ? endTime.toISOString() 
        : new Date(endTime).toISOString());

    // For static export (GitHub Pages), return a mock successful response
    // Edge runtime or production environment - always return mock data
    return NextResponse.json({ 
      success: true, 
      booking: {
        id: 'mock-booking-id',
        startTime: startTimeStr,
        endTime: endTimeStr,
        customerName: ensureString(customerName),
        customerEmail: ensureString(customerEmail),
        serviceType: ensureString(serviceType),
        status: 'confirmed'
      },
      message: 'This is a mock response for static deployment. In production, this would create a real booking.'
    });

    // The code below will never execute in Edge runtime or static export
    // but we keep it for documentation/reference purposes
    /* 
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
    */
  } catch (error) {
    console.error('Error processing booking:', error)
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    )
  }
} 