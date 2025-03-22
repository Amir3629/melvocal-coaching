"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "font-medium rounded-lg transition-colors",
          // Size variations
          size === "default" && "px-4 py-2 text-sm",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          // Variant styles
          variant === "default" && "bg-[#C8A97E] hover:bg-[#B89A6F] text-black",
          variant === "outline" && "border border-[#C8A97E]/20 hover:bg-[#C8A97E]/10 text-white",
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button" 