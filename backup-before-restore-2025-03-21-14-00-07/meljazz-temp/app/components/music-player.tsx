"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useMedia } from "./media-context"

interface Song {
  title: string;
  artist: string;
  youtubeId: string;
  description: string;
}

const songs: Song[] = [
  {
    title: "Autumn Leaves - Jazz Piano",
    artist: "Melvo Jazz",
    youtubeId: "hFdMHvB6-Jk",
    description: "Jazz piano performance"
  },
  {
    title: "Vocal Jazz Improvisation",
    artist: "Melvo Jazz",
    youtubeId: "ZvWZr6TNh9Y",
    description: "Vocal techniques demonstration"
  },
  {
    title: "Jazz Standards Medley",
    artist: "Melvo Jazz",
    youtubeId: "r58-5DBfMpY",
    description: "Piano and vocal improvisation"
  },
  {
    title: "Original Jazz Composition",
    artist: "Melvo Jazz",
    youtubeId: "0zARqh3xwnw",
    description: "Original jazz composition"
  },
  {
    title: "Jazz Ensemble Performance",
    artist: "Melvo Jazz",
    youtubeId: "AWsarzdZ1u8",
    description: "Live jazz ensemble performance"
  },
  {
    title: "Vocal Coaching Session",
    artist: "Melvo Jazz",
    youtubeId: "GidIMbCmtyk",
    description: "Vocal coaching demonstration"
  },
  {
    title: "Piano Solo Improvisation",
    artist: "Melvo Jazz",
    youtubeId: "QgZKO_f5FlM",
    description: "Solo piano jazz improvisation"
  }
];

export default function MusicPlayer() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [miniPlayerTimeout, setMiniPlayerTimeout] = useState<NodeJS.Timeout | null>(null);
  const [visibleDiscs, setVisibleDiscs] = useState<number[]>([]);
  const [activeDiscIndex, setActiveDiscIndex] = useState(0);
  const [isTransitioningDiscs, setIsTransitioningDiscs] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const discControls = useAnimation();
  const tutorialControls = useAnimation();
  const notificationControls = useAnimation();
  const { currentlyPlaying, setCurrentlyPlaying, stopAllMedia } = useMedia()
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentSong = songs[currentSongIndex];
  
  // Prevent scrolling when dragging
  useEffect(() => {
    const preventScroll = (e: Event) => {
      if (isDragging) {
        e.preventDefault();
        return false;
      }
      return true;
    };

    // Add event listeners to prevent scrolling during drag
    if (isDragging) {
      document.addEventListener('wheel', preventScroll, { passive: false });
      document.addEventListener('touchmove', preventScroll, { passive: false });
    }

    return () => {
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, [isDragging]);

  // Calculate all visible disc indices based on drag position
  useEffect(() => {
    // Always show the current song and 2 discs on each side when dragging
    // Otherwise only show the current disc and one on each side for smooth transitions
    const indices = [];
    const totalSongs = songs.length;
    
    // Calculate which disc should be active based on drag
    let newActiveIndex = currentSongIndex;
    if (isDragging) {
      // Increase sensitivity but make it smoother: Each 250px of drag = 1 disc change
      // Further reduced sensitivity for smoother transitions with fast mouse movements
      const discShift = dragOffset / 250; // Use floating point for smoother transitions
      
      // Allow continuous dragging in either direction
      newActiveIndex = currentSongIndex - discShift;
      
      // Handle wrapping around in a continuous manner
      // This ensures we can keep dragging in the same direction indefinitely
      while (newActiveIndex < 0) {
        newActiveIndex += totalSongs;
      }
      while (newActiveIndex >= totalSongs) {
        newActiveIndex -= totalSongs;
      }
    }
    
    // Round to nearest integer for the active disc index
    const roundedActiveIndex = Math.round(newActiveIndex) % totalSongs;
    setActiveDiscIndex(roundedActiveIndex);
    
    if (isDragging || isTransitioningDiscs) {
      // Create a truly infinite carousel by adding discs in a way that allows
      // continuous scrolling in either direction
      // We'll add 2 discs on each side of the active disc for smoother transitions
      for (let i = -2; i <= 2; i++) {
        // Calculate the index with proper wrapping
        let index = (roundedActiveIndex + i) % totalSongs;
        if (index < 0) index = totalSongs + index;
        indices.push(index);
      }
      
      // Add additional discs for seamless looping when approaching the edges
      // This ensures that when you reach the end of the list, the beginning discs
      // are already visible and vice versa
      if (roundedActiveIndex <= 1) {
        // Near the beginning, add discs from the end
        indices.push((totalSongs - 2) % totalSongs);
        indices.push((totalSongs - 1) % totalSongs);
      } else if (roundedActiveIndex >= totalSongs - 2) {
        // Near the end, add discs from the beginning
        indices.push(0);
        indices.push(1);
      }
    } else {
      // When not dragging, show the current disc and one on each side for smooth transitions
      indices.push(roundedActiveIndex);
      
      // Add one disc on each side
      const prevIndex = (roundedActiveIndex - 1 + totalSongs) % totalSongs;
      const nextIndex = (roundedActiveIndex + 1) % totalSongs;
      indices.push(prevIndex);
      indices.push(nextIndex);
    }
    
    // Remove any duplicate indices that might have been added
    const uniqueIndices = Array.from(new Set(indices));
    setVisibleDiscs(uniqueIndices);
  }, [currentSongIndex, dragOffset, isDragging, isTransitioningDiscs, songs.length]);

  // Set player ready after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setPlayerReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Show/hide mini player based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (!playerRef.current) return;
      
      const playerRect = playerRef.current.getBoundingClientRect();
      const isPlayerVisible = 
        playerRect.top < window.innerHeight && 
        playerRect.bottom > 0;
      
      if (!isPlayerVisible && isPlaying) {
        // Player is not visible and music is playing, show mini player
        setShowMiniPlayer(true);
      } else {
        // Player is visible or music is not playing, hide mini player
        setShowMiniPlayer(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlaying]);

  // Auto-hide mini player when music is paused
  useEffect(() => {
    if (!isPlaying && showMiniPlayer) {
      // Clear any existing timeout
      if (miniPlayerTimeout) {
        clearTimeout(miniPlayerTimeout);
      }
      
      // Set a new timeout to hide the mini player after 3 seconds
      const timeout = setTimeout(() => {
        setShowMiniPlayer(false);
      }, 3000);
      
      setMiniPlayerTimeout(timeout);
    }
    
    return () => {
      if (miniPlayerTimeout) {
        clearTimeout(miniPlayerTimeout);
      }
    };
  }, [isPlaying, showMiniPlayer]);

  // Show tutorial animation on first load
  useEffect(() => {
    // Check if this is the first visit
    const hasSeenTutorial = localStorage.getItem('music-tutorial-seen');
    
    if (!hasSeenTutorial && playerReady) {
      setShowTutorial(true);
      setShowNotification(true);
      
      // Animate the tutorial hand
      tutorialControls.start({
        x: [-40, 40, -40],
        transition: {
          duration: 2.5,
          repeat: 1,
          ease: "easeInOut"
        }
      }).then(() => {
        setShowTutorial(false);
        localStorage.setItem('music-tutorial-seen', 'true');
      });

      // Animate the notification
      notificationControls.start({
        opacity: [0, 1, 1, 0],
        y: [20, 0, 0, -20],
        transition: {
          duration: 4,
          times: [0, 0.1, 0.9, 1],
          ease: "easeInOut"
        }
      }).then(() => {
        setShowNotification(false);
      });
    }
  }, [playerReady, tutorialControls, notificationControls]);

  // Handle YouTube player messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "onStateChange") {
          // YouTube states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering)
          if (data.info === 1) {
            setIsPlaying(true);
          } else if (data.info === 2) {
            setIsPlaying(false);
          } else if (data.info === 0) {
            // Video ended, play next
            playNextSong();
          }
        } else if (data.event === "onReady") {
          // Player is ready
          setPlayerReady(true);
        }
      } catch (e) {
        // Not a JSON message or not from YouTube
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Spinning animation with slow start
  useEffect(() => {
    // Stop all animations first
    discControls.stop();
    
    // Only animate if playing and only for the current song
    if (isPlaying && currentSongIndex === activeDiscIndex) {
      discControls.start({
        rotate: 360,
        transition: {
          duration: 20, // Much slower rotation (20 seconds per rotation)
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop"
        }
      });
    }
  }, [isPlaying, discControls, currentSongIndex, activeDiscIndex]);

  // Listen for global stop events
  useEffect(() => {
    const handleStopAllMedia = () => {
      if (audioRef.current) {
        audioRef.current.pause()
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
    if (currentlyPlaying === 'video' && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [currentlyPlaying, isPlaying])

  const handlePlayPause = (trackIndex: number) => {
    if (currentSongIndex === trackIndex && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (currentSongIndex !== trackIndex) {
        // Stop all animations before changing tracks
        discControls.stop();
        
        setCurrentSongIndex(trackIndex);
        setActiveDiscIndex(trackIndex);
        // Stop all discs from spinning when changing tracks
        setIsPlaying(false);
        
        // Small timeout to ensure the audio element has updated its src
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(error => {
              console.error("Error playing audio:", error);
            });
            setIsPlaying(true);
          }
        }, 50);
      } else {
        audioRef.current?.play().catch(error => {
          console.error("Error playing audio:", error);
        });
        setIsPlaying(true);
      }
    }
  };
  
  // Make the disc only clickable in the center play button
  const handleDiscClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable disc click functionality - only the center button should work
    // This prevents accidental playback when trying to drag
    e.stopPropagation();
  }
  
  // Handler specifically for the play button
  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handlePlayPause(currentSongIndex);
  }

  const playNextSong = () => {
    if (!playerReady || isTransitioning) return;
    
    setIsTransitioning(true);
    setIsPlaying(false);
    
    // Wait for transition animation
    setTimeout(() => {
      setCurrentSongIndex((prevIndex) => 
        prevIndex === songs.length - 1 ? 0 : prevIndex + 1
      );
      setProgress(0);
      
      // Wait a bit more before starting the new song
      setTimeout(() => {
        setIsTransitioning(false);
        if (videoRef.current) {
          // Load and play the new video
          const nextIndex = currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
          const message = `{"event":"command","func":"loadVideoById","args":"${songs[nextIndex].youtubeId}"}`;
          videoRef.current.contentWindow?.postMessage(message, '*');
        }
      }, 800);
    }, 500);
  };

  const playPreviousSong = () => {
    if (!playerReady || isTransitioning) return;
    
    setIsTransitioning(true);
    setIsPlaying(false);
    
    // Wait for transition animation
    setTimeout(() => {
      setCurrentSongIndex((prevIndex) => 
        prevIndex === 0 ? songs.length - 1 : prevIndex - 1
      );
      setProgress(0);
      
      // Wait a bit more before starting the new song
      setTimeout(() => {
        setIsTransitioning(false);
        if (videoRef.current) {
          // Load and play the new video
          const prevIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
          const message = `{"event":"command","func":"loadVideoById","args":"${songs[prevIndex].youtubeId}"}`;
          videoRef.current.contentWindow?.postMessage(message, '*');
        }
      }, 800);
    }, 500);
  };

  // Improved drag handlers for continuous carousel navigation
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent default to avoid any browser behaviors
    e.preventDefault();
    e.stopPropagation();
    
    // Only start dragging if we're not clicking on a button
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }
    
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    
    // Add a class to the body to indicate dragging (for cursor changes)
    document.body.classList.add('dragging-disc');
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    // Prevent default to avoid any scrolling behavior
    e.preventDefault();
    e.stopPropagation();
    
    const dragDistance = e.clientX - dragStartX;
    
    // Apply a stronger damping factor for more responsive movement
    const dampingFactor = 1.2;
    const dampedDragDistance = dragDistance * dampingFactor;
    
    setDragOffset(dampedDragDistance);
    
    // Make disc switching more responsive by reducing the threshold
    const dragThreshold = 80; // Reduced threshold for easier disc switching
    
    if (Math.abs(dragDistance) > dragThreshold) {
      // Determine direction of drag
      const direction = dragDistance > 0 ? -1 : 1; // -1 for right (previous), 1 for left (next)
      
      // Calculate new index with proper wrapping
      const newIndex = (currentSongIndex + direction + songs.length) % songs.length;
      
      // Update current song index and reset drag
      setCurrentSongIndex(newIndex);
      setActiveDiscIndex(newIndex);
      setDragStartX(e.clientX);
      setDragOffset(0);
      
      // Set transitioning state to true to keep discs visible during transition
      setIsTransitioningDiscs(true);
      
      // After transition is complete, set transitioning to false
      setTimeout(() => {
        setIsTransitioningDiscs(false);
      }, 300);
    }
  };

  const handleDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      // Prevent default to avoid any scrolling behavior
      e.preventDefault();
      e.stopPropagation();
      
      // Set the current song to the active disc
      setCurrentSongIndex(activeDiscIndex);
      
      // Set transitioning state to true to keep discs visible during transition
      setIsTransitioningDiscs(true);

      // Load the new song
      if (videoRef.current) {
        const message = `{"event":"command","func":"loadVideoById","args":"${songs[activeDiscIndex].youtubeId}"}`;
        videoRef.current.contentWindow?.postMessage(message, '*');
      }

      // Reset drag state with a smooth transition
      setDragOffset(0);
      
      // After transition is complete, set transitioning to false
      setTimeout(() => {
        setIsTransitioningDiscs(false);
      }, 600); // Match this with the transition duration in the motion.div
      
      // Remove the dragging class
      document.body.classList.remove('dragging-disc');
    }
    setIsDragging(false);
  };

  // Calculate disc position based on its index and drag offset
  const getDiscPosition = (index: number) => {
    const totalSongs = songs.length;
    
    // Calculate the shortest distance between the indices, considering the circular nature
    let distance = index - activeDiscIndex;
    
    // Adjust for wrapping around the ends
    if (Math.abs(distance) > totalSongs / 2) {
      if (distance > 0) {
        distance = distance - totalSongs;
      } else {
        distance = distance + totalSongs;
      }
    }
    
    // Increase spacing between discs for better visibility
    const basePosition = distance * 200; // Increased from 160px for more separation
    
    // Apply stronger easing function for smoother movement with fast drags
    const easedDragOffset = dragOffset * (1 - Math.abs(dragOffset) / 2000);
    
    return basePosition + easedDragOffset;
  };

  // Calculate disc scale based on its position from center
  const getDiscScale = (position: number) => {
    const absPosition = Math.abs(position);
    // Center disc is full size, others get progressively smaller
    // More dramatic scale curve for better visual effect
    return Math.max(0.2, 1 - (absPosition / 300) * 0.8);
  };

  // Calculate disc opacity based on its position from center
  const getDiscOpacity = (position: number) => {
    const absPosition = Math.abs(position);
    // Center disc is fully opaque, others get progressively more transparent
    // More dramatic opacity curve for better visual effect
    return Math.max(0.1, 1 - (absPosition / 200) * 0.9);
  };

  // Calculate disc z-index based on its position from center
  const getDiscZIndex = (position: number) => {
    const absPosition = Math.abs(position);
    // Center disc has highest z-index
    return 100 - Math.floor(absPosition / 10);
  };

  // Calculate disc blur based on its position from center
  const getDiscBlur = (position: number) => {
    const absPosition = Math.abs(position);
    // Center disc has no blur, others get progressively more blurry
    return `blur(${Math.min(5, absPosition / 100)}px)`;
  };

  // Mouse hover handlers for notification
  const handleDiscHover = () => {
    setIsHovering(true);
    setShowNotification(true);
    notificationControls.start({
      opacity: [0, 1, 1, 0],
      y: [20, 0, 0, -20],
      transition: {
        duration: 4,
        times: [0, 0.1, 0.9, 1],
        ease: "easeInOut"
      }
    }).then(() => {
      setShowNotification(false);
    });
  };

  const handleDiscLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="max-w-5xl mx-auto relative py-10 z-10" ref={playerRef}>
      <div className="relative mx-auto" style={{ maxWidth: "500px" }}>
        <div className="flex items-center justify-center">
          <div 
            className="relative flex items-center justify-center overflow-visible h-[400px] disc-container"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={(e) => {
              handleDragEnd(e);
              handleDiscLeave();
            }}
            onMouseEnter={handleDiscHover}
          >
            {/* Carousel of discs */}
            {visibleDiscs.map((songIndex) => {
              const position = getDiscPosition(songIndex);
              const scale = getDiscScale(position);
              const opacity = getDiscOpacity(position);
              const zIndex = getDiscZIndex(position);
              const blur = getDiscBlur(position);
              const isActive = songIndex === activeDiscIndex;
              
              // Calculate a left offset to create more overlap between discs
              // Discs to the left will be shifted right, discs to the right will be shifted left
              const overlapOffset = position < 0 ? 40 : (position > 0 ? -40 : 0);
              
              // Only show non-active discs when hovering or dragging
              const shouldShow = isActive || isHovering || isDragging;
              
              return (
                <motion.div
                  key={`disc-${songIndex}`}
                  className="absolute"
                  data-disc-index={songIndex}
                  animate={{ 
                    x: position + overlapOffset, // Add overlap offset
                    scale,
                    opacity: shouldShow ? opacity : 0, // Hide non-active discs when not hovering
                    filter: `blur(${blur}px)`,
                    zIndex
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 180, // Lower stiffness for smoother movement
                    damping: 22,
                    mass: 1,
                    duration: isDragging ? 0.05 : 0.6, // Longer duration when not dragging for smoother transitions
                    opacity: { duration: 0.3 } // Faster opacity transition
                  }}
                  style={{ 
                    transformOrigin: 'center center',
                    willChange: 'transform, opacity, filter'
                  }}
                >
                  {/* Vinyl disc background */}
                  <motion.div 
                    className={`w-[400px] h-[400px] rounded-full bg-black relative ${isActive ? 'ring-4 ring-[#C8A97E]/30 ring-offset-2 ring-offset-black/10' : ''}`}
                    animate={isActive && isPlaying && songIndex === currentSongIndex ? discControls : { rotate: 0 }}
                    initial={{ rotate: 0 }}
                    style={{
                      boxShadow: isActive ? '0 10px 30px rgba(0, 0, 0, 0.6)' : 'none'
                    }}
                  >
                    {/* Vinyl grooves */}
                    <div className="absolute inset-0 rounded-full border-4 border-gray-800" style={{ margin: '10%' }} />
                    <div className="absolute inset-0 rounded-full border-4 border-gray-800" style={{ margin: '20%' }} />
                    <div className="absolute inset-0 rounded-full border-4 border-gray-800" style={{ margin: '30%' }} />
                    <div className="absolute inset-0 rounded-full border-4 border-gray-800" style={{ margin: '40%' }} />
                    
                    {/* Center label - only visible on active disc */}
                    {isActive && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-black flex items-center justify-center z-10 shadow-inner border-2 border-gray-800">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePlayPause(songIndex)}
                          className="w-16 h-16 flex items-center justify-center rounded-full bg-black play-button-area"
                        >
                          {isPlaying ? <Pause size={32} className="text-[#C8A97E]" /> : <Play size={32} className="text-[#C8A97E] ml-1" />}
                        </motion.button>
                      </div>
                    )}
                    
                    {/* Video thumbnail as background */}
                    <div className="absolute inset-0 rounded-full overflow-hidden opacity-70 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-black/40 z-[1]" /> {/* Darkening overlay */}
                      <Image
                        src={`https://img.youtube.com/vi/${songs[songIndex].youtubeId}/maxresdefault.jpg`}
                        alt={songs[songIndex].title}
                        fill
                        className="object-cover grayscale" /* Black and white filter */
                        unoptimized={true} /* Ensure image loads properly */
                      />
                    </div>
                  </motion.div>
                  
                  {/* Song info - only visible on active disc */}
                  {isActive && (
                    <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 w-64 text-center">
                      <h3 className="font-serif text-xl font-medium mb-1 text-white drop-shadow-md">
                        {songs[songIndex].title}
                      </h3>
                      <p className="text-gray-300 italic text-sm font-light tracking-wide">
                        {songs[songIndex].artist}
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {/* Tutorial animation */}
            {showTutorial && (
              <motion.div 
                className="absolute z-20 pointer-events-none"
                animate={tutorialControls}
                style={{ bottom: "50%", left: "50%" }}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 absolute" 
                    style={{ 
                      filter: "blur(8px)",
                      transform: "translate(-50%, -50%)"
                    }} 
                  />
                  <div className="w-8 h-8 border-2 border-white rounded-full absolute"
                    style={{ 
                      transform: "translate(-50%, -50%)"
                    }} 
                  />
                  <div className="absolute" style={{ transform: "translate(-50%, -50%)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11.5C9 12.8807 7.88071 14 6.5 14C5.11929 14 4 12.8807 4 11.5C4 10.1193 5.11929 9 6.5 9C7.88071 9 9 10.1193 9 11.5Z" fill="white"/>
                      <path d="M19 11.5C19 12.8807 17.8807 14 16.5 14C15.1193 14 14 12.8807 14 11.5C14 10.1193 15.1193 9 16.5 9C17.8807 9 19 10.1193 19 11.5Z" fill="white"/>
                      <path d="M14 5.5C14 6.88071 12.8807 8 11.5 8C10.1193 8 9 6.88071 9 5.5C9 4.11929 10.1193 3 11.5 3C12.8807 3 14 4.11929 14 5.5Z" fill="white"/>
                      <path d="M14 17.5C14 18.8807 12.8807 20 11.5 20C10.1193 20 9 18.8807 9 17.5C9 16.1193 10.1193 15 11.5 15C12.8807 15 14 16.1193 14 17.5Z" fill="white"/>
                    </svg>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Temporary notification */}
            {showNotification && (
              <motion.div 
                className="absolute z-30 pointer-events-none bg-black/80 text-white px-4 py-2 rounded-full"
                animate={notificationControls}
                style={{ bottom: "-60px", left: "50%", transform: "translateX(-50%)" }}
              >
                Drag disc left or right to change songs
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* YouTube iframe for audio */}
      <iframe
        ref={videoRef}
        src={`https://www.youtube.com/embed/${currentSong.youtubeId}?enablejsapi=1&controls=0&showinfo=0&modestbranding=1&rel=0&autoplay=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
        className="w-0 h-0 absolute"
        allow="autoplay"
      />

      {/* Floating Mini Player */}
      <AnimatePresence>
        {showMiniPlayer && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <motion.div 
              className="bg-black/80 backdrop-blur-md rounded-full p-3 flex items-center gap-3 border border-[#C8A97E]/30 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Mini disc */}
              <motion.div 
                className="w-12 h-12 rounded-full overflow-hidden relative"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "loop" }}
              >
                <Image
                  src={`https://img.youtube.com/vi/${currentSong.youtubeId}/maxresdefault.jpg`}
                  alt={currentSong.title}
                  fill
                  className="object-cover"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 rounded-full border-2 border-[#C8A97E]/40" />
              </motion.div>
              
              {/* Song info */}
              <div className="text-white max-w-[120px]">
                <p className="text-sm font-medium truncate text-[#C8A97E]">{currentSong.title}</p>
                <p className="text-xs text-white/70 truncate">{currentSong.artist}</p>
              </div>
              
              {/* Play/Pause button */}
              <motion.button
                onClick={() => handlePlayPause(currentSongIndex)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#C8A97E]/20 text-[#C8A97E]"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-1" />}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <audio 
        ref={audioRef}
        src={currentSong.youtubeId} 
        onEnded={playNextSong}
        onTimeUpdate={() => {}}
      />
      <style jsx global>{`
        .dragging-disc {
          cursor: grabbing !important;
        }
        .disc-container {
          cursor: grab;
        }
        .disc-container:active {
          cursor: grabbing;
        }
        .play-button-area {
          cursor: pointer !important;
        }
      `}</style>
    </div>
  );
} 