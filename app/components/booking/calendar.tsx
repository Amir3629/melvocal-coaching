import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface CalendarProps {
  selectedDate: string | null
  onSelect: (date: string) => void
  minDate?: Date
  maxDate?: Date
}

export default function Calendar({ selectedDate, onSelect, minDate = new Date(), maxDate }: CalendarProps) {
  const { t } = useTranslation()
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Get calendar data
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    
    const days = []
    
    // Add empty days for padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }
  
  // Navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }
  
  // Format date for comparison
  const formatDateForComparison = (date: Date) => {
    return date.toISOString().split('T')[0]
  }
  
  // Check if a date is selectable
  const isDateSelectable = (date: Date) => {
    if (!date) return false
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (minDate && date < minDate) return false
    if (maxDate && date > maxDate) return false
    
    return true
  }
  
  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString('de-DE', { month: 'long', year: 'numeric' })
  }
  
  // Get weekday names
  const weekDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  
  // Animation variants
  const calendarVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  }
  
  return (
    <motion.div
      variants={calendarVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full"
    >
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-[#2A2A2A] rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#C8A97E]" />
        </button>
        <h3 className="text-lg font-medium text-white">
          {getMonthName(currentDate)}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-[#2A2A2A] rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-[#C8A97E]" />
        </button>
      </div>
      
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {getDaysInMonth(currentDate).map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }
          
          const isSelected = selectedDate === formatDateForComparison(date)
          const isSelectable = isDateSelectable(date)
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => isSelectable && onSelect(formatDateForComparison(date))}
              disabled={!isSelectable}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm
                transition-all duration-200
                ${isSelected
                  ? 'bg-[#C8A97E] text-black font-medium'
                  : isSelectable
                    ? 'hover:bg-[#2A2A2A] text-white'
                    : 'text-gray-600 cursor-not-allowed'
                }
              `}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
} 