"use client"

import React, { useState, useEffect } from 'react'
import { Calendar } from './ui/calendar'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, addMonths, subMonths, isSameDay, isBefore, startOfToday } from 'date-fns'
import { de } from 'date-fns/locale'
import { FAKE_BOOKINGS } from '@/lib/google-calendar'

// Fake time slots for demonstration
const timeSlots = [
  { time: '09:00 - 10:00', available: true },
  { time: '10:00 - 11:00', available: false },
  { time: '11:00 - 12:00', available: true },
  { time: '13:00 - 14:00', available: true },
  { time: '14:00 - 15:00', available: false },
  { time: '15:00 - 16:00', available: true },
  { time: '16:00 - 17:00', available: true },
  { time: '17:00 - 18:00', available: false },
]

// In the real implementation, these would come from the Google Calendar API
const getAvailableSlotsForDate = (date: Date) => {
  // Check if date is in the fake bookings
  const isFakeBooked = (time: string) => {
    return FAKE_BOOKINGS.some(booking => {
      const bookingDate = new Date(booking.date)
      return (
        isSameDay(bookingDate, date) && 
        booking.time === time.split(' - ')[0]
      )
    })
  }
  
  // Filter slots that are not in fake bookings
  return timeSlots.map(slot => ({
    ...slot,
    available: slot.available && !isFakeBooked(slot.time)
  }))
}

interface CalendarIntegrationProps {
  onSelectDateTime?: (date: Date, time: string) => void
  preSelectedDate?: Date
  preSelectedTime?: string
  serviceType?: string
}

export default function CalendarIntegration({
  onSelectDateTime,
  preSelectedDate,
  preSelectedTime,
  serviceType
}: CalendarIntegrationProps) {
  const [date, setDate] = useState<Date | undefined>(preSelectedDate || undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(preSelectedTime || null)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [availableSlots, setAvailableSlots] = useState<Array<{time: string, available: boolean}>>([])
  
  // Function to check if a date should be disabled
  const isDateDisabled = (date: Date) => {
    const today = startOfToday()
    return isBefore(date, today)
  }
  
  // Load available slots when date changes
  useEffect(() => {
    if (date) {
      // In real implementation, this would fetch from the API
      const slots = getAvailableSlotsForDate(date)
      setAvailableSlots(slots)
      
      // Clear selected time if not available on this date
      if (selectedTime && !slots.some(slot => slot.time === selectedTime && slot.available)) {
        setSelectedTime(null)
      }
    } else {
      setAvailableSlots([])
      setSelectedTime(null)
    }
  }, [date, selectedTime])
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1))
  }
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1))
  }
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)
    setSelectedTime(null)
  }
  
  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (date && onSelectDateTime) {
      onSelectDateTime(date, time)
    }
  }
  
  return (
    <div className="space-y-6">
      <Card className="border-gray-800 bg-[#121212]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Button 
              variant="outline" 
              size="icon"
              onClick={goToPreviousMonth}
              className="bg-[#1A1A1A] border-gray-700 hover:bg-[#222] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">
              {format(currentMonth, 'MMMM yyyy', { locale: de })}
            </span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={goToNextMonth}
              className="bg-[#1A1A1A] border-gray-700 hover:bg-[#222] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardTitle>
          <CardDescription className="text-center text-gray-400">
            {serviceType === 'professioneller-gesang' ? 
              'Wählen Sie ein Datum für Ihre Live Performance' : 
              serviceType === 'vocal-coaching' ? 
                'Wählen Sie ein Datum für Ihren Gesangsunterricht' : 
                'Wählen Sie ein Datum für Ihren Workshop'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            disabled={isDateDisabled}
            locale={de}
            className="border-gray-800 rounded-md"
            classNames={{
              day_selected: "bg-[#C8A97E] text-black hover:bg-[#D4B68C] hover:text-black focus:bg-[#D4B68C] focus:text-black",
              day_today: "bg-[#1A1A1A] text-white",
              day_outside: "text-gray-500 opacity-50",
              day_disabled: "text-gray-500 opacity-30",
              day_range_middle: "aria-selected:bg-[#C8A97E] aria-selected:text-black",
              day_hidden: "invisible",
              caption: "text-white",
              nav_button: "bg-[#1A1A1A] border border-gray-700 hover:bg-[#222] hover:text-white",
              table: "border-collapse space-y-1",
              head_cell: "text-gray-400 font-normal text-xs",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#1A1A1A]",
              day: cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                "hover:bg-[#1A1A1A] hover:text-white focus:bg-[#1A1A1A] focus:text-white"
              ),
              // Mark dates that have booked slots with a dot
              day_range_end: "day-has-bookings",
            }}
            components={{
              // Custom day component to show bookings indicator
              Day: ({ day, ...props }) => {
                // Check if day has any booked slots
                const hasBookings = FAKE_BOOKINGS.some(booking => {
                  const bookingDate = new Date(booking.date)
                  return isSameDay(bookingDate, day)
                })
                
                return (
                  <div
                    {...props}
                    className={cn(
                      props.className,
                      hasBookings && !isDateDisabled(day) && "relative"
                    )}
                  >
                    {props.children}
                    {hasBookings && !isDateDisabled(day) && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#C8A97E] rounded-full" />
                    )}
                  </div>
                )
              }
            }}
          />
        </CardContent>
      </Card>
      
      {date && (
        <Card className="border-gray-800 bg-[#121212]">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-[#C8A97E]" />
              {format(date, 'dd.MM.yyyy', { locale: de })}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {availableSlots.some(slot => slot.available) ? 
                'Wählen Sie eine verfügbare Uhrzeit' : 
                'Keine verfügbaren Termine an diesem Tag'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {availableSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "h-12 flex items-center justify-center gap-1 text-sm",
                    slot.available 
                      ? selectedTime === slot.time 
                        ? "bg-[#C8A97E] text-black border-[#C8A97E] hover:bg-[#D4B68C] hover:text-black hover:border-[#D4B68C]" 
                        : "bg-[#1A1A1A] text-white border-gray-700 hover:bg-[#222] hover:text-white"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed border-gray-700 opacity-50"
                  )}
                  disabled={!slot.available}
                  onClick={() => slot.available && handleTimeSelect(slot.time)}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {slot.time}
                  {selectedTime === slot.time && (
                    <Check className="h-3.5 w-3.5 ml-1" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-gray-500 w-full text-center">
              Freie Termine werden in Echtzeit aktualisiert.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  )
} 