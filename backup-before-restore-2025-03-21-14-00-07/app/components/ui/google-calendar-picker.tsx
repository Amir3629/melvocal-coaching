"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { cn } from "@/lib/utils"
import { de } from "date-fns/locale"

interface GoogleCalendarPickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export default function GoogleCalendarPicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false
}: GoogleCalendarPickerProps) {
  return (
    <div className={cn("w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-gray-400",
              "bg-[#1A1A1A] border-gray-800 hover:bg-[#232323] text-white hover:text-white focus-visible:ring-[#C8A97E]"
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-[#C8A97E]" />
            {value ? (
              format(value, "PPP", { locale: de })
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-[#1A1A1A] border-gray-800">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            locale={de}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 