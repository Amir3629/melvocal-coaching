"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useMedia } from "./media-context";
import { getImagePath } from '@/app/utils/image-path';

interface Song {
  title: string;
  artist: string;
  youtubeId: string;
  description: string;
  coverImage: string;
}

// Reuse the same songs array from the main music player
const songs: Song[] = [
  {
    title: "Autumn Leaves - Jazz Piano",
    artist: "Melvo Jazz",
    youtubeId: "hFdMHvB6-Jk",
    description: "Jazz piano performance",
    coverImage: "./images/music-new/jazz-piano.svg"
  },
  {
    title: "Vocal Jazz Improvisation",
    artist: "Melvo Jazz",
    youtubeId: "ZvWZr6TNh9Y",
    description: "Vocal techniques demonstration",
    coverImage: "./images/music-new/vocal-jazz.svg"
  },
  {
    title: "Jazz Standards Medley",
    artist: "Melvo Jazz",
    youtubeId: "r58-5DBfMpY",
    description: "Piano and vocal improvisation",
    coverImage: "./images/music-new/jazz-standards.svg"
  },
  {
    title: "Original Jazz Composition",
    artist: "Melvo Jazz",
    youtubeId: "0zARqh3xwnw",
    description: "Original jazz composition",
    coverImage: "./images/music-new/original-jazz.svg"
  },
  {
    title: "Jazz Ensemble Performance",
    artist: "Melvo Jazz",
    youtubeId: "AWsarzdZ1u8",
    description: "Live jazz ensemble performance",
    coverImage: "./images/music-new/jazz-ensemble.svg"
  },
  {
    title: "Vocal Coaching Session",
    artist: "Melvo Jazz",
    youtubeId: "GidIMbCmtyk",
    description: "Vocal coaching demonstration",
    coverImage: "./images/music-new/vocal-coaching.svg"
  },
  {
    title: "Piano Solo Improvisation",
    artist: "Melvo Jazz",
    youtubeId: "QgZKO_f5FlM",
    description: "Solo piano jazz improvisation",
    coverImage: "./images/music-new/piano-solo.svg"
  }
];

export default function MobileMusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [visibleDiscs, setVisibleDiscs] = useState<number[]>([]);
  const [activeDiscIndex, setActiveDiscIndex] = useState(0);
  const { currentlyPlaying, setCurrentlyPlaying, stopAllMedia } = useMedia();
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const currentSong = songs[currentSongIndex];

  // Handle stopping other media when this player starts
  useEffect(() => {
    if (isPlaying) {
      setCurrentlyPlaying('music');
    } else if (currentlyPlaying === 'music') {
      setCurrentlyPlaying(null);
    }
    
    return () => {
      if (currentlyPlaying === 'music') {
        setCurrentlyPlaying(null);
      }
    };
  }, [isPlaying, currentlyPlaying, setCurrentlyPlaying]);

  // Listen for stop all media events
  useEffect(() => {
    const handleStopAllMedia = () => {
      if (isPlaying) {
        setIsPlaying(false);
      }
    };

    window.addEventListener('stopAllMedia', handleStopAllMedia);
    return () => {
      window.removeEventListener('stopAllMedia', handleStopAllMedia);
    };
  }, [isPlaying]);

  // Calculate visible discs
  useEffect(() => {
    const indices = [];
    const totalSongs = songs.length;
    
    let newActiveIndex = currentSongIndex;
    if (isDragging) {
      const discShift = dragOffset / 200; // More sensitive for mobile
      newActiveIndex = currentSongIndex - discShift;
      
      while (newActiveIndex < 0) {
        newActiveIndex += totalSongs;
      }
      while (newActiveIndex >= totalSongs) {
        newActiveIndex -= totalSongs;
      }
    }
    
    const roundedActiveIndex = Math.round(newActiveIndex) % totalSongs;
    setActiveDiscIndex(roundedActiveIndex);
    
    // Always show active disc
    indices.push(roundedActiveIndex);
    
    // Add one disc on each side for mobile
    indices.push((roundedActiveIndex - 1 + totalSongs) % totalSongs);
    indices.push((roundedActiveIndex + 1) % totalSongs);
    
    // Remove duplicates
    const uniqueIndices = Array.from(new Set(indices));
    setVisibleDiscs(uniqueIndices);
  }, [currentSongIndex, dragOffset, isDragging, songs.length]);

  // Handle play/pause toggling
  const togglePlay = () => {
    if (isPlaying) {
      stopAllMedia();
      setIsPlaying(false);
    } else {
      stopAllMedia();
      setIsPlaying(true);
    }
  };

  // Handle clicking on a disc to select it
  const handleDiscClick = (songIndex: number) => {
    if (songIndex === currentSongIndex) {
      togglePlay();
    } else {
      setCurrentSongIndex(songIndex);
      setIsPlaying(true);
    }
  };

  // Handle touch controls for swiping through discs
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isTransitioning) return;
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || isTransitioning) return;
    const touchX = e.touches[0].clientX;
    const newOffset = touchX - dragStartX;
    setDragOffset(newOffset);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || isTransitioning) return;
    
    const finalOffset = dragOffset;
    // Threshold for changing disc
    const threshold = 50; 
    
    if (finalOffset > threshold) {
      // Swipe right - go to previous song
      const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      setCurrentSongIndex(prevIndex);
    } else if (finalOffset < -threshold) {
      // Swipe left - go to next song
      const nextIndex = (currentSongIndex + 1) % songs.length;
      setCurrentSongIndex(nextIndex);
    }
    
    setIsTransitioning(true);
    setIsDragging(false);
    setDragOffset(0);
    
    // Reset transitioning after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // Get position for disc based on index
  const getDiscPosition = (index: number) => {
    // Calculate normalized position within carousel
    let normalizedPos = 0;
    
    // Find the shortest distance between indices in a circular manner
    const diff = ((index - activeDiscIndex) % songs.length + songs.length) % songs.length;
    const altDiff = songs.length - diff;
    
    if (diff <= altDiff) {
      normalizedPos = diff;
    } else {
      normalizedPos = -altDiff;
    }
    
    // Apply drag offset for smoother transitions
    if (isDragging) {
      normalizedPos += dragOffset / 200;
    }
    
    // Position discs in a circular arrangement
    return {
      x: normalizedPos * 120, // Horizontal spacing between discs
      y: 0,                   // No vertical offset
      z: -Math.abs(normalizedPos) * 50 // Move non-active discs back in z-space
    };
  };

  // Calculate scale for disc based on position
  const getDiscScale = (index: number) => {
    // Calculate normalized position for scaling
    const normalizedPos = Math.abs(((index - activeDiscIndex) % songs.length + songs.length) % songs.length);
    const altPos = Math.abs(songs.length - normalizedPos);
    const pos = Math.min(normalizedPos, altPos);
    
    // Make active disc larger, others smaller
    return pos === 0 ? 0.9 : 0.6;
  };

  return (
    <div className="relative w-full max-w-xs mx-auto" ref={playerRef}>
      {/* Fixed sized container with strict dimensions to ensure circle shape */}
      <div className="relative w-full max-w-[300px] mx-auto">
        <div 
          className="relative aspect-square"
          style={{
            perspective: '1000px',
          }}
        >
          {/* Discs container with proper centering */}
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{ touchAction: 'pan-y', userSelect: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {visibleDiscs.map((discIndex, idx) => {
              // Get the actual song index
              const normalizedIndex = ((discIndex % songs.length) + songs.length) % songs.length;
              const song = songs[normalizedIndex];
              const isActive = normalizedIndex === currentSongIndex;
              
              // Calculate position
              const position = getDiscPosition(discIndex);
              const scale = getDiscScale(discIndex);
              
              return (
                <div
                  key={`disc-${discIndex}-${idx}`}
                  style={{
                    position: 'absolute',
                    transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px) scale(${scale})`,
                    width: '160px', // Fixed width for better control
                    height: '160px', // Fixed height to ensure perfect circle
                    zIndex: isActive ? 10 : 0,
                    transformStyle: 'preserve-3d',
                    transition: isTransitioning ? 'transform 0.3s ease' : 'none',
                  }}
                  onClick={() => handleDiscClick(normalizedIndex)}
                >
                  {/* Vinyl disc with perfectly circular container */}
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      backgroundColor: 'black',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: isActive ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
                      animation: isActive && isPlaying ? 'spin 20s linear infinite' : 'none',
                    }}
                  >
                    {/* Album cover image with strict containment to prevent oval shape */}
                    <div className="absolute inset-0 rounded-full overflow-hidden" style={{ contain: 'strict' }}>
                      <div className="relative w-full h-full">
                        <Image
                          src={song.coverImage}
                          alt={song.title}
                          fill
                          sizes="160px"
                          style={{
                            objectFit: 'cover',
                            objectPosition: 'center', // Center the image
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                          }}
                          className="rounded-full"
                          priority
                        />
                      </div>
                    </div>
                    
                    {/* Center hole */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '12px',
                        height: '12px',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'black',
                        borderRadius: '50%',
                        boxShadow: 'inset 0 2px 5px rgba(255, 255, 255, 0.1)',
                        zIndex: 5,
                      }}
                    />

                    {/* Play button overlay - only on active disc */}
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          width: '40px',
                          height: '40px',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          backdropFilter: 'blur(2px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 10,
                          cursor: 'pointer',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay();
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Song info and controls */}
      <div className="mt-6 w-full text-center">
        <h3 className="text-lg font-semibold">{currentSong.title}</h3>
        <p className="text-sm opacity-75">{currentSong.artist}</p>
      </div>
    </div>
  );
} 