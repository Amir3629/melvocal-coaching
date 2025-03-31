"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

interface ServiceCardProps {
  title: string
  subtitle: string
  description: string
  features: string[]
  details?: {
    duration?: string
    location?: string
    includes?: string[]
    suitable?: string[]
  }
  image?: string
  icon?: React.ReactNode
  delay?: number
  link?: string
}

export default function ServiceCard({
  title,
  subtitle,
  description,
  features,
  details,
  image,
  icon,
  delay = 0,
  link
}: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
  }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Animation variants optimized for mobile
  const cardVariants = {
    collapsed: { 
      height: isMobile ? 260 : 320,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    expanded: { 
      height: "auto",
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          duration: 0.4,
          delay: delay * 0.2
        }
      }}
      viewport={{ once: true, margin: "-10%" }}
      className={`
        group relative w-full bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden
        shadow-lg shadow-black/30
        ${isMobile ? 'touch-manipulation' : ''}
      `}
      onClick={isMobile ? toggleExpand : undefined}
      onMouseEnter={!isMobile ? () => setIsExpanded(true) : undefined}
      onMouseLeave={!isMobile ? () => setIsExpanded(false) : undefined}
      variants={cardVariants}
      animate={isExpanded ? "expanded" : "collapsed"}
    >
      {image && (
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 overflow-hidden w-full h-full">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover opacity-40"
              style={{
                objectFit: 'cover', 
                objectPosition: 'center',
                transform: isExpanded ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.3s ease-out'
              }}
              priority={delay === 0}
              loading={delay === 0 ? "eager" : "lazy"}
              quality={90}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" />
        </div>
      )}

      <div className="relative p-3.5 flex flex-col h-full">
        <div className="flex items-start gap-2.5 mb-2">
          {icon && (
            <div className="text-[#C8A97E] flex-shrink-0 mt-0.5">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-sm sm:text-base font-medium text-white mb-0.5">{title}</h3>
            <p className="text-xs text-[#C8A97E]/90">{subtitle}</p>
          </div>
        </div>

        <p className="text-xs text-gray-300/90 mb-2 leading-relaxed">{description}</p>

        <ul className="space-y-0.5">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-1.5 text-white/80"
            >
              <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                <span className="block w-1.5 h-1.5 rounded-full bg-[#C8A97E]"></span>
              </span>
              <span className="text-xs leading-relaxed pt-0.5">{feature}</span>
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {details && isExpanded && (
            <motion.div 
              ref={contentRef}
              className="mt-2.5 space-y-3 pt-2.5 border-t border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {details.includes && (
                <div>
                  <h4 className="text-[#C8A97E] text-xs font-medium mb-1 flex items-center gap-1.5">
                    <Check className="w-3 h-3" />
                    Enthält
                  </h4>
                  <ul className="grid grid-cols-1 gap-0.5">
                    {details.includes.map((item, index) => (
                      <li
                        key={index}
                        className="text-white/80 text-xs flex items-start gap-1.5"
                      >
                        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                          <span className="block w-1.5 h-1.5 rounded-full bg-[#C8A97E]"></span>
                        </span>
                        <span className="leading-relaxed pt-0.5">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {details.suitable && (
                <div>
                  <h4 className="text-[#C8A97E] text-xs font-medium mb-1 flex items-center gap-1.5">
                    <span role="img" aria-label="Geeignet für">👥</span>
                    Geeignet für
                  </h4>
                  <ul className="grid grid-cols-1 gap-0.5">
                    {details.suitable.map((item, index) => (
                      <li
                        key={index}
                        className="text-white/80 text-xs flex items-start gap-1.5"
                      >
                        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                          <span className="block w-1.5 h-1.5 rounded-full bg-[#C8A97E]"></span>
                        </span>
                        <span className="leading-relaxed pt-0.5">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2.5">
                {details.duration && (
                  <div>
                    <p className="text-[#C8A97E] text-xs mb-0.5 flex items-center gap-1.5">
                      <span role="img" aria-label="Dauer">⏱️</span>
                      Dauer
                    </p>
                    <p className="text-white/80 text-xs leading-relaxed">{details.duration}</p>
                  </div>
                )}
                {details.location && (
                  <div>
                    <p className="text-[#C8A97E] text-xs mb-0.5 flex items-center gap-1.5">
                      <span role="img" aria-label="Ort">📍</span>
                      Ort
                    </p>
                    <p className="text-white/80 text-xs leading-relaxed">{details.location}</p>
                  </div>
                )}
              </div>

              {link && (
                <div className="mt-2.5 text-center">
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-3.5 py-1 bg-[#C8A97E] text-black rounded-full
                      text-xs font-medium transition-transform hover:scale-105 active:scale-95"
                  >
                    Mehr erfahren
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {isMobile && (
          <button
            className="absolute bottom-2.5 right-2.5 w-5 h-5 bg-[#C8A97E] rounded-full
              flex items-center justify-center transition-transform
              active:scale-95"
            onClick={(e) => {
              e.stopPropagation()
              toggleExpand()
            }}
            aria-label={isExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
          >
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="text-black text-xs leading-none"
            >
              ↓
            </motion.span>
          </button>
        )}
      </div>
    </motion.div>
  )
} 

