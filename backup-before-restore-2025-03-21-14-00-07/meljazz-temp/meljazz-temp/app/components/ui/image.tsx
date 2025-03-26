"use client"

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
  const correctedSrc = getImagePath(src)
  
  return (
    <Image
      src={correctedSrc}
      alt={alt}
      width={width || 0}
      height={height || 0}
      className={className}
      priority={priority}
      unoptimized
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
  const correctedSrc = getImagePath(src)
  
  return (
    <img
      src={correctedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  )
} 