import { NextRequest, NextResponse } from 'next/server'
import { getAvailableTimeSlots } from '@/lib/google-calendar'

export async function GET(request: NextRequest) {
  try {
    // Get date from query parameters
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    
    if (!dateParam) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }
    
    // Parse date string to Date object
    const date = new Date(dateParam)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format. Use ISO format (YYYY-MM-DD)' },
        { status: 400 }
      )
    }
    
    // Get available time slots for the date
    const availableSlots = await getAvailableTimeSlots(date)
    
    return NextResponse.json({
      date: dateParam,
      availableSlots,
    })
    
  } catch (error: any) {
    console.error('Error fetching available slots:', error)
    
    return NextResponse.json(
      { error: error.message || 'Error fetching available time slots' },
      { status: 500 }
    )
  }
} 