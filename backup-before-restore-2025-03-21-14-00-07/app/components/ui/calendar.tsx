"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "../../../lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-white",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-[#C8A97E]"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-[#C8A97E] rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#C8A97E]/10",
        day: cn(
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-[#C8A97E]/20 rounded-md transition-colors"
        ),
        day_selected:
          "bg-[#C8A97E] text-black hover:bg-[#C8A97E] hover:text-black focus:bg-[#C8A97E] focus:text-black",
        day_today: "bg-[#C8A97E]/10 text-[#C8A97E] font-semibold",
        day_outside: "text-white/30 opacity-50",
        day_disabled: "text-white/30 opacity-50 hover:bg-transparent cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-[#C8A97E]/10 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar } 