"use client"

import React, { useState, useEffect } from 'react'
import { Calendar } from './calendar'
import { X, Calendar as CalendarIcon, Clock, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

interface GoogleCalendarPickerProps {
  onChange: (date: Date | undefined) => void
  value?: Date
  placeholder?: string
  className?: string
  showTimeSelector?: boolean
  disablePastDates?: boolean
}

// Interface for time slots
interface TimeSlot {
  label: string;
  value: string;
  available: boolean;
}

// Default time slots
const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { label: '09:00', value: '09:00', available: true },
  { label: '09:50', value: '09:50', available: true },
  { label: '10:40', value: '10:40', available: true },
  { label: '12:00', value: '12:00', available: true },
  { label: '12:50', value: '12:50', available: true },
  { label: '14:30', value: '14:30', available: true },
  { label: '15:20', value: '15:20', available: true },
  { label: '16:10', value: '16:10', available: true },
  { label: '17:00', value: '17:00', available: true },
];

// Helper function to check if a date is in the past
const isPastDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

// Helper function to check if a date is a weekend (day 0 is Sunday and day 6 is Saturday)
const isWeekend = (date: Date) => {
  return date.getDay() === 0 || date.getDay() === 6;
};

// Add custom styling to hide Saturday and Sunday columns
const customCalendarStyles = `
  .rdp-day_saturday,
  .rdp-day_sunday,
  .rdp-day[aria-label*="Samstag"],
  .rdp-day[aria-label*="Sonntag"] {
    display: none !important;
  }
  
  .rdp-head_cell:last-child,
  .rdp-head_cell:nth-child(6),
  .rdp-head_cell:first-child {
    display: none !important;
  }
  
  .rdp-row {
    justify-content: space-around !important;
  }

  .rdp-table {
    width: 100% !important;
  }

  .rdp-caption {
    padding: 0 1rem;
  }

  /* Improve mobile styling */
  @media (max-width: 640px) {
    .rdp-month {
      width: 100% !important;
    }
    .rdp-caption_label {
      font-size: 14px !important;
    }
    .rdp-head_cell {
      font-size: 12px !important;
    }
    .rdp-day {
      width: 36px !important;
      height: 36px !important;
    }
  }
`;

