"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookiesAccepted")
    if (!hasAccepted) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookiesDeclined", "true")
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#0A0A0A] border border-[#C8A97E]/20 rounded-xl p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-[#C8A97E]">Cookie-Einstellungen</h3>
                  <p className="text-sm text-gray-300">
                    Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
                    Diese helfen uns zu verstehen, wie Sie unsere Website nutzen und ermöglichen es uns, 
                    unseren Service kontinuierlich zu verbessern.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleAccept}
                      className="px-6 py-2 bg-[#C8A97E] hover:bg-[#B69A6E] text-black rounded-lg transition-colors text-sm font-medium"
                    >
                      Alle akzeptieren
                    </button>
                    <button
                      onClick={handleDecline}
                      className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm"
                    >
                      Nur notwendige
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleDecline}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}