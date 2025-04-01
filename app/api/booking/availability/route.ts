import { NextResponse } from 'next/server';
import { getAvailableTimeSlots } from '@/lib/google-calendar';
import { formatDate } from '@/lib/calendar-utils';

// Adding static export configuration for GitHub Pages compatibility
export const config = {
  api: {
    bodyParser: true,
  },
};

// For static export, we need to provide mock data
const STATIC_AVAILABLE_SLOTS = [
  {
    date: '2025-04-15',
    startTime: '2025-04-15T10:00:00.000Z',
    endTime: '2025-04-15T11:00:00.000Z',
  },
  {
    date: '2025-04-15',
    startTime: '2025-04-15T14:00:00.000Z',
    endTime: '2025-04-15T15:00:00.000Z',
  },
  {
    date: '2025-04-16',
    startTime: '2025-04-16T11:00:00.000Z',
    endTime: '2025-04-16T12:00:00.000Z',
  },
];

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

    // When building for static export, use mock data
    if (process.env.GITHUB_PAGES === 'true' || process.env.NODE_ENV === 'production') {
      // Filter mock data based on the requested date
      const filteredSlots = STATIC_AVAILABLE_SLOTS.filter(slot => 
        slot.date === date
      );
      
      return NextResponse.json({ availableSlots: filteredSlots });
    }

    // Regular dynamic behavior for development
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