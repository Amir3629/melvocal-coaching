"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { getImagePath, debugImagePath } from "@/utils/image-path"

interface ParallaxBackgroundProps {
  imageUrl: string
  opacity?: number
  speed?: number
}

export default function ParallaxBackground({
  imageUrl,
  opacity = 0.5,
  speed = 0.5
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [imageError, setImageError] = useState(false)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 50}%`])
  const processedImageUrl = getImagePath(imageUrl)

  // Add debug logging
  useEffect(() => {
    console.log('ParallaxBackground mounted')
    debugImagePath(imageUrl)
  }, [imageUrl])

  const handleImageError = () => {
    console.error('Failed to load image:', processedImageUrl)
    setImageError(true)
  }

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', processedImageUrl)
    setImageError(false)
  }

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      style={{ y }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black opacity-60" />
      <div className="relative w-full h-[120%] -top-[10%]">
        {!imageError ? (
          <Image
            src={processedImageUrl}
            alt="Background"
            fill
            className="object-cover"
            sizes="100vw"
            quality={90}
            priority
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />
        )}
      </div>
    </motion.div>
  )
} 