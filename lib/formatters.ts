/**
 * Utility functions for formatting and type conversion
 * These help prevent React errors when displaying data
 */

/**
 * Ensures any value is converted to a string
 * Particularly useful for preventing React error #130 (object passed where string expected)
 */
export const ensureString = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

/**
 * Formats a date string to a localized format
 * Returns empty string if invalid date
 */
export const formatDate = (dateString?: string | Date): string => {
  if (!dateString) return '';
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    console.error('Error formatting date:', e);
    return typeof dateString === 'string' ? dateString : '';
  }
};

/**
 * Formats a time string to a localized format
 * Returns empty string if invalid time
 */
export const formatTime = (timeString?: string | Date): string => {
  if (!timeString) return '';
  
  try {
    const date = typeof timeString === 'string' ? new Date(timeString) : timeString;
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch (e) {
    console.error('Error formatting time:', e);
    return typeof timeString === 'string' ? timeString : '';
  }
};

/**
 * Formats a datetime string to a localized format
 * Returns empty string if invalid datetime
 */
export const formatDateTime = (dateTimeString?: string | Date): string => {
  if (!dateTimeString) return '';
  
  try {
    const date = typeof dateTimeString === 'string' ? new Date(dateTimeString) : dateTimeString;
    
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch (e) {
    console.error('Error formatting datetime:', e);
    return typeof dateTimeString === 'string' ? dateTimeString : '';
  }
};

/**
 * Safely parses JSON without throwing exceptions
 * @returns Parsed object or null if invalid JSON
 */
export const safeJsonParse = (jsonString: string): any => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
  }
}; 