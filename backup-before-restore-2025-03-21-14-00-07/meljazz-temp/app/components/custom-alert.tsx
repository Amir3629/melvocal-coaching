"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import { Button } from "./ui/button"

interface CustomAlertProps {
  isOpen: boolean
  onClose: () => void
  onAccept: () => void
  message: string
}

export default function CustomAlert({ isOpen, onClose, onAccept, message }: CustomAlertProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-[90%] max-w-md bg-[#1A1A1A] rounded-lg shadow-xl p-6 z-[61]"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-2">Hinweis</h3>
                <p className="text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-[#C8A97E]/20 hover:bg-[#C8A97E]/10"
                  >
                    Abbrechen
                  </Button>
                  <Button
                    onClick={() => {
                      onAccept()
                      onClose()
                    }}
                    className="bg-[#C8A97E] hover:bg-[#B89A6F] text-black"
                  >
                    Akzeptieren
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 