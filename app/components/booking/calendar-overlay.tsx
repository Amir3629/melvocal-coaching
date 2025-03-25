import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface CalendarOverlayProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function CalendarOverlay({ isOpen, onClose, title, children }: CalendarOverlayProps) {
  const { t } = useTranslation()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(24px)',
            }}
            onClick={onClose}
          />

          {/* Calendar Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-[95%] max-w-[380px] bg-[#121212] rounded-[24px] overflow-hidden"
            style={{
              boxShadow: `
                0 0 0 2px rgba(200, 169, 126, 0.3),
                0 8px 16px rgba(0, 0, 0, 0.6),
                0 16px 32px rgba(0, 0, 0, 0.4),
                0 32px 64px rgba(0, 0, 0, 0.7)
              `,
              transform: 'translateZ(0)',
            }}
          >
            {/* Header */}
            <div 
              className="px-6 py-5 border-b border-[#C8A97E]/20"
              style={{
                background: 'linear-gradient(180deg, #1A1A1A 0%, #151515 100%)',
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
              }}
            >
              <div className="flex items-center justify-between">
                <h2 
                  className="text-2xl font-bold text-white"
                  style={{
                    direction: 'ltr',
                    textAlign: 'left',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="ml-4 p-2 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/5 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div 
              className="p-5"
              style={{
                background: 'linear-gradient(180deg, #141414 0%, #0A0A0A 100%)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 