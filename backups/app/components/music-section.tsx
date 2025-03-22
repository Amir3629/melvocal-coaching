"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause } from 'lucide-react'
import Image from 'next/image'

// Add TypeScript declarations for YouTube API
declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MusicTrack {
  id: number
  title: string
  artist: string
  youtubeId: string
}

export default function MusicSection() {
  const { t } = useTranslation()
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeDiscIndex, setActiveDiscIndex] = useState(0)
  const [isRotating, setIsRotating] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const playerRef = useRef<any>(null)
  
  const musicTracks: MusicTrack[] = [
    {
      id: 1,
      title: "Piano Composition",
      artist: "Melvo Jazz",
      youtubeId: "hFdMHvB6-Jk"
    },
    {
      id: 2,
      title: "Soul Classics", 
      artist: "Melvo Jazz",
      youtubeId: "ZvWZr6TNh9Y"
    },
    {
      id: 3,
      title: "Pop Covers",
      artist: "Melvo Jazz",
      youtubeId: "r58-5DBfMpY"
    },
    {
      id: 4,
      title: "Jazz Standards",
      artist: "Melvo Jazz",
      youtubeId: "0zARqh3xwnw"
    },
    {
      id: 5,
      title: "Vocal Improvisation",
      artist: "Melvo Jazz",
      youtubeId: "AWsarzdZ1u8"
    },
    {
      id: 6,
      title: "Acoustic Session",
      artist: "Melvo Jazz",
      youtubeId: "GidIMbCmtyk"
    },
    {
      id: 7,
      title: "Live Performance",
      artist: "Melvo Jazz",
      youtubeId: "QgZKO_f5FlM"
    }
  ]

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId: string) => {
    // Try to use high quality thumbnail first (hqdefault)
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  // Initialize YouTube API
  useEffect(() => {
    // Define the YouTube player API callback
    if (typeof window !== 'undefined') {
      window.onYouTubeIframeAPIReady = () => {
        if (currentTrack) {
          initializePlayer(currentTrack.youtubeId);
        }
      };
    }
    
    const loadYouTubeAPI = () => {
      if (typeof window !== 'undefined' && !window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      } else if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
        initializePlayer(currentTrack?.youtubeId || musicTracks[0].youtubeId);
      }
    };
    
    loadYouTubeAPI();
    
    if (musicTracks.length > 0 && !currentTrack) {
      setCurrentTrack(musicTracks[0]);
    }
  }, [currentTrack, musicTracks]);

  const initializePlayer = (videoId: string) => {
    if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
          },
          onStateChange: (event: { data: number }) => {
            // Update isPlaying based on player state
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setIsRotating(true);
            } else if (event.data === window.YT.PlayerState.PAUSED || 
                      event.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              setIsRotating(false);
            }
          }
        }
      });
    }
  };

  const handleDiscChange = (index: number) => {
    if (index === activeDiscIndex) return;
    
    // Stop rotation of current disc
    setIsRotating(false);
    setIsPlaying(false);
    
    if (playerRef.current) {
      playerRef.current.pauseVideo();
    }
    
    // Change active disc with a small delay
    setTimeout(() => {
      setActiveDiscIndex(index);
      const track = musicTracks[index];
      if (track) {
        setCurrentTrack(track);
        if (playerRef.current) {
          playerRef.current.loadVideoById(track.youtubeId);
          playerRef.current.pauseVideo();
        } else {
          initializePlayer(track.youtubeId);
        }
      }
    }, 300);
  }

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        setIsRotating(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
        setIsRotating(true);
      }
    }
  }

  // Calculate disc styles based on position
  const calculateDiscStyle = (index: number) => {
    const diff = index - activeDiscIndex
    const absoluteDiff = Math.abs(diff)
    
    // Base transformations
    const scale = Math.max(1 - (absoluteDiff * 0.25), 0.5) // Each disc gets 25% smaller, min 0.5
    const opacity = Math.max(1 - (absoluteDiff * 0.8), 0.05) // Fade out more aggressively
    const blur = Math.min(absoluteDiff * 4, 8) // Increase blur for background discs
    const zIndex = 10 - absoluteDiff
    
    return {
      scale,
      translateX: diff * 60, // Further reduced horizontal spacing
      translateZ: -absoluteDiff * 350, // Increased depth
      filter: `blur(${blur}px)`,
      opacity,
      zIndex,
      rotate: isRotating && index === activeDiscIndex ? 360 : 0
    }
  }

  return (
    <section id="music" className="bg-black relative overflow-hidden min-h-screen flex items-center">
      <div className="container mx-auto px-4">
        <div className="section-title">
          <h2>{t('music.title')}</h2>
        </div>

        <div className="relative h-[500px] perspective-1000 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {musicTracks.map((track, index) => {
              const style = calculateDiscStyle(index)
              
              return (
                <motion.div
                  key={track.id}
                  className="absolute w-[300px] h-[300px] cursor-pointer transform-gpu preserve-3d"
                  style={{
                    filter: style.filter,
                    opacity: style.opacity,
                    zIndex: style.zIndex,
                  }}
                  animate={{
                    x: style.translateX,
                    z: style.translateZ,
                    scale: style.scale,
                    rotate: style.rotate,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    rotate: {
                      duration: 20, // Slower rotation (20s for a full rotation)
                      ease: "linear",
                      repeat: Infinity,
                      repeatType: "loop"
                    }
                  }}
                  onClick={() => handleDiscChange(index)}
                >
                  {/* Disc styled with YouTube thumbnail */}
                  <div className="relative w-full h-full rounded-full overflow-hidden vinyl-disc" 
                    style={{
                      boxShadow: "0 8px 30px rgba(0,0,0,0.9)"
                    }}
                  >
                    {/* YouTube thumbnail as background */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black via-transparent to-transparent opacity-40 z-[1]"></div>
                      <Image
                        src={getYouTubeThumbnail(track.youtubeId)}
                        alt={track.title}
                        fill
                        sizes="(max-width: 768px) 300px, 300px"
                        className="object-cover scale-[1.2] transform-gpu" /* Zoom in 20% */
                        style={{
                          filter: "contrast(1.1) brightness(0.9)"
                        }}
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.parentElement!.style.backgroundColor = '#C8A97E';
                        }}
                      />
                      
                      {/* Vinyl edge effect - darker ring around the edge */}
                      <div className="absolute inset-0 rounded-full" 
                        style={{ 
                          background: "radial-gradient(circle at center, transparent 80%, rgba(0,0,0,0.7) 95%, rgba(0,0,0,0.8) 100%)"
                        }}
                      ></div>
                      
                      {/* Vinyl grooves overlay with fine concentric circles */}
                      <div className="absolute inset-0 rounded-full z-[2]" 
                        style={{ 
                          background: "radial-gradient(circle at center, rgba(0,0,0,0.1) 30%, transparent 31%, transparent 33%, rgba(0,0,0,0.05) 34%, transparent 35%, transparent 37%, rgba(0,0,0,0.05) 38%, transparent 39%, transparent 41%, rgba(0,0,0,0.05) 42%, transparent 43%, transparent 45%, rgba(0,0,0,0.05) 46%, transparent 47%, transparent 49%, rgba(0,0,0,0.05) 50%, transparent 51%, transparent 53%, rgba(0,0,0,0.05) 54%, transparent 55%, transparent 57%, rgba(0,0,0,0.05) 58%, transparent 59%, transparent 61%, rgba(0,0,0,0.05) 62%, transparent 63%, transparent 65%, rgba(0,0,0,0.05) 66%, transparent 67%, transparent 69%, rgba(0,0,0,0.05) 70%, transparent 71%, transparent 73%, rgba(0,0,0,0.05) 74%, transparent 75%, transparent 77%, rgba(0,0,0,0.05) 78%, transparent 79%, transparent 81%, rgba(0,0,0,0.05) 82%, transparent 83%, transparent 85%, rgba(0,0,0,0.05) 86%, transparent 87%, transparent 89%, rgba(0,0,0,0.05) 90%, transparent 91%, transparent 93%, rgba(0,0,0,0.05) 94%, transparent 95%, transparent 97%, rgba(0,0,0,0.05) 98%)",
                          opacity: 0.8,
                          mixBlendMode: "overlay"
                        }}
                      ></div>
                      
                      {/* Light reflection at the top */}
                      <div className="absolute inset-0 rounded-full z-[3]" 
                        style={{ 
                          background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 20%, transparent 40%)",
                          opacity: 0.6,
                          mixBlendMode: "overlay"
                        }}
                      ></div>
                    </div>
                    
                    {/* Text on the vinyl */}
                    {index === activeDiscIndex && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center z-[4]" 
                             style={{ transform: "rotate(90deg)" }}>
                          <span className="text-white/90 text-sm font-light drop-shadow-lg" 
                                style={{ marginTop: "-100px" }}>
                            {track.title}
                          </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center z-[4]" 
                             style={{ transform: "rotate(-90deg)" }}>
                          <span className="text-white/90 text-xs font-light drop-shadow-lg" 
                                style={{ marginTop: "-100px" }}>
                            {track.artist}
                          </span>
                        </div>
                      </>
                    )}
                    
                    {/* Center hole with concentric rings for more realistic vinyl look */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
                      <div className="w-[33%] h-[33%] rounded-full bg-black flex items-center justify-center">
                        <div className="w-[85%] h-[85%] rounded-full border border-gray-800/60 absolute"></div>
                        <div className="w-[70%] h-[70%] rounded-full border border-gray-800/40 absolute"></div>
                        <div className="w-[55%] h-[55%] rounded-full border border-gray-800/30 absolute"></div>
                        <div className="w-[10%] h-[10%] rounded-full bg-[#333] absolute"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Text below the disc */}
          {currentTrack && (
            <div className="absolute -bottom-20 left-0 w-full text-center">
              <h3 className="text-xl font-bold text-white mb-1">{currentTrack.title}</h3>
              <p className="text-[#C8A97E]/80">{currentTrack.artist}</p>
            </div>
          )}

          {/* YouTube Iframe (hidden) */}
          <div className="hidden">
            <div id="youtube-player"></div>
          </div>

          {/* Centered gold play button that overlays the active disc */}
          <AnimatePresence>
            {currentTrack && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
              >
                <button
                  onClick={togglePlayPause}
                  className="flex items-center justify-center"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-[#C8A97E]" />
                  ) : (
                    <Play className="w-8 h-8 text-[#C8A97E] ml-1" />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
} 