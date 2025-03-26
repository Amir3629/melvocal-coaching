"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { useEffect } from "react"
import TranslatedText from "./TranslatedText"

interface SuccessMessageProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
}

// Letter animation variants for success message
const letterVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

// Container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.2,
      duration: 0.5,
    },
  },
};

export default function SuccessMessage({ isOpen, onClose, title, message }: SuccessMessageProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  // Animated text component for letter-by-letter animation
  const AnimatedText = ({ text }: { text: string }) => {
    // Don't use Unicode replacement, it's causing issues
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="inline-flex flex-wrap justify-center"
      >
        {text.split(' ').map((word, wordIndex) => (
          <span key={`word-${wordIndex}`} className="whitespace-nowrap mr-1">
            {Array.from(word).map((letter, letterIndex) => (
              <motion.span
                key={`letter-${wordIndex}-${letterIndex}`}
                variants={letterVariants}
                custom={wordIndex * 5 + letterIndex} // Offset by word to maintain timing
                style={{ 
                  display: 'inline-block',
                  textAlign: 'center'
                }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        ))}
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: 0.5, 
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1
            }}
            className="relative w-[90%] max-w-md z-[61]"
          >
            <div className="bg-[#0A0A0A] rounded-xl p-6 border border-[#C8A97E]/20">
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  className="w-16 h-16 rounded-full bg-[#C8A97E]/20 flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.2
                  }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <Check className="w-8 h-8 text-[#C8A97E]" />
                  </motion.div>
                </motion.div>
                <h3 className="text-xl font-medium text-white mb-2">
                  <AnimatedText text={title} />
                </h3>
                <p className="text-gray-400">
                  <AnimatedText text={message} />
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 