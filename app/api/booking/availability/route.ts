import { NextResponse } from 'next/server';
// Only conditionally import these as they use Node.js specific modules
// not available in Edge runtime
let getAvailableTimeSlots: any, formatDate: any;

// Using the new route segment config format for Next.js App Router
export const runtime = 'edge';
export const dynamic = 'force-static';

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

    // In edge runtime or production environment, always use mock data
    // Filter mock data based on the requested date
    const filteredSlots = STATIC_AVAILABLE_SLOTS.filter(slot => 
      slot.date === date
    ).map(slot => ({
      ...slot,
      // Ensure all date fields are properly formatted as strings
      date: typeof slot.date === 'string' ? slot.date : String(slot.date),
      startTime: typeof slot.startTime === 'string' ? slot.startTime : new Date(slot.startTime).toISOString(),
      endTime: typeof slot.endTime === 'string' ? slot.endTime : new Date(slot.endTime).toISOString()
    }));
    
    return NextResponse.json({ availableSlots: filteredSlots });

    // The code below will never execute in Edge runtime or static export
    // but we keep it for documentation/reference
    /*
    // Regular dynamic behavior for development
    const availableSlots = await getAvailableTimeSlots(date);

    // Format the response
    const formattedSlots = availableSlots.map(slot => ({
      date: formatDate(slot.start),
      startTime: slot.start.toISOString(),
      endTime: slot.end.toISOString(),
    }));

    return NextResponse.json({ availableSlots: formattedSlots });
    */
  } catch (error) {
    console.error('Error fetching available time slots:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available time slots' },
      { status: 500 }
    );
  }
} 