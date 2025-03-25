"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CalendarIcon, Clock, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  isWeekend,
  isPast,
} from "date-fns"
import { de } from "date-fns/locale"

interface GoogleCalendarPickerProps {
  onChange: (date: Date | undefined, timeSlot?: string) => void
  value?: Date
  selectedTime?: string
  placeholder?: string
  className?: string
  calendarAvailability?: { [date: string]: string[] }
  disablePastDates?: boolean
  disableWeekends?: boolean
}

export default function GoogleCalendarPicker({
  onChange,
  value,
  selectedTime,
  placeholder = "Datum auswählen",
  className = "",
  calendarAvailability = {},
  disablePastDates = true,
  disableWeekends = true,
}: GoogleCalendarPickerProps) {
  const { t } = useTranslation()
  const [date, setDate] = useState<Date | undefined>(value)
  const [isOpen, setIsOpen] = useState(false)
  const [timeSlot, setTimeSlot] = useState<string | undefined>(selectedTime)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [isCalendarView, setIsCalendarView] = useState(true)

  // Default time slots if no availability data is provided
  const DEFAULT_TIME_SLOTS = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ]

  // Update available time slots when date changes
  useEffect(() => {
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd")
      const slots = calendarAvailability[dateStr] || DEFAULT_TIME_SLOTS
      setAvailableTimeSlots(slots)
    } else {
      setAvailableTimeSlots([])
    }
  }, [date, calendarAvailability])

  // Format date for display
  const formatDisplayDate = (date?: Date) => {
    if (!date) return placeholder

    return format(date, "dd.MM.yyyy", { locale: de })
  }

  // Handle date selection
  const handleDateSelect = (day: Date) => {
    setDate(day)
    setIsCalendarView(false)
  }

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setTimeSlot(time)

    if (date) {
      onChange(date, time)
      setTimeout(() => {
        setIsOpen(false)
      }, 300)
    }
  }

  // Check if a date is disabled
  const isDateDisabled = (day: Date) => {
    if (disablePastDates && isPast(day) && !isToday(day)) {
      return true
    }

    if (disableWeekends && isWeekend(day)) {
      return true
    }

    return false
  }

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  // Get days in current month
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center justify-between bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 cursor-pointer hover:border-[#C8A97E] transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center">
          <CalendarIcon className="w-5 h-5 text-[#C8A97E] mr-2" />
          <span className="text-gray-300">
            {date ? formatDisplayDate(date) : placeholder}
            {timeSlot && date && <span className="ml-2 text-[#C8A97E]">({timeSlot})</span>}
          </span>
        </div>
        {date && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setDate(undefined)
              setTimeSlot(undefined)
              onChange(undefined)
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
            className="absolute z-50 top-full left-0 mt-2 w-full bg-[#121212] border border-gray-800 rounded-lg shadow-xl overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-gray-800">
              <button
                onClick={() => {
                  if (!isCalendarView) {
                    setIsCalendarView(true)
                  } else {
                    setIsOpen(false)
                  }
                }}
                className="text-gray-400 hover:text-white"
              >
                {!isCalendarView ? <ChevronLeft className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </button>
              <h3 className="text-white font-medium text-sm">
                {isCalendarView
                  ? t("booking.selectDate", "Datum auswählen")
                  : t("booking.selectTime", "Uhrzeit auswählen")}
              </h3>
              <div className="w-5"></div> {/* Spacer for alignment */}
            </div>

            {/* Calendar View */}
            <AnimatePresence mode="wait">
              {isCalendarView ? (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3"
                >
                  {/* Month navigation */}
                  <div className="flex justify-between items-center mb-4">
                    <button
                      onClick={prevMonth}
                      className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h4 className="text-white font-medium">{format(currentMonth, "MMMM yyyy", { locale: de })}</h4>
                    <button
                      onClick={nextMonth}
                      className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Weekday headers */}
                  <div className="grid grid-cols-7 mb-2">
                    {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-[#C8A97E]">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Empty cells for days before the start of the month */}
                    {Array.from({
                      length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(),
                    }).map((_, index) => (
                      <div key={`empty-${index}`} className="h-9 w-full" />
                    ))}

                    {/* Days of the month */}
                    {getDaysInMonth().map((day) => {
                      const isSelected = date ? isSameDay(day, date) : false
                      const isDisabled = isDateDisabled(day)
                      const isCurrentMonth = isSameMonth(day, currentMonth)
                      const hasAvailability = calendarAvailability[format(day, "yyyy-MM-dd")]?.length > 0

                      return (
                        <button
                          key={day.toString()}
                          onClick={() => !isDisabled && handleDateSelect(day)}
                          disabled={isDisabled}
                          className={`h-9 w-full rounded-md flex items-center justify-center text-sm ${
                            isSelected
                              ? "bg-[#C8A97E] text-black font-medium"
                              : isDisabled
                                ? "text-gray-600 cursor-not-allowed"
                                : isToday(day)
                                  ? "bg-[#C8A97E]/10 text-[#C8A97E] hover:bg-[#C8A97E]/20"
                                  : "text-white hover:bg-gray-800"
                          } ${!isCurrentMonth && "opacity-30"}`}
                        >
                          {format(day, "d")}
                          {hasAvailability && !isSelected && !isDisabled && (
                            <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#C8A97E]"></span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="timeSlots"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-3"
                >
                  <div className="mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-[#C8A97E]" />
                    <h4 className="text-white text-sm">{date && format(date, "EEEE, d. MMMM yyyy", { locale: de })}</h4>
                  </div>

                  {availableTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 max-h-[240px] overflow-y-auto">
                      {availableTimeSlots.map((slot) => (
                        <motion.button
                          key={slot}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ duration: 0.2 }}
                          className={`text-center px-2 py-3 rounded-md transition-colors ${
                            timeSlot === slot
                              ? "bg-[#C8A97E] text-black font-medium"
                              : "bg-[#1A1A1A] text-white hover:bg-[#222]"
                          }`}
                          onClick={() => handleTimeSelect(slot)}
                        >
                          {slot}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      {t("booking.noAvailableSlots", "Keine verfügbaren Termine an diesem Tag")}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

