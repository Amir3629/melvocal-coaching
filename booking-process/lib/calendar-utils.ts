import { format, isSameDay, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { FAKE_BOOKINGS } from './google-calendar';

// Format date as a localized string (German format)
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd.MM.yyyy', { locale: de });
}

// Format time for display
export function formatTime(time: string): string {
  // If the time is already in 'HH:MM - HH:MM' format, return it
  if (time.includes(' - ')) {
    return time;
  }
  
  // If it's just 'HH:MM', add an hour to create a range
  const [hours, minutes] = time.split(':').map(Number);
  const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  // Create end time (1 hour later)
  const endHour = (hours + 1) % 24;
  const endTime = `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  return `${startTime} - ${endTime}`;
}

// Get service name based on service type
export function getServiceName(serviceType: string): string {
  switch (serviceType) {
    case 'professioneller-gesang':
      return 'Live Jazz Performance';
    case 'vocal-coaching':
      return 'Vocal Coaching & Gesangsunterricht';
    case 'gesangsunterricht':
      return 'Jazz Workshop';
    default:
      return serviceType;
  }
}

// Get a list of fake booked dates
export function getFakeBookedDates(): Date[] {
  return FAKE_BOOKINGS.map(booking => {
    // If the booking date is a string, parse it
    if (typeof booking.date === 'string') {
      return parseISO(booking.date);
    }
    return booking.date;
  });
}

// Check if a date has fake bookings
export function dateHasFakeBookings(date: Date): boolean {
  return FAKE_BOOKINGS.some(booking => {
    const bookingDate = typeof booking.date === 'string' ? parseISO(booking.date) : booking.date;
    return isSameDay(bookingDate, date);
  });
}

// Get fake bookings for a specific date
export function getFakeBookingsForDate(date: Date): Array<{ time: string }> {
  return FAKE_BOOKINGS.filter(booking => {
    const bookingDate = typeof booking.date === 'string' ? parseISO(booking.date) : booking.date;
    return isSameDay(bookingDate, date);
  });
}

// Check if a specific time slot is booked for a date
export function isTimeSlotBooked(date: Date, time: string): boolean {
  return FAKE_BOOKINGS.some(booking => {
    const bookingDate = typeof booking.date === 'string' ? parseISO(booking.date) : booking.date;
    const bookingTime = booking.time.split(' - ')[0]; // Get start time
    const slotTime = time.split(' - ')[0]; // Get start time
    
    return isSameDay(bookingDate, date) && bookingTime === slotTime;
  });
} 