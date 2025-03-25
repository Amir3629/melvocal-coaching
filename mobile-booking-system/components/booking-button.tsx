"use client"

import type React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import MobileBookingForm from "./booking/mobile-booking-form"
import type { ServiceType } from "@/app/types/booking"

interface BookingButtonProps {
  initialService?: ServiceType
  className?: string
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  children?: React.ReactNode
}

export default function BookingButton({
  initialService,
  className = "",
  variant = "primary",
  size = "md",
  children,
}: BookingButtonProps) {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get button styles based on variant and size
  const getButtonStyles = () => {
    let baseStyles = "rounded-lg font-medium transition-all duration-300 flex items-center justify-center"

    // Variant styles
    if (variant === "primary") {
      baseStyles += " bg-[#C8A97E] text-black hover:bg-[#D4AF37] active:bg-[#B89665]"
    } else if (variant === "secondary") {
      baseStyles += " bg-[#1A1A1A] text-white hover:bg-[#222] active:bg-[#282828] border border-gray-700"
    } else if (variant === "outline") {
      baseStyles += " bg-transparent text-[#C8A97E] border border-[#C8A97E] hover:bg-[#C8A97E]/10"
    }

    // Size styles
    if (size === "sm") {
      baseStyles += " px-3 py-1.5 text-sm"
    } else if (size === "md") {
      baseStyles += " px-4 py-2"
    } else if (size === "lg") {
      baseStyles += " px-6 py-3 text-lg"
    }

    return baseStyles
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`${getButtonStyles()} ${className}`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {children || t("booking.bookNow", "Jetzt buchen")}
      </motion.button>

      <MobileBookingForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialService={initialService} />
    </>
  )
}

