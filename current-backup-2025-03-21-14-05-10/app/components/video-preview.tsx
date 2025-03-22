"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VolumeX, Volume2, Play, Pause } from "lucide-react"
import { useMedia } from "./media-context"

// Add event system for media coordination
const MEDIA_STOP_EVENT = 'stopAllMedia'

export default function VideoPreview() {
  const { currentlyPlaying, setCurrentlyPlaying, stopAllMedia } = useMedia()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const posterImage = process.env.NODE_ENV === 'production'
    ? '/vocal-coaching/images/preview-poster.svg'
    : '/images/preview-poster.svg'

  const videoSrc = process.env.NODE_ENV === 'production'
    ? '/vocal-coaching/videos/preview.mp4'
    : '/videos/preview.mp4'

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
    }
  }, [])

  // Listen for global stop events
  useEffect(() => {
    const handleStopAllMedia = () => {
      if (videoRef.current) {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
    
    window.addEventListener('stopAllMedia', handleStopAllMedia)
    return () => {
      window.removeEventListener('stopAllMedia', handleStopAllMedia)
    }
  }, [])
  
  // Stop playing when another media starts
  useEffect(() => {
    if (currentlyPlaying === 'music' && isPlaying) {
      if (videoRef.current) {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [currentlyPlaying, isPlaying])

  const handleLoadStart = () => {
    setIsLoading(true)
    setHasError(false)
  }

  const handleLoadedData = () => {
    setIsLoading(false)
  }

  const handleError = (e: any) => {
    console.error('Video loading error:', e)
    setIsLoading(false)
    setHasError(true)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current?.pause()
      setIsPlaying(false)
      setCurrentlyPlaying(null)
    } else {
      if (currentlyPlaying === 'music') {
        stopAllMedia()
      }
      videoRef.current?.play()
      setIsPlaying(true)
      setCurrentlyPlaying('video')
    }
  }

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <div className="relative w-full max-w-[240px] mx-auto aspect-[3/4] bg-black rounded-[32px] overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        loop
        muted={isMuted}
        onLoadStart={handleLoadStart}
        onLoadedData={handleLoadedData}
        onError={handleError}
        poster={process.env.NODE_ENV === 'production' ? '/vocal-coaching/images/preview-poster.webp' : '/images/preview-poster.webp'}
        src={process.env.NODE_ENV === 'production' ? '/vocal-coaching/videos/preview.mp4' : '/videos/preview.mp4'}
      />

      {/* Dark overlay with play button */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-700 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={handlePlayPause}
      >
        <button 
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#C8A97E] hover:bg-[#B69A6E] transition-colors"
          aria-label="Play video"
        >
          <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="w-8 h-8 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <p className="text-[#C8A97E]">Video konnte nicht geladen werden</p>
        </div>
      )}

      {/* Mute/Unmute button */}
      <button
        onClick={handleMuteToggle}
        className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
      >
        {isMuted ? (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>
    </div>
  )
}