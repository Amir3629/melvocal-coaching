/**
 * Utility functions for safely formatting data
 * Prevents common issues like React Error #130 (Objects are not valid as React child)
 */

/**
 * Ensures a value is converted to a string
 * Safe to use in JSX to prevent "Objects are not valid as React child" errors
 */
export function ensureString(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (typeof value === 'object') {
    try {
      // Try to safely stringify the object
      return JSON.stringify(value);
    } catch (e) {
      console.warn('Failed to stringify object:', e);
      return '[Object]';
    }
  }
  
  // Fallback for any other type
  return String(value);
}

/**
 * Safely formats a date string
 * Handles various input formats and prevents errors
 */
export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return '';
  
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ensureString(dateInput);
    }
    
    // Format date: DD.MM.YYYY
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (e) {
    console.warn('Date formatting error:', e);
    return ensureString(dateInput);
  }
}

/**
 * Safely formats a time string
 * Handles various input formats and prevents errors
 */
export function formatTime(timeInput: string | Date | null | undefined): string {
  if (!timeInput) return '';
  
  try {
    const date = typeof timeInput === 'string' ? new Date(timeInput) : timeInput;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ensureString(timeInput);
    }
    
    // Format time: HH:MM
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    console.warn('Time formatting error:', e);
    return ensureString(timeInput);
  }
}

/**
 * Safely formats a date and time string
 * Handles various input formats and prevents errors
 */
export function formatDateTime(dateTimeInput: string | Date | null | undefined): string {
  if (!dateTimeInput) return '';
  
  try {
    const date = typeof dateTimeInput === 'string' ? new Date(dateTimeInput) : dateTimeInput;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ensureString(dateTimeInput);
    }
    
    // Format date and time: DD.MM.YYYY, HH:MM
    return `${formatDate(date)}, ${formatTime(date)}`;
  } catch (e) {
    console.warn('DateTime formatting error:', e);
    return ensureString(dateTimeInput);
  }
}

/**
 * Safely parses a JSON string
 * Returns null if parsing fails
 */
export function safeJsonParse<T>(jsonString: string, fallback: T | null = null): T | null {
  if (!jsonString) return fallback;
  
  try {
    return JSON.parse(jsonString) as T;
  } catch (e) {
    console.warn('JSON parse error:', e);
    return fallback;
  }
} 