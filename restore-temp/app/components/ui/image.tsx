"use client"

import { useState } from "react"
import { getImagePath } from "@/app/utils/image-path"
import Image from "next/image"

interface AppImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  [key: string]: any
}

export function AppImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  ...props
}: AppImageProps) {
  const [error, setError] = useState(false)
  const correctedSrc = getImagePath(src)
  
  // On error, load a placeholder SVG
  const handleError = () => {
    console.warn(`Failed to load image: ${correctedSrc}`)
    setError(true)
  }

  // If error, try to determine what kind of placeholder to show
  const fallbackSrc = () => {
    const path = correctedSrc.toLowerCase();
    if (path.includes('/gallery/')) {
      return '/images/placeholders/gallery.svg';
    }
    if (path.includes('/backgrounds/')) {
      return '/images/placeholders/background.svg';
    }
    if (path.includes('/avatar/') || path.includes('avatar')) {
      return '/images/placeholders/avatar.svg';
    }
    if (path.includes('preview-poster')) {
      return '/images/placeholders/hero.svg';
    }
    if (path.includes('cursor')) {
      // Special case for cursor
      return '/images/placeholders/avatar.svg';
    }
    // Default placeholder
    return '/images/placeholders/hero.svg'
  }
  
  return (
    <Image
      src={error ? fallbackSrc() : correctedSrc}
      alt={alt}
      width={width || 0}
      height={height || 0}
      className={className}
      priority={priority}
      unoptimized
      onError={handleError}
      {...props}
    />
  )
}

interface RegularImgProps {
  src: string
  alt: string
  className?: string
  [key: string]: any
}

export function RegularImg({
  src,
  alt,
  className,
  ...props
}: RegularImgProps) {
  const [error, setError] = useState(false)
  const correctedSrc = getImagePath(src)
  
  // On error, load a placeholder SVG
  const handleError = () => {
    console.warn(`Failed to load image: ${correctedSrc}`)
    setError(true)
  }

  // If error, try to determine what kind of placeholder to show
  const fallbackSrc = () => {
    const path = correctedSrc.toLowerCase();
    if (path.includes('/gallery/')) {
      return '/images/placeholders/gallery.svg';
    }
    if (path.includes('/backgrounds/')) {
      return '/images/placeholders/background.svg';
    }
    if (path.includes('/avatar/') || path.includes('avatar')) {
      return '/images/placeholders/avatar.svg';
    }
    if (path.includes('preview-poster')) {
      return '/images/placeholders/hero.svg';
    }
    if (path.includes('cursor')) {
      // Special case for cursor
      return '/images/placeholders/avatar.svg';
    }
    // Default placeholder
    return '/images/placeholders/hero.svg'
  }
  
  return (
    <img
      src={error ? fallbackSrc() : correctedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={handleError}
      {...props}
    />
  )
} 