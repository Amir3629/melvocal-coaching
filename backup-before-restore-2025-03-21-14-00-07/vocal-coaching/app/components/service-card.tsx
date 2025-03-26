"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
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
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const scrollPositionRef = useRef(0)
  const [isScrolling, setIsScrolling] = useState(false)

  const handleClick = () => {
    if (link) {
      window.open(link, '_blank')
    }
  }

  const handleMouseEnter = () => {
    // Store current scroll position when hovering
    scrollPositionRef.current = window.scrollY
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    // Store the position before changing state
    const scrollTarget = scrollPositionRef.current
    
    // Change state first
    setIsHovered(false)
    setIsScrolling(true)
    
    // Use a longer delay to better match the card animation
    // and prevent any scroll jumps
    setTimeout(() => {
      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      })
      
      // Reset scrolling state after animation completes
      setTimeout(() => {
        setIsScrolling(false)
      }, 3000) // Longer reset time to match the animation duration
    }, 100) // Slightly increased delay for smoother transition
  }

  // Prevent any scroll events while our custom scrolling is active
  useEffect(() => {
    const preventScroll = (e: Event) => {
      if (isScrolling) {
        e.preventDefault();
        return false;
      }
      return true;
    };

    if (isScrolling) {
      window.addEventListener('scroll', preventScroll, { passive: false });
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
    }

    return () => {
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [isScrolling]);

  // Custom transition durations
  const expandDuration = 2500; // 2.5 seconds for expanding
  const contractDuration = 5000; // 5 seconds for contracting (much slower)

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={`group relative w-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden 
        ${isHovered ? 'min-h-[520px]' : 'min-h-[320px]'} 
        ${link ? 'cursor-pointer' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ 
        height: isHovered ? 'auto' : '320px',
        transitionProperty: 'all',
        transitionDuration: isHovered ? `${expandDuration}ms` : `${contractDuration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {image && (
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover opacity-40"
            style={{
              filter: isHovered ? 'none' : 'blur(1px)',
              transitionProperty: 'all',
              transitionDuration: isHovered ? `${expandDuration}ms` : `${contractDuration}ms`,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            priority={delay === 0}
            loading={delay === 0 ? "eager" : "lazy"}
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80" 
               style={{
                 transitionProperty: 'opacity',
                 transitionDuration: isHovered ? `${expandDuration}ms` : `${contractDuration}ms`,
                 transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
               }}
          />
        </div>
      )}

      <div className="relative p-6 flex flex-col h-full">
        <div className="flex items-start gap-3 mb-4">
          {icon && (
            <motion.div
              className="text-[#C8A97E]"
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0
              }}
              transition={{ 
                duration: isHovered ? 1.5 : 3.0,
                scale: { type: 'spring', stiffness: 100 },
                rotate: { duration: isHovered ? 1.8 : 3.5, ease: 'easeInOut' }
              }}
            >
              {icon}
            </motion.div>
          )}
          <div>
            <h3 className="text-xl font-medium text-white">{title}</h3>
            <p className="text-sm text-[#C8A97E]/90 mt-1">{subtitle}</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-6">{description}</p>

        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + index * 0.1 }}
              className="flex items-center gap-2 text-white/90"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
              <span className="text-sm">{feature}</span>
            </motion.li>
          ))}
        </ul>

        {details && (
          <motion.div 
            className="mt-auto space-y-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              height: isHovered ? 'auto' : 0
            }}
            transition={{ 
              duration: isHovered ? expandDuration / 1000 : contractDuration / 1000, // Convert to seconds for framer-motion
              ease: 'easeInOut'
            }}
          >
            {details.includes && (
              <div>
                <h4 className="text-[#C8A97E] text-sm font-medium mb-2">
                  <span className="inline-flex items-center justify-center w-4 h-4 mr-1">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  {" "}Enthält
                </h4>
                <ul className="grid grid-cols-2 gap-2">
                  {details.includes.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="text-white/70 text-sm"
                    >
                      • {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            
            {details.suitable && (
              <div>
                <h4 className="text-[#C8A97E] text-sm font-medium mb-2">
                  <span className="inline-block">
                    👥
                  </span>
                  {" "}Geeignet für
                </h4>
                <ul className="grid grid-cols-2 gap-2">
                  {details.suitable.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="text-white/70 text-sm"
                    >
                      • {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              {details.duration && (
                <div>
                  <p className="text-[#C8A97E] text-xs mb-1">
                    <span className="inline-block">
                      ⏱️
                    </span>
                    {" "}Dauer
                  </p>
                  <p className="text-white/90 text-sm">{details.duration}</p>
                </div>
              )}
              {details.location && (
                <div>
                  <p className="text-[#C8A97E] text-xs mb-1">
                    <span className="inline-block">
                      📍
                    </span>
                    {" "}Ort
                  </p>
                  <p className="text-white/90 text-sm">{details.location}</p>
                </div>
              )}
            </div>

            {link && isHovered && (
              <div className="mt-2 text-center">
                <span className="text-[#C8A97E] text-sm hover:text-[#D4B88F] transition-colors">
                  Für mehr erfahren →
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
} 