export default function GoogleCalendarPicker({
  onChange,
  value,
  placeholder = "Datum auswählen",
  className = "",
  showTimeSelector = true,
  disablePastDates = true
}: GoogleCalendarPickerProps) {
  const { t } = useTranslation();
  const [date, setDate] = useState<Date | undefined>(value);
  const [isOpen, setIsOpen] = useState(false);
  const [timeSlot, setTimeSlot] = useState<string | undefined>();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  // Update the parent component when a date and time are selected
  useEffect(() => {
    if (date) {
      onChange(date);
    }
  }, [date, onChange]);

  // Disable past dates and weekends
  const disabledDays = (day: Date) => {
    if (disablePastDates && isPastDate(day)) {
      return true;
    }
    return isWeekend(day);
  };

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return placeholder;
    
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const handleDateSelect = (date?: Date) => {
    setDate(date);
    setTimeSlot(undefined);
    setIsConfirmed(false);
    setShowTimeSlots(!!date);
  };

  const handleTimeSelect = (time: string) => {
    setTimeSlot(time);
    
    // Start smooth closing animation sequence
    setTimeout(() => {
      setIsConfirming(true);
      
      setTimeout(() => {
        setIsConfirming(false);
        setIsConfirmed(true);
        
        // Start closing the calendar smoothly
        setTimeout(() => {
          setIsClosing(true);
          setTimeout(() => {
            setIsOpen(false);
            setIsClosing(false);
          }, 300);
        }, 500);
      }, 500);
    }, 200);
  };

  return (
    <div className="relative">
      <style jsx global>{customCalendarStyles}</style>
      
      <div 
        className={`flex items-center justify-between bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 cursor-pointer hover:border-[#C8A97E] transition-colors ${className}`}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 text-[#C8A97E] mr-2" />
          <span className="text-gray-300">{date ? formatDate(date) : placeholder}</span>
          {timeSlot && date && (
            <span className="ml-2 text-[#C8A97E]">({timeSlot})</span>
          )}
        </div>
        {date && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDate(undefined);
              setTimeSlot(undefined);
              setIsConfirmed(false);
              onChange(undefined);
            }}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 top-full left-0 mt-2 w-auto min-w-[280px] max-w-[340px] sm:max-w-none"
          >
            <motion.div 
              className="bg-[#111] border border-gray-800 rounded-lg shadow-xl overflow-hidden"
              animate={{ scale: isClosing ? 0.95 : 1, opacity: isClosing ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center p-3 border-b border-gray-800">
                <h3 className="text-white font-medium text-sm">{t('booking.selectDate', 'Datum auswählen')}</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-2 flex flex-col sm:flex-row max-h-[400px] overflow-auto">
                <div className="w-full sm:min-w-[280px]">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={disabledDays}
                    initialFocus
                    classNames={{
                      head_row: "flex justify-between w-full",
                      head_cell: "text-[#C8A97E] rounded-md w-8 font-medium text-[0.8rem] mx-0.5 text-center",
                      day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-[#C8A97E]/20 rounded-md transition-colors flex items-center justify-center",
                    }}
                  />
                </div>
                
                {showTimeSelector && (
                  <AnimatePresence>
                    {showTimeSlots && date && (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="sm:ml-2 mt-2 sm:mt-0 sm:pl-2 sm:border-l sm:border-gray-800"
                      >
                        <h4 className="text-white text-sm font-medium mb-2 flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-[#C8A97E]" />
                          {t('booking.selectTime', 'Uhrzeit auswählen')}
                        </h4>
                        <div className="grid grid-cols-2 gap-2 max-h-[280px] overflow-y-auto pr-1">
                          {DEFAULT_TIME_SLOTS.map((slot) => (
                            <motion.button
                              key={slot.value}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                              className={`text-center px-3 py-2 rounded-md transition-colors ${
                                timeSlot === slot.value
                                  ? 'bg-[#C8A97E] text-black font-medium'
                                  : slot.available 
                                    ? 'bg-[#1A1A1A] text-white hover:bg-[#222]'
                                    : 'bg-[#1A1A1A]/50 text-gray-500 cursor-not-allowed'
                              }`}
                              onClick={() => slot.available && handleTimeSelect(slot.value)}
                              disabled={!slot.available}
                            >
                              {slot.label}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
              
              <div className="p-3 border-t border-gray-800 flex justify-end">
                  <motion.div 
                  initial={false}
                  animate={{
                    width: isConfirming ? 'auto' : isConfirmed ? 'auto' : 'auto',
                    backgroundColor: isConfirming 
                      ? '#C8A97E' 
                      : isConfirmed 
                        ? '#C8A97E' 
                        : '#1f2937'
                  }}
                  className="rounded-lg overflow-hidden"
                  transition={{ duration: 0.3 }}
                >
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      isConfirming || isConfirmed
                        ? 'text-black'
                        : 'text-white'
                    } flex items-center`}
                    onClick={() => {
                      if (timeSlot && date) {
                        setIsConfirming(true);
                        
                        setTimeout(() => {
                          setIsConfirming(false);
                          setIsConfirmed(true);
                          
                          setTimeout(() => {
                            setIsClosing(true);
                            setTimeout(() => {
                              setIsOpen(false);
                              setIsClosing(false);
                            }, 300);
                          }, 500);
                        }, 500);
                      }
                    }}
                    disabled={!timeSlot}
                  >
                    {isConfirming ? (
                      <Check className="w-4 h-4 mr-1" />
                    ) : null}
                    {isConfirming 
                      ? t('booking.dateConfirmed', 'Datum bestätigt!') 
                      : isConfirmed 
                        ? t('booking.dateConfirmed', 'Datum bestätigt!') 
                        : t('booking.selectTime', 'Zeit auswählen')}
                  </button>
                      </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 