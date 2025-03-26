"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const images = [
  {
    name: "Method 1: Direct path with NODE_ENV check",
    src: process.env.NODE_ENV === 'production' 
      ? "/vocal-coaching/images/services/studio.jpg"
      : "/images/services/studio.jpg"
  },
  {
    name: "Method 2: Using NEXT_PUBLIC_BASE_PATH",
    src: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/services/studio.jpg`
  },
  {
    name: "Method 3: Using require",
    src: "/images/services/studio.jpg"
  },
  {
    name: "Method 4: Absolute URL",
    src: "https://amir3629.github.io/vocal-coaching/images/services/studio.jpg"
  }
]

export default function ImageTest() {
  const [imageStates, setImageStates] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Base Path:', process.env.NEXT_PUBLIC_BASE_PATH)
  }, [])

  const handleImageError = (name: string) => {
    console.error(`Failed to load image for ${name}`)
    setImageStates(prev => ({ ...prev, [name]: true }))
  }

  const handleImageLoad = (name: string) => {
    console.log(`Successfully loaded image for ${name}`)
    setImageStates(prev => ({ ...prev, [name]: false }))
  }

  return (
    <div className="p-8 bg-black">
      <h2 className="text-2xl text-white mb-8">Image Loading Test</h2>
      <div className="grid grid-cols-2 gap-8">
        {images.map((img, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-white">{img.name}</h3>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={img.src}
                alt={`Test ${index + 1}`}
                fill
                className="object-cover"
                onError={() => handleImageError(img.name)}
                onLoad={() => handleImageLoad(img.name)}
              />
              {imageStates[img.name] && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <p className="text-white text-sm">Failed to load</p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-400">Path: {img.src}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 