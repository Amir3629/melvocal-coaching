"use client";

import React from 'react';
import { formatDate, formatTime, formatDateTime } from '@/lib/formatters';

interface DateDisplayProps {
  value: string | Date | null | undefined;
  format?: 'date' | 'time' | 'datetime';
  className?: string;
  fallback?: string;
}

/**
 * Component that safely displays date values with proper formatting
 * Prevents React Error #130 by ensuring proper string conversion
 */
const DateDisplay: React.FC<DateDisplayProps> = ({ 
  value, 
  format = 'date',
  className = '', 
  fallback = 'N/A' 
}) => {
  if (!value) {
    return <span className={className}>{fallback}</span>;
  }

  let formattedValue = '';
  
  try {
    switch (format) {
      case 'time':
        formattedValue = formatTime(value);
        break;
      case 'datetime':
        formattedValue = formatDateTime(value);
        break;
      default:
        formattedValue = formatDate(value);
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    formattedValue = typeof value === 'string' ? value : fallback;
  }

  return <span className={className}>{formattedValue || fallback}</span>;
};

export default DateDisplay; 