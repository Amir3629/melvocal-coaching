import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import CalendarOverlay from './calendar-overlay'
import Calendar from './calendar'

interface DateSelectionProps {
  selectedDate: string | null
  selectedTime: string | null
  onDateSelect: (date: string) => void
  onTimeSelect: (time: string) => void
}

export default function DateSelection({ 
  selectedDate, 
  selectedTime, 
  onDateSelect, 
  onTimeSelect 
}: DateSelectionProps) {
  const { t } = useTranslation()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [isTimeSelectOpen, setIsTimeSelectOpen] = useState(false)
  
  // Available time slots (you can make this dynamic based on the selected date)
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00'
  ]
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date)
    } catch (e) {
      return dateString
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Date Selection */}
      <div>
        <label className="block text-white text-sm font-medium mb-2">
          {t('booking.selectDate', 'Datum auswählen')} *
        </label>
        <button
          onClick={() => setIsCalendarOpen(true)}
          className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 text-left flex items-center space-x-3 hover:border-[#C8A97E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
        >
          <CalendarIcon className="w-5 h-5 text-[#C8A97E]" />
          <span className="text-white">
            {selectedDate ? formatDate(selectedDate) : t('booking.selectDate', 'Datum auswählen')}
          </span>
        </button>
      </div>
      
      {/* Time Selection */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <label className="block text-white text-sm font-medium mb-2">
            {t('booking.selectTime', 'Uhrzeit auswählen')} *
          </label>
          <button
            onClick={() => setIsTimeSelectOpen(true)}
            className="w-full bg-[#1A1A1A] border border-gray-700 rounded-lg px-4 py-3 text-left flex items-center space-x-3 hover:border-[#C8A97E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8A97E]"
          >
            <Clock className="w-5 h-5 text-[#C8A97E]" />
            <span className="text-white">
              {selectedTime || t('booking.selectTime', 'Uhrzeit auswählen')}
            </span>
          </button>
        </motion.div>
      )}
      
      {/* Calendar Overlay */}
      <CalendarOverlay
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        title={t('booking.selectDate', 'Datum auswählen')}
      >
        <Calendar
          selectedDate={selectedDate}
          onSelect={(date) => {
            onDateSelect(date)
            setIsCalendarOpen(false)
          }}
        />
      </CalendarOverlay>
      
      {/* Time Selection Overlay */}
      <CalendarOverlay
        isOpen={isTimeSelectOpen}
        onClose={() => setIsTimeSelectOpen(false)}
        title={t('booking.selectTime', 'Uhrzeit auswählen')}
      >
        <div className="grid grid-cols-2 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => {
                onTimeSelect(time)
                setIsTimeSelectOpen(false)
              }}
              className={`p-3 rounded-lg text-center transition-colors ${
                selectedTime === time
                  ? 'bg-[#C8A97E] text-black'
                  : 'bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </CalendarOverlay>
    </div>
  )
} 