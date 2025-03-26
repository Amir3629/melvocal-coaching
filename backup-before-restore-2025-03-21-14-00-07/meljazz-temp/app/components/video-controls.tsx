"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize2, SkipBack, SkipForward } from "lucide-react"

interface VideoControlsProps {
  isPlaying: boolean
  isMuted: boolean
  currentTime: number
  duration: number
  onPlayPause: () => void
  onMuteToggle: () => void
  onSeek: (time: number) => void
  onFullScreen: () => void
}

export default function VideoControls({
  isPlaying,
  isMuted,
  currentTime,
  duration,
  onPlayPause,
  onMuteToggle,
  onSeek,
  onFullScreen
}: VideoControlsProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showControls, setShowControls] = useState(true)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (!isHovered && isPlaying) {
      timeout = setTimeout(() => setShowControls(false), 2000)
    }
    return () => clearTimeout(timeout)
  }, [isHovered, isPlaying])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{ opacity: showControls ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 py-3">
        {/* Progress bar */}
        <div className="relative group h-1 mb-4">
          <div className="absolute inset-0 bg-white/20 rounded-full">
            <div 
              className="h-full bg-[#C8A97E] rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
          <div className="absolute h-3 w-3 bg-[#C8A97E] rounded-full -top-1 opacity-0 group-hover:opacity-100 transition-opacity"
               style={{ left: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onPlayPause}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={onMuteToggle}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            <div className="text-sm text-white/80">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onFullScreen}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 