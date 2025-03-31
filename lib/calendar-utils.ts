import { format, addDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';

// Function to format date for display
export function formatDate(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

// Function to format time for display
export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

// Function to format date and time for API
export function formatDateTime(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

// Function to get available dates (next 30 days)
export function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const today = startOfDay(new Date());
  const thirtyDaysFromNow = endOfDay(addDays(today, 30));

  let currentDate = today;
  while (currentDate <= thirtyDaysFromNow) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }

  return dates;
}

// Function to check if a date is in the past
export function isDateInPast(date: Date): boolean {
  return date < new Date();
}

// Function to check if a time slot is within business hours (9 AM - 6 PM)
export function isWithinBusinessHours(date: Date): boolean {
  const hours = date.getHours();
  return hours >= 9 && hours < 18;
}

// Function to get the duration of a time slot in minutes
export function getSlotDuration(startTime: Date, endTime: Date): number {
  return (endTime.getTime() - startTime.getTime()) / (1000 * 60);
}

// Function to check if a time slot overlaps with another
export function isTimeSlotOverlapping(
  slot1Start: Date,
  slot1End: Date,
  slot2Start: Date,
  slot2End: Date
): boolean {
  return (
    isWithinInterval(slot1Start, { start: slot2Start, end: slot2End }) ||
    isWithinInterval(slot1End, { start: slot2Start, end: slot2End }) ||
    isWithinInterval(slot2Start, { start: slot1Start, end: slot1End }) ||
    isWithinInterval(slot2End, { start: slot1Start, end: slot1End })
  );
}

// Function to get the next available time slot
export function getNextAvailableTimeSlot(
  date: Date,
  busySlots: { start: Date; end: Date }[]
): Date | null {
  const startTime = new Date(date);
  startTime.setHours(9, 0, 0, 0); // Start at 9 AM
  const endTime = new Date(date);
  endTime.setHours(18, 0, 0, 0); // End at 6 PM

  while (startTime < endTime) {
    const slotEnd = new Date(startTime);
    slotEnd.setHours(slotEnd.getHours() + 1);

    const isAvailable = !busySlots.some(busySlot =>
      isTimeSlotOverlapping(startTime, slotEnd, busySlot.start, busySlot.end)
    );

    if (isAvailable) {
      return startTime;
    }

    startTime.setHours(startTime.getHours() + 1);
  }

  return null;
} 