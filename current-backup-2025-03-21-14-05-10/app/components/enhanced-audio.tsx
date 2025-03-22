"use client"

import { useRef, useState, useEffect } from "react"
import { getAssetPath } from "@/app/utils/paths"

interface EnhancedAudioProps {
  src: string;
  formats?: string[];
  onEnded?: () => void;
  onError?: (error: Error) => void;
  onPlay?: () => void;
  onPause?: () => void;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}

/**
 * Enhanced audio component that handles multiple formats and error cases
 * 
 * @param props Component props
 * @returns Enhanced audio component
 */
export default function EnhancedAudio({
  src,
  formats = ["mp3", "ogg"],
  onEnded,
  onError,
  onPlay,
  onPause,
  autoPlay = false,
  loop = false,
  className
}: EnhancedAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isBlocked, setIsBlocked] = useState(false)

  // Handle errors
  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio error:", e)
    
    // Check if the error is due to ad blockers
    const target = e.target as HTMLAudioElement
    if (target.error?.code === 4) { // MEDIA_ERR_SRC_NOT_SUPPORTED
      setIsBlocked(true)
    }
    
    setError(`Failed to load audio: ${target.error?.message || 'Unknown error'}`)
    
    if (onError) {
      onError(new Error(target.error?.message || 'Unknown error'))
    }
  }

  // Expose audio API methods
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Add event listeners
    audio.addEventListener('ended', () => onEnded && onEnded())
    audio.addEventListener('play', () => onPlay && onPlay())
    audio.addEventListener('pause', () => onPause && onPause())

    return () => {
      // Remove event listeners
      audio.removeEventListener('ended', () => onEnded && onEnded())
      audio.removeEventListener('play', () => onPlay && onPlay())
      audio.removeEventListener('pause', () => onPause && onPause())
    }
  }, [onEnded, onPlay, onPause])

  // Public methods
  const play = () => {
    const audio = audioRef.current
    if (audio) {
      audio.play().catch(err => {
        console.error("Failed to play audio:", err)
        if (onError) onError(err)
      })
    }
  }

  const pause = () => {
    const audio = audioRef.current
    if (audio) audio.pause()
  }

  return (
    <div className={className}>
      <audio 
        ref={audioRef}
        autoPlay={autoPlay}
        loop={loop}
        onError={handleError}
      >
        {formats.map(format => (
          <source 
            key={format}
            src={`${getAssetPath(src)}.${format}`}
            type={`audio/${format}`}
          />
        ))}
        Your browser does not support the audio element.
      </audio>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      {isBlocked && (
        <div className="text-amber-500 text-sm mt-2">
          Audio might be blocked by your browser or extensions. Please check your ad-blocker settings.
        </div>
      )}
    </div>
  )
}

// Export public methods
export function useAudio() {
  const audioRef = useRef<HTMLAudioElement>(null)
  
  return {
    play: () => audioRef.current?.play(),
    pause: () => audioRef.current?.pause(),
    stop: () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    },
    setVolume: (volume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = Math.max(0, Math.min(1, volume))
      }
    },
    getRef: () => audioRef
  }
} 