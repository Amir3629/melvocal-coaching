"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useMedia } from "./media-context"
import { getImagePath } from '@/app/utils/image-path';
import MobileMusicPlayer from './mobile-music-player';

interface Song {
  title: string;
  artist: string;
  youtubeId: string;
  description: string;
  coverImage: string;
}

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
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const discControls = useAnimation();
  const tutorialControls = useAnimation();
  const notificationControls = useAnimation();
  const { currentlyPlaying, setCurrentlyPlaying, stopAllMedia } = useMedia()
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentSong = songs[currentSongIndex];
  
  // Initialize and update isMobile state
  useEffect(() => {
    // Set initial mobile state
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on mount and on resize
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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
    // Always show the current song and 3 discs on each side when dragging
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
      
      // Use fewer discs on mobile for better performance
      const discRange = isMobile ? 2 : 3;
      
      // Add discs within the range
      for (let i = -discRange; i <= discRange; i++) {
        // Calculate the index with proper wrapping
        let index = (roundedActiveIndex + i) % totalSongs;
        if (index < 0) index = totalSongs + index;
        indices.push(index);
      }
      
      // Add additional discs for seamless looping when approaching the edges
      // This ensures that when you reach the end of the list, the beginning discs
      // are already visible and vice versa
      if (roundedActiveIndex <= discRange) {
        // Near the beginning, add discs from the end
        for (let i = 1; i <= discRange; i++) {
          indices.push((totalSongs - i) % totalSongs);
        }
      } else if (roundedActiveIndex >= totalSongs - discRange) {
        // Near the end, add discs from the beginning
        for (let i = 0; i < discRange; i++) {
          indices.push(i);
        }
      }
    } else {
      // When not dragging, show the current disc and one or two on each side for smooth transitions
      indices.push(roundedActiveIndex);
      
      // Add one or two discs on each side depending on device
      const prevRange = isMobile ? 1 : 2;
      const nextRange = isMobile ? 1 : 2;
      
      // Add previous discs
      for (let i = 1; i <= prevRange; i++) {
        indices.push((roundedActiveIndex - i + totalSongs) % totalSongs);
      }
      
      // Add next discs
      for (let i = 1; i <= nextRange; i++) {
        indices.push((roundedActiveIndex + i) % totalSongs);
      }
    }
    
    // Remove any duplicate indices that might have been added
    const uniqueIndices = Array.from(new Set(indices));
    setVisibleDiscs(uniqueIndices);
  }, [currentSongIndex, dragOffset, isDragging, isTransitioningDiscs, songs.length, isMobile]);

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

  // Listen for window resize events to update disc positions
  useEffect(() => {
    const handleResize = () => {
      // Force re-render when window size changes
      // This ensures our responsive disc positions update
      // The isMobile state will be updated through its own effect
      setVisibleDiscs(prev => [...prev]);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [visibleDiscs]);

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
  
  // Add a togglePlay function
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().catch(error => {
        console.error("Error playing audio:", error);
      });
      setIsPlaying(true);
    }
  };

  // Fix the handleDiscClick function
  const handleDiscClick = (songIndex: number) => {
    // If we're clicking on the current song, toggle play/pause
    if (songIndex === currentSongIndex) {
      togglePlay();
    } else {
      // Otherwise, switch to the new song and start playing
    setCurrentSongIndex(songIndex);
    setActiveDiscIndex(songIndex);
      
      // The actual play action will happen when the audio source changes
      setIsPlaying(true);
  }
  };
  
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

  // Handle the start of dragging on a disc
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only respond to left mouse button
    e.preventDefault();
    e.stopPropagation();
    
    const discElement = e.currentTarget;
    const discIndex = parseInt(discElement.getAttribute('data-disc-index') || '0', 10);
    
    // Capture mouse position for dragging calculation
    setDragStartX(e.clientX);
    setDragOffset(0);
    setIsDragging(true);
    
    // Set the active disc based on the disc that was clicked
    setActiveDiscIndex(discIndex);
    
    // Add classes to indicate dragging state
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    // Capture mouse events on the entire document during dragging
    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);
  };
  
  // Document-level mouse move handler for smoother dragging
  const handleDocumentMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    // Calculate drag distance with increased sensitivity for smoother transitions
    const dragDistance = e.clientX - dragStartX;
    
    // Apply a more responsive drag with slight resistance
    // This makes short drags more precise but allows long swipes to be more fluid
    const dragResistance = 0.85;
    const adjustedDragDistance = dragDistance * dragResistance;
    
    setDragOffset(adjustedDragDistance);
    
    // Use a floating point calculation for smoother transitions
    // Instead of using discrete steps, we calculate a continuous position
    const discWidth = 250; // Average visual width between discs in pixels
    const discMovementFactor = adjustedDragDistance / discWidth;
    
    // Only update the current index when we've dragged far enough
    // This creates more natural disc movement and prevents flickering
    if (Math.abs(discMovementFactor) >= 0.8) {
      // Calculate how many discs to move and in which direction
      const discShift = Math.sign(adjustedDragDistance) * Math.floor(Math.abs(discMovementFactor));
      
      if (discShift !== 0) {
        // Update the index and reset the drag origin for continuous dragging
        const newIndex = (currentSongIndex - discShift + songs.length) % songs.length;
      setCurrentSongIndex(newIndex);
      setActiveDiscIndex(newIndex);
        
        // Reset drag start position to current position to allow continuous dragging
      setDragStartX(e.clientX);
      setDragOffset(0);
      
        // Brief transition state to ensure smooth animation between disc changes
      setIsTransitioningDiscs(true);
      setTimeout(() => {
        setIsTransitioningDiscs(false);
        }, 50);
      }
    }
  };

  // Handle the end of dragging
  const handleDragEnd = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
      e.preventDefault();
      e.stopPropagation();
      
    // Smoothly complete the current drag motion
    const finalDragDistance = dragOffset;
    
    if (Math.abs(finalDragDistance) > 75) {
      // If the user has dragged a significant distance but not enough to trigger
      // a disc change, we'll snap to the closest disc in the direction of drag
      const direction = Math.sign(finalDragDistance);
      const newIndex = (currentSongIndex - direction + songs.length) % songs.length;
      setCurrentSongIndex(newIndex);
      setActiveDiscIndex(newIndex);
    }
    
    // Reset to normal state
    setIsDragging(false);
    setDragOffset(0);
      setIsTransitioningDiscs(true);

    // Clean up document event listeners
    document.removeEventListener('mousemove', handleDocumentMouseMove);
    document.removeEventListener('mouseup', handleDocumentMouseUp);
    
    // Reset cursor and user-select
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioningDiscs(false);
    }, 500);
  };
  
  // Document-level mouse up handler to end dragging even if outside component
  const handleDocumentMouseUp = () => {
    if (!isDragging) return;
    
    // Similar logic to handleDragEnd but without the event
    const finalDragDistance = dragOffset;
    
    if (Math.abs(finalDragDistance) > 75) {
      const direction = Math.sign(finalDragDistance);
      const newIndex = (currentSongIndex - direction + songs.length) % songs.length;
      setCurrentSongIndex(newIndex);
      setActiveDiscIndex(newIndex);
    }
    
    setIsDragging(false);
    setDragOffset(0);
    setIsTransitioningDiscs(true);
    
    document.removeEventListener('mousemove', handleDocumentMouseMove);
    document.removeEventListener('mouseup', handleDocumentMouseUp);
    
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    setTimeout(() => {
      setIsTransitioningDiscs(false);
    }, 500);
  };

  // Position calculation for the discs - create a smooth, natural circular arrangement
  const getDiscPosition = (index: number, isMobile: boolean) => {
    // Calculate distance from active disc
    const distanceFromActive = index - activeDiscIndex + dragOffset;
    
    // Much smaller offsets for mobile to prevent discs from going off-screen
    const maxXOffset = isMobile ? 60 : 180; // Further reduce horizontal spacing 
    const maxYOffset = isMobile ? 5 : 20;   // Keep minimal vertical arc
    const zDepth = isMobile ? 30 : 100;     // Keep same depth effect
    
    // Calculate x factor - less exponential for smoother transition
    const xFactor = isMobile 
      ? Math.sign(distanceFromActive) * Math.min(Math.abs(distanceFromActive), 0.9) 
      : Math.sign(distanceFromActive) * Math.pow(Math.abs(distanceFromActive), 1.2);
    
    // Calculate position with tighter constraints
    const xPosition = xFactor * maxXOffset;
    const yPosition = Math.abs(distanceFromActive) * maxYOffset;
    const zPosition = -Math.abs(distanceFromActive) * zDepth;
    
    return { x: xPosition, y: yPosition, z: zPosition };
  };

  // Scale calculation for discs - center disc is largest, discs get smaller as they move away
  const getDiscScale = (index: number, isMobile: boolean = false) => {
    // Calculate distance from the active disc
    const distanceFromActive = Math.abs(index - activeDiscIndex + dragOffset);
    
    // On mobile, we want to scale down inactive discs more aggressively
    const minScale = isMobile ? 0.6 : 0.7;
    const falloffRate = isMobile ? 0.2 : 0.15;
    
    // Base scale is 1.0 for the active disc
    const scale = Math.max(minScale, 1 - (distanceFromActive * falloffRate));
    
    return scale;
  };

  // Opacity calculation - center disc is most opaque, discs get more transparent as they move away
  const getDiscOpacity = (index: number) => {
    const totalSongs = songs.length;
    const indexDiff = ((index - activeDiscIndex) % totalSongs + totalSongs) % totalSongs;
    let distance = indexDiff <= totalSongs / 2 ? indexDiff : indexDiff - totalSongs;
    
    if (isDragging) {
      const dragAdjustment = dragOffset / 250;
      distance -= dragAdjustment;
    }
    
    // Full opacity for center disc, gradually decreasing for discs further away
    // Discs further than 3 positions away become very transparent
    return Math.max(0.2, 1 - Math.pow(Math.abs(distance), 1.2) * 0.3);
  };

  // Z-index calculation - center disc is on top, discs behind have lower z-index
  const getDiscZIndex = (index: number) => {
    const totalSongs = songs.length;
    const indexDiff = ((index - activeDiscIndex) % totalSongs + totalSongs) % totalSongs;
    let distance = indexDiff <= totalSongs / 2 ? indexDiff : indexDiff - totalSongs;
    
    // Discs closer to center have higher z-index
    return 100 - Math.abs(distance) * 15;
  };

  // Blur effect - discs further from center get more blurry
  const getDiscBlur = (index: number) => {
    const totalSongs = songs.length;
    const indexDiff = ((index - activeDiscIndex) % totalSongs + totalSongs) % totalSongs;
    let distance = indexDiff <= totalSongs / 2 ? indexDiff : indexDiff - totalSongs;
    
    // Apply minimal blur for subtle depth effect
    return Math.pow(Math.abs(distance), 1.2) * 0.8;
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

  // Handle mouse movement during drag - wrapper for document mouse move that works with React events
  const handleDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    
    // Call the document-level handler with the native event
    handleDocumentMouseMove(e.nativeEvent);
  };

  // Define touch event handlers with proper types
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    handleDragStart({
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => e.preventDefault(),
      stopPropagation: () => e.stopPropagation(),
      button: 0
    } as unknown as React.MouseEvent<HTMLDivElement>);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging) {
      const touch = e.touches[0];
      handleDragMove({
        clientX: touch.clientX,
        clientY: touch.clientY,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation()
      } as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    handleDragEnd({
      clientX: e.changedTouches[0].clientX,
      clientY: e.changedTouches[0].clientY,
      preventDefault: () => e.preventDefault(),
      stopPropagation: () => e.stopPropagation(),
      button: 0
    } as unknown as React.MouseEvent<HTMLDivElement>);
  };

  // Render mobile or desktop version based on screen size
  if (isMobile) {
    return <MobileMusicPlayer />;
  }

  return (
    <div className="relative w-full flex flex-col items-center justify-center music-player-container">
      {/* Fixed width container to preserve aspect ratio - make it wider */}
      <div className="w-[300px] mx-auto">
      <div 
          className="relative w-full aspect-square"
        style={{
          perspective: '1000px',
        }}
      >
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
              
              // Calculate position based on screen size
              const position = getDiscPosition(discIndex, isMobile);
              const scale = getDiscScale(discIndex, isMobile);
              
              return (
                <div
                  key={`disc-${discIndex}-${idx}`}
                  style={{
                    position: 'absolute',
                    transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px) scale(${scale})`,
                    width: '180px',
                    height: '180px',
                    zIndex: isActive ? 10 : 0,
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.3s ease',
                  }}
                  onClick={() => handleDiscClick(normalizedIndex)}
                >
                  {/* Vinyl disc with image filling entire area */}
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
                    {/* Album cover image filling the entire disc */}
                    <div
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        zIndex: 1,
                      }}
                    >
                    <Image
                        src={song.coverImage}
                        alt={song.title}
                      fill
                      sizes="100vw"
                      style={{
                          objectFit: 'cover',
                          objectPosition: 'center',
                          width: '100%',
                          height: '100%',
                          transform: 'scale(1.1)', // Slightly scale up to ensure full coverage
                          position: 'absolute',
                          top: 0,
                          left: 0,
                        }}
                        priority
                      />
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

      {/* Player controls */}
      <div className="mt-6 md:mt-8 w-full max-w-md px-4">
        {/* ... existing controls code ... */}
              </div>
    </div>
  );
} 