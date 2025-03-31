import { NextResponse } from 'next/server';
import { getAvailableTimeSlots } from '@/lib/google-calendar';
import { formatDate } from '@/lib/calendar-utils';

// Remove dynamic flag for static export
// export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Get available time slots for the specified date
    const availableSlots = await getAvailableTimeSlots(date);

    // Format the response
    const formattedSlots = availableSlots.map(slot => ({
      date: formatDate(slot.start),
      startTime: slot.start.toISOString(),
      endTime: slot.end.toISOString(),
    }));

    return NextResponse.json({ availableSlots: formattedSlots });
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available time slots' },
      { status: 500 }
    );
  }
} 