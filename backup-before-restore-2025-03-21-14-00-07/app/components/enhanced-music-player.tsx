"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { getAudioPath } from "@/app/utils/paths";

interface Track {
  id: number;
  title: string;
  artist: string;
  file: string;
  duration: number;
  image: string;
  youtubeId: string;
}

const defaultTracks: Track[] = [
  {
    id: 1,
    title: "Jazz Piano Improvisation",
    artist: "Melvo Jazz",
    file: "/audio/music-sample-1",
    duration: 180,
    image: "/images/music/jazz-piano.jpg",
    youtubeId: "hFdMHvB6-Jk"
  },
  {
    id: 2,
    title: "Soul Expressions",
    artist: "Melvo Jazz",
    file: "/audio/music-sample-2",
    duration: 210,
    image: "/images/music/soul-expressions.jpg",
    youtubeId: "ZvWZr6TNh9Y"
  },
  {
    id: 3,
    title: "Vocal Techniques",
    artist: "Melvo Jazz",
    file: "/audio/music-sample-3",
    duration: 195,
    image: "/images/music/vocal-techniques.jpg",
    youtubeId: "r58-5DBfMpY"
  },
  {
    id: 4,
    title: "Jazz Ensemble",
    artist: "Melvo Jazz",
    file: "/audio/music-sample-1",
    duration: 180,
    image: "/images/music/jazz-piano.jpg",
    youtubeId: "0zARqh3xwnw"
  },
  {
    id: 5,
    title: "Piano Composition",
    artist: "Melvo Jazz",
    file: "/audio/music-sample-2",
    duration: 210,
    image: "/images/music/soul-expressions.jpg",
    youtubeId: "AWsarzdZ1u8"
  },
  {
    id: 6,
    title: "Vocal Performance",
    artist: "Melvo Jazz",
    file: "/audio/music-sample-3",
    duration: 195,
    image: "/images/music/vocal-techniques.jpg",
    youtubeId: "GidIMbCmtyk"
  },
  {
    id: 7,
    title: "Jazz Improvisation",
    artist: "Melvo Jazz",
    file: "/audio/music-sample-1",
    duration: 180,
    image: "/images/music/jazz-piano.jpg",
    youtubeId: "QgZKO_f5FlM"
  }
];

// Add event system for media coordination
const MEDIA_STOP_EVENT = 'stopAllMedia';

export default function EnhancedMusicPlayer() {
  const [tracks] = useState<Track[]>(defaultTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [visibleDiscs, setVisibleDiscs] = useState<number[]>([]);
  const [discPositions, setDiscPositions] = useState<{[key: number]: number}>({});
  const [showBackDiscs, setShowBackDiscs] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  
  const currentTrack = tracks[currentTrackIndex];

  // Get YouTube thumbnail URL - use higher quality image
  const getYouTubeThumbnail = (youtubeId: string) => {
    // Use the highest quality thumbnail available
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  // Get track at index with circular wrapping
  const getTrackAtIndex = (index: number) => {
    // Ensure positive index with modulo
    const wrappedIndex = ((index % tracks.length) + tracks.length) % tracks.length;
    return tracks[wrappedIndex];
  };

  // Initialize visible discs
  useEffect(() => {
    // Always prepare all discs for better performance and visibility
    const indices = [];
    for (let i = 0; i < tracks.length; i++) {
      indices.push(i);
    }
    setVisibleDiscs(indices);
    
    // Initialize positions with much less spacing for significant overlapping effect
    const positions: {[key: number]: number} = {};
    indices.forEach(index => {
      // Calculate position based on distance from current track
      const distance = index - currentTrackIndex;
      // Use modulo to handle circular wrapping properly
      const wrappedDistance = ((distance + tracks.length / 2) % tracks.length) - tracks.length / 2;
      // Reduce spacing between discs (100px instead of 180px) for significant overlapping
      positions[index] = wrappedDistance * 100;
    });
    setDiscPositions(positions);
  }, [currentTrackIndex, tracks.length]);

  useEffect(() => {
    // Listen for stop events from other media players
    const handleMediaStop = () => {
      if (isPlaying) {
        setIsPlaying(false);
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    };

    window.addEventListener(MEDIA_STOP_EVENT, handleMediaStop);
    return () => window.removeEventListener(MEDIA_STOP_EVENT, handleMediaStop);
  }, [isPlaying]);

  // Handle play/pause
  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      // Dispatch event to stop other media
      window.dispatchEvent(new Event(MEDIA_STOP_EVENT));
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error("Failed to play audio:", err);
          setError("Failed to play audio. Please try again.");
        });
      }
    }
  };

  // Handle audio ended
  const handleEnded = () => {
    setIsPlaying(false);
    // Auto play next track
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
  };

  // Handle audio error
  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio error:", e);
    setError("Failed to play audio. Please try again.");
    setIsPlaying(false);
    setIsLoading(false);
  };

  // Update audio src when track changes
  useEffect(() => {
    if (audioRef.current) {
      const audioPath = getAudioPath(currentTrack.file);
      audioRef.current.src = `${audioPath}.mp3`;
      
      if (isPlaying) {
        setIsLoading(true);
        audioRef.current.play()
          .then(() => {
            setIsLoading(false);
          })
          .catch(err => {
            console.error("Failed to play audio:", err);
            setIsLoading(false);
            setError("Failed to play audio. Please try again.");
          });
      }
    }
  }, [currentTrackIndex, currentTrack.file]);

  // Show background discs
  const handleDiscClick = (e: React.MouseEvent) => {
    // Only trigger if clicking outside the center button
    const rect = discRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      // If clicking outside the center button area, toggle background discs
      if (distance > 60) {
        // Toggle background discs
        setShowBackDiscs(!showBackDiscs);
        
        // Reset positions when showing discs
        const positions: {[key: number]: number} = {};
        visibleDiscs.forEach(index => {
          const distance = index - currentTrackIndex;
          const wrappedDistance = ((distance + tracks.length / 2) % tracks.length) - tracks.length / 2;
          positions[index] = wrappedDistance * 100;
        });
        setDiscPositions(positions);
      }
    }
  };

  const handleDiscMouseDown = (e: React.MouseEvent) => {
    // Only start dragging if not clicking the center button
    const rect = discRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      // If clicking inside the center button area, don't start dragging
      if (distance < 60) {
        return;
      }
    }
    
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragDelta(0);
    
    // Always show background discs when dragging
    setShowBackDiscs(true);
    
    // Reset positions when starting to drag
    const positions: {[key: number]: number} = {};
    visibleDiscs.forEach(index => {
      const distance = index - currentTrackIndex;
      const wrappedDistance = ((distance + tracks.length / 2) % tracks.length) - tracks.length / 2;
      positions[index] = wrappedDistance * 100;
    });
    setDiscPositions(positions);
    
    // Add dragging class to body
    document.body.classList.add('dragging-disc');
  };

  const handleDiscMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const delta = e.clientX - dragStartX;
    setDragDelta(delta);
    
    // Update all disc positions based on drag delta
    const updatedPositions: {[key: number]: number} = {};
    visibleDiscs.forEach(index => {
      // Calculate position based on distance from current track
      const distance = index - currentTrackIndex;
      const wrappedDistance = ((distance + tracks.length / 2) % tracks.length) - tracks.length / 2;
      // Use the same spacing as in the initialization (100px)
      const basePosition = wrappedDistance * 100;
      updatedPositions[index] = basePosition + delta;
    });
    
    setDiscPositions(updatedPositions);
  };

  const handleDiscMouseUp = () => {
    if (!isDragging) return;
    
    // Determine which disc is closest to center
    let closestIndex = currentTrackIndex;
    let smallestDistance = Infinity;
    
    Object.entries(discPositions).forEach(([indexStr, position]) => {
      const index = parseInt(indexStr);
      const distance = Math.abs(position);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });
    
    // Change track if a different disc is closer to center
    if (closestIndex !== currentTrackIndex) {
      setCurrentTrackIndex(closestIndex);
    }
    
    setIsDragging(false);
    setDragDelta(0);
    
    // Remove dragging class from body
    document.body.classList.remove('dragging-disc');
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDiscMouseMove);
      window.addEventListener('mouseup', handleDiscMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleDiscMouseMove);
      window.removeEventListener('mouseup', handleDiscMouseUp);
    };
  }, [isDragging, dragStartX, visibleDiscs, discPositions]);

  // Dismiss error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="relative h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-6">Meine Musik</h2>
        <div className="w-16 h-1 bg-[#C8A97E] mb-12"></div>
        
        {/* Disc Carousel Container - With increased width to prevent cutoff */}
        <div className="relative w-[1000px] h-96 mx-auto mb-4 overflow-visible">
          {/* Background Discs - Always rendered but only visible when showBackDiscs is true */}
          {visibleDiscs.map(index => {
            if (index === currentTrackIndex) return null;
            
            const track = getTrackAtIndex(index);
            const position = discPositions[index] || 0;
            
            // Only show discs that are within a reasonable distance
            if (Math.abs(position) > 600) return null;
            
            // Calculate distance from center for visual effects
            const distance = Math.abs(position);
            
            // Progressive scaling - discs get smaller as they go further back
            // Front disc is 100%, background discs start at 65% and get smaller
            const baseScale = 0.65; // Background discs are 65% of main disc size
            const scaleReduction = Math.min(distance / 500, 0.35); // Up to 35% smaller based on distance
            const scale = baseScale - scaleReduction;
            
            // Progressive blur based on distance
            const blurAmount = Math.min(distance / 80, 5);
            
            // Progressive opacity based on distance
            const opacity = Math.max(0.3, 1 - (distance / 500));
            
            // Calculate z-index based on distance (closer discs appear on top)
            const zIndex = 20 - Math.floor(distance / 30);
            
            return (
              <motion.div
                key={`disc-${index}`}
                className="absolute top-1/2 left-1/2 w-80 h-80 -translate-y-1/2 rounded-full overflow-hidden"
                style={{
                  zIndex: zIndex,
                  opacity: showBackDiscs ? opacity : 0,
                  filter: `blur(${blurAmount}px)`,
                  pointerEvents: showBackDiscs ? 'auto' : 'none'
                }}
                animate={{ 
                  x: `calc(-50% + ${position}px)`,
                  scale: scale
                }}
                transition={{ 
                  duration: 0.5,
                  ease: "easeInOut"
                }}
                onClick={() => {
                  if (!isDragging && showBackDiscs) {
                    setCurrentTrackIndex(index);
                    setShowBackDiscs(false);
                  }
                }}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <Image 
                      src={getYouTubeThumbnail(track.youtubeId)} 
                      alt={track.title}
                      fill
                      style={{ objectFit: 'cover', objectPosition: 'center' }}
                      className="opacity-100"
                      unoptimized
                    />
                  </div>
                  
                  {/* Vinyl grooves */}
                  <div className="absolute inset-0 rounded-full">
                    <div className="absolute inset-[5px] rounded-full border border-[#333]/60"></div>
                    <div className="absolute inset-[15px] rounded-full border border-[#333]/60"></div>
                    <div className="absolute inset-[25px] rounded-full border border-[#333]/60"></div>
                    <div className="absolute inset-[35px] rounded-full border border-[#333]/60"></div>
                  </div>
                  
                  {/* Center label */}
                  <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-black flex items-center justify-center">
                    <p className="text-xs text-[#C8A97E] font-medium text-center px-2">{track.title}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {/* Main Vinyl Disc */}
          <motion.div 
            ref={discRef}
            className="absolute top-1/4 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/4 cursor-grab z-30"
            animate={{ 
              x: isDragging ? `calc(-50% + ${dragDelta}px)` : '-50%',
              scale: isDragging ? 0.95 : 1
            }}
            transition={{ 
              x: { duration: isDragging ? 0 : 0.5, ease: "easeInOut" },
              scale: { duration: 0.3 }
            }}
            onClick={handleDiscClick}
            onMouseDown={handleDiscMouseDown}
            style={{ boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)' }}
          >
            {/* Main disc */}
            <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
              {/* Disc image background - spinning only when playing */}
              <motion.div 
                className="absolute inset-0 rounded-full overflow-hidden"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ 
                  duration: 20, 
                  ease: "linear", 
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: "loop" 
                }}
              >
                <Image 
                  src={getYouTubeThumbnail(currentTrack.youtubeId)} 
                  alt={currentTrack.title}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className="opacity-100"
                  priority
                  unoptimized
                />
              </motion.div>
              
              {/* Inner disc with grooves - spinning only when playing */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-sm"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ 
                  duration: 20, 
                  ease: "linear", 
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: "loop" 
                }}
              >
                {/* Vinyl grooves */}
                <div className="absolute inset-0 rounded-full">
                  <div className="absolute inset-[15px] rounded-full border border-[#444]/70"></div>
                  <div className="absolute inset-[30px] rounded-full border border-[#444]/70"></div>
                  <div className="absolute inset-[45px] rounded-full border border-[#444]/70"></div>
                  <div className="absolute inset-[60px] rounded-full border border-[#444]/70"></div>
                  <div className="absolute inset-[75px] rounded-full border border-[#444]/70"></div>
                  <div className="absolute inset-[90px] rounded-full border border-[#444]/70"></div>
                  <div className="absolute inset-[105px] rounded-full border border-[#444]/70"></div>
                  <div className="absolute inset-[120px] rounded-full border border-[#444]/70"></div>
                </div>
                
                {/* Center button */}
                <div className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-black flex items-center justify-center">
                  <motion.button
                    className="w-24 h-24 rounded-full bg-black flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay();
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isLoading ? (
                      <div className="w-8 h-8 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin"></div>
                    ) : isPlaying ? (
                      <Pause className="w-10 h-10 text-[#C8A97E]" />
                    ) : (
                      <Play className="w-10 h-10 text-[#C8A97E] ml-1" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Hint for disc interaction - only visible when not dragging */}
          {!isDragging && !showBackDiscs && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[#C8A97E]/70 text-xs">
              Click disc to show more music or drag to browse
            </div>
          )}
        </div>
        
        {/* Track title and artist - BELOW THE DISC with more spacing */}
        <div className="text-center mt-32 mb-4">
          <h3 className="text-xl font-medium text-white mb-1">{currentTrack.title}</h3>
          <p className="text-sm text-[#C8A97E]">{currentTrack.artist}</p>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onError={handleError}
        className="hidden"
      />
      
      {/* Add global styles for dragging */}
      <style jsx global>{`
        body.dragging-disc {
          cursor: grabbing;
          user-select: none;
        }
      `}</style>
    </div>
  );
} 