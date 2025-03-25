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
        <>
          {/* Triple-layered backdrop for depth */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[998]"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#C8A97E]/10 to-transparent" />
            <div className="absolute inset-0 backdrop-blur-[20px]" />
          </motion.div>
          
          {/* Calendar container with forced center positioning */}
          <div className="fixed inset-0 z-[999] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-[95%] max-w-[380px] bg-[#121212] rounded-[24px] overflow-hidden transform-gpu"
                style={{
                  boxShadow: `
                    0 0 0 1px rgba(200, 169, 126, 0.3),
                    0 4px 6px rgba(0, 0, 0, 0.5),
                    0 12px 24px rgba(0, 0, 0, 0.4),
                    0 24px 48px rgba(0, 0, 0, 0.7),
                    inset 0 1px 0 rgba(200, 169, 126, 0.2)
                  `,
                  isolation: 'isolate'
                }}
              >
                {/* Header with enhanced styling */}
                <div className="px-6 py-5 border-b border-[#C8A97E]/20 bg-gradient-to-b from-[#1A1A1A] to-[#151515]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white" style={{ direction: 'ltr', textAlign: 'left' }}>
                      {title}
                    </h2>
                    <button
                      onClick={onClose}
                      className="ml-4 p-2 rounded-full hover:bg-white/10 active:bg-white/5 transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Calendar content with enhanced inner shadow */}
                <div 
                  className="p-5"
                  style={{
                    background: 'linear-gradient(to bottom, #141414, #0A0A0A)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  {children}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
} 