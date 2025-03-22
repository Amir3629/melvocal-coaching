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
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  // Animation variants for the card
  const cardVariants = {
    collapsed: { 
      height: 320
    },
    expanded: { 
      height: "auto",
      transition: { 
        duration: 5.0,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  // Line by line text animation
  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="group relative w-full bg-black/20 backdrop-blur-sm rounded-xl overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      variants={cardVariants}
      animate={isHovered ? "expanded" : "collapsed"}
    >
      {image && (
        <div className="absolute inset-0 w-full h-full will-change-transform">
          <div className="absolute inset-0 overflow-hidden w-full h-full">
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover opacity-40"
              style={{
                filter: isHovered ? 'none' : 'blur(1px)',
                transition: "filter 5s ease-out",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden"
              }}
              priority={delay === 0}
              loading={delay === 0 ? "eager" : "lazy"}
              quality={90}
            />
          </div>
          <div 
            className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"
          />
        </div>
      )}

      <div className="relative p-6 flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          {icon && (
            <div className="text-[#C8A97E]">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-xl font-medium text-white">{title}</h3>
            <p className="text-sm text-[#C8A97E]/90 mt-1">{subtitle}</p>
          </div>
        </div>

        <p className="text-sm text-gray-300 mb-6">{description}</p>

        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-white/90"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8A97E]" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <AnimatePresence>
          {details && isHovered && (
            <motion.div 
              ref={contentRef}
              className="mt-auto space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0 }}
            >
              {details.includes && (
                <div>
                  <motion.h4 
                    className="text-[#C8A97E] text-sm font-medium mb-2"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    custom={0}
                  >
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-1">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    {" "}Enthält
                  </motion.h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {details.includes.map((item, index) => (
                      <motion.li
                        key={index}
                        className="text-white/90 text-sm"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index + 1}
                      >
                        • {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
              
              {details.suitable && (
                <div>
                  <motion.h4 
                    className="text-[#C8A97E] text-sm font-medium mb-2"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    custom={details.includes ? details.includes.length + 1 : 0}
                  >
                    <span className="inline-block">
                      👥
                    </span>
                    {" "}Geeignet für
                  </motion.h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {details.suitable.map((item, index) => (
                      <motion.li
                        key={index}
                        className="text-white/90 text-sm"
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index + (details.includes ? details.includes.length + 2 : 1)}
                      >
                        • {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              <motion.div 
                className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10"
                variants={textVariants}
                initial="hidden"
                animate="visible"
                custom={
                  (details.includes ? details.includes.length : 0) + 
                  (details.suitable ? details.suitable.length : 0) + 2
                }
              >
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
              </motion.div>

              {link && (
                <motion.div 
                  className="mt-2 text-center"
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  custom={
                    (details.includes ? details.includes.length : 0) + 
                    (details.suitable ? details.suitable.length : 0) + 3
                  }
                >
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-[#C8A97E] text-sm hover:text-[#D4B88F] transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Für mehr erfahren →
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
} 

