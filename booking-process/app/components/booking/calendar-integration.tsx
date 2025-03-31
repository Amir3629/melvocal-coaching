"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Calendar, Clock, X } from "lucide-react"
import { motion } from "framer-motion"

interface CalendarIntegrationProps {
  onDateSelect: (date: string, time: string) => void
  selectedDate?: string
  selectedTime?: string
}

// Fake bookings to make the calendar look busy
const FAKE_BOOKINGS = [
  { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), time: "14:00" },
  { date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), time: "10:00" },
  { date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), time: "16:30" },
  { date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), time: "11:00" },
  { date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), time: "15:00" },
]

// Generate time slots
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 9; hour <= 18; hour++) {
    if (hour !== 13) {
      // Skip lunch hour
      slots.push(`${hour}:00`)
      if (hour !== 18) slots.push(`${hour}:30`)
    }
  }
  return slots
}

const TIME_SLOTS = generateTimeSlots()

export default function CalendarIntegration({ onDateSelect, selectedDate, selectedTime }: CalendarIntegrationProps) {
  const { t } = useTranslation()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availableDates, setAvailableDates] = useState<Date[]>([])
  const [showTimeSelector, setShowTimeSelector] = useState(false)
  const [tempSelectedDate, setTempSelectedDate] = useState<string | null>(null)
  const [calendarHeight, setCalendarHeight] = useState(500)

  // Adjust calendar height based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCalendarHeight(400)
      } else {
        setCalendarHeight(500)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Generate available dates (excluding weekends and fake bookings)
  useEffect(() => {
    const dates: Date[] = []
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Get booked dates
    const bookedDates = FAKE_BOOKINGS.map((booking) => {
      const date = new Date(booking.date)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    })

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const dayOfWeek = date.getDay()

      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // Skip dates in the past
        if (date >= today) {
          // Check if this date is fully booked
          const dateTime = date.getTime()
          const isFullyBooked = bookedDates.includes(dateTime)

          // Only add dates that aren't fully booked
          if (!isFullyBooked) {
            dates.push(date)
          }
        }
      }
    }

    setAvailableDates(dates)
  }, [currentMonth])

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("de-DE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Handle date click
  const handleDateClick = (date: Date) => {
    const formattedDate = formatDate(date)
    setTempSelectedDate(formattedDate)
    setShowTimeSelector(true)
  }

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    if (tempSelectedDate) {
      onDateSelect(tempSelectedDate, time)
      setShowTimeSelector(false)
    }
  }

  // Check if a time slot is available
  const isTimeSlotAvailable = (time: string) => {
    if (!tempSelectedDate) return true

    // Check if this time slot is booked by a fake booking
    const selectedDateTime = new Date(tempSelectedDate)
    selectedDateTime.setHours(0, 0, 0, 0)

    const booking = FAKE_BOOKINGS.find((booking) => {
      const bookingDate = new Date(booking.date)
      bookingDate.setHours(0, 0, 0, 0)
      return bookingDate.getTime() === selectedDateTime.getTime() && booking.time === time
    })

    return !booking
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Check if a date is selected
  const isSelectedDate = (date: Date) => {
    if (!selectedDate && !tempSelectedDate) return false

    const dateToCheck = tempSelectedDate || selectedDate
    const formattedDate = formatDate(date)
    return formattedDate === dateToCheck
  }

  // Check if a date is available
  const isDateAvailable = (date: Date) => {
    return availableDates.some(
      (availableDate) =>
        availableDate.getDate() === date.getDate() &&
        availableDate.getMonth() === date.getMonth() &&
        availableDate.getFullYear() === date.getFullYear(),
    )
  }

  // Check if a date is booked
  const isDateBooked = (date: Date) => {
    date.setHours(0, 0, 0, 0)
    return FAKE_BOOKINGS.some((booking) => {
      const bookingDate = new Date(booking.date)
      bookingDate.setHours(0, 0, 0, 0)
      return bookingDate.getTime() === date.getTime()
    })
  }

  // Render calendar days
  const renderCalendarDays = () => {
    const days = []
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const daysInPrevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate()

    // Add days from previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, daysInPrevMonth - i)
      days.push(
        <div key={`prev-${i}`} className="p-2 text-center text-gray-500 opacity-50">
          {daysInPrevMonth - i}
        </div>,
      )
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
      const available = isDateAvailable(date)
      const booked = isDateBooked(date)
      const selected = isSelectedDate(date)
      const today = isToday(date)

      days.push(
        <div
          key={`current-${i}`}
          className={`p-2 text-center rounded-md transition-all duration-200 ${
            available ? "cursor-pointer hover:bg-[#1A1A1A]" : "text-gray-500 opacity-50"
          } ${
            selected ? "bg-[#C8A97E] text-black font-medium" : today ? "border border-[#C8A97E] text-[#C8A97E]" : ""
          } ${booked && !selected ? "bg-[#2A2A2A] text-gray-300 relative overflow-hidden" : ""}`}
          onClick={() => available && handleDateClick(date)}
        >
          {i}
          {booked && !selected && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C8A97E]"></div>}
        </div>,
      )
    }

    // Add days from next month to fill the grid
    const totalDaysRendered = days.length
    const remainingCells = 42 - totalDaysRendered // 6 rows x 7 days

    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="p-2 text-center text-gray-500 opacity-50">
          {i}
        </div>,
      )
    }

    return days
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white mb-2">{t("booking.selectDateTime", "Termin auswählen")}</h3>
        <p className="text-gray-400 text-sm">
          {t("booking.availabilityNote", "Wählen Sie einen verfügbaren Termin aus dem Kalender.")}
        </p>
      </div>

      {/* Selected date/time display */}
      {selectedDate && selectedTime && (
        <div className="mb-4 p-3 bg-[#1A1A1A] rounded-lg border border-[#C8A97E]/30">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-[#C8A97E] mr-2" />
            <span className="text-white">{formatDateForDisplay(selectedDate)}</span>
          </div>
          <div className="flex items-center mt-2">
            <Clock className="w-5 h-5 text-[#C8A97E] mr-2" />
            <span className="text-white">{selectedTime} Uhr</span>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-[#121212] border border-gray-800 rounded-lg overflow-hidden">
        {/* Calendar header */}
        <div className="flex justify-between items-center p-3 border-b border-gray-800">
          <button onClick={goToPreviousMonth} className="p-1 rounded-full hover:bg-[#1A1A1A] transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h4 className="text-white font-medium">
            {currentMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" })}
          </h4>
          <button onClick={goToNextMonth} className="p-1 rounded-full hover:bg-[#1A1A1A] transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-gray-800">
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
            <div key={day} className="p-2 text-center text-gray-400 text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">{renderCalendarDays()}</div>

        {/* Legend */}
        <div className="p-3 border-t border-gray-800 flex flex-wrap gap-3 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#C8A97E] rounded-full mr-1"></div>
            <span className="text-gray-400">{t("booking.selected", "Ausgewählt")}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 border border-[#C8A97E] rounded-full mr-1"></div>
            <span className="text-gray-400">{t("booking.today", "Heute")}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-[#2A2A2A] relative overflow-hidden mr-1">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#C8A97E]"></div>
            </div>
            <span className="text-gray-400">{t("booking.partiallyBooked", "Teilweise gebucht")}</span>
          </div>
        </div>
      </div>

      {/* Time selector modal */}
      {showTimeSelector && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setShowTimeSelector(false)}
        >
          <motion.div
            className="bg-[#121212] border border-gray-800 rounded-lg w-full max-w-xs p-4"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-medium">{tempSelectedDate && formatDateForDisplay(tempSelectedDate)}</h4>
              <button
                onClick={() => setShowTimeSelector(false)}
                className="p-1 rounded-full hover:bg-[#1A1A1A] transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {TIME_SLOTS.map((time) => {
                const available = isTimeSlotAvailable(time)
                return (
                  <button
                    key={time}
                    className={`p-2 rounded-md text-center ${
                      available
                        ? "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] transition-colors"
                        : "bg-gray-800 text-gray-500 cursor-not-allowed"
                    } ${selectedTime === time ? "bg-[#C8A97E] text-black hover:bg-[#C8A97E]" : ""}`}
                    onClick={() => available && handleTimeSelect(time)}
                    disabled={!available}
                  >
                    {time} Uhr
                  </button>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

