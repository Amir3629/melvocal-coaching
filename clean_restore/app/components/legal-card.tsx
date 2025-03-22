import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface LegalCardProps {
  title: string
  content: string
  isOpen: boolean
  onClose: () => void
}

export default function LegalCard({ title, content, isOpen, onClose }: LegalCardProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-zinc-900 rounded-xl p-6 shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold mb-4">{title}</h2>
            <div className="prose prose-invert max-w-none">
              {content}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 