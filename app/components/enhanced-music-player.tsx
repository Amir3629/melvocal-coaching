"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, Pause, Music } from "lucide-react";
import { getAudioPath } from "@/app/utils/audio-path";
import { getImagePath } from "@/app/utils/image-path";
import { useMedia } from "./media-context";

// Add event system for media coordination
const MEDIA_STOP_EVENT = 'stopAllMedia';

export default function EnhancedMusicPlayer() {
  const { currentlyPlaying, setCurrentlyPlaying, stopAllMedia } = useMedia();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const track = {
    title: "Blues for John",
    artist: "Melvo Jazz",
    file: "/audio/AUDIO-2025-03-19-16-15-29",
    youtubeId: "hFdMHvB6-Jk",
    image: "/photo_8_2025-02-27_12-05-55.jpg"
  };

  // Check for mobile device on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial render
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Get YouTube thumbnail URL - use higher quality image
  const getYouTubeThumbnail = (youtubeId: string) => {
    // Use the highest quality thumbnail available
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

  // Listen for stop events from other media players
  useEffect(() => {
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

  // Update playing state when currentlyPlaying changes
  useEffect(() => {
    if (currentlyPlaying === 'video' && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [currentlyPlaying, isPlaying]);

  // Update audio src
  useEffect(() => {
    if (audioRef.current) {
      // Use our audio path utility
      const audioSrc = getAudioPath('/audio/AUDIO-2025-03-19-16-15-29');
      audioRef.current.src = audioSrc;
      console.log("Audio source set to:", audioSrc);
      
      // Set volume to make sure it's audible
      audioRef.current.volume = 1.0;
      
      // Preload the audio
      audioRef.current.load();
      
      // Add audio event listeners
      audioRef.current.addEventListener('canplaythrough', () => {
        console.log("Audio can play through, ready to play");
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error("Audio loading error:", e);
      });
    }
  }, []);

  // Handle scroll to show/hide mini player
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !isPlaying) return;
      
      // Get section position
      const rect = sectionRef.current.getBoundingClientRect();
      
      // Show mini player if section is out of view and music is playing
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        setShowMiniPlayer(true);
      } else {
        setShowMiniPlayer(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isPlaying]);

  // Handle play/pause with better error handling
  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setShowMiniPlayer(false);
      setCurrentlyPlaying(null);
      if (audioRef.current) {
        audioRef.current.pause();
        console.log("Audio paused");
      }
    } else {
      // First stop any other media that might be playing
      if (currentlyPlaying === 'video') {
        stopAllMedia();
      }
      
      setIsPlaying(true);
      setIsLoading(true);
      setCurrentlyPlaying('music');
      
      if (audioRef.current) {
        try {
          console.log("Attempting to play audio:", audioRef.current.src);
          
          // Make sure volume is set
          audioRef.current.volume = 1.0;
          audioRef.current.currentTime = 0; // Start from beginning if it ended
          
          // Use the play() method directly
          const playPromise = audioRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log("Audio playing successfully");
                setIsLoading(false);
              })
              .catch(err => {
                console.error("Failed to play audio:", err);
                setError("Failed to play audio. Please try again.");
                setIsPlaying(false);
                setIsLoading(false);
                setCurrentlyPlaying(null);
              });
          }
        } catch (err) {
          console.error("Exception while playing audio:", err);
          setError("Failed to play audio. Please try again.");
          setIsPlaying(false);
          setIsLoading(false);
          setCurrentlyPlaying(null);
        }
      }
    }
  };

  // Handle audio ended
  const handleEnded = () => {
    setIsPlaying(false);
    setShowMiniPlayer(false);
    setCurrentlyPlaying(null);
  };

  // Handle audio error
  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio error:", e);
    setError("Failed to play audio. Please try again.");
    setIsPlaying(false);
    setIsLoading(false);
    setShowMiniPlayer(false);
    setCurrentlyPlaying(null);
  };

  // Scroll to music section when mini player is clicked
  const scrollToMusicSection = () => {
    // Removed auto-scrolling behavior
    console.log("Mini player clicked");
  };

  // Render different player for mobile vs desktop
  return (
    <section ref={sectionRef} id="music" className="py-16 md:py-24 bg-black relative overflow-hidden w-full">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">Meine Musik</h2>
          <div className="w-24 h-0.5 bg-[#C8A97E] mx-auto mt-4 mb-12"></div>
          
          {/* Music player */}
          <div className="w-full flex flex-col items-center justify-center">
            {/* Audio element */}
            <audio
              ref={audioRef}
              src={getAudioPath(track.file)}
              preload="auto"
              onEnded={handleEnded}
              onError={handleError}
              className="hidden"
            />
            
            {/* Main Vinyl Player */}
            <div className="w-full flex justify-center">
              {/* Different sized containers for mobile vs desktop */}
              <div className={isMobile ? "w-[280px] h-[280px]" : "w-[320px] h-[320px]"}>
                <div 
                  className="relative w-full h-full"
            onClick={handlePlay}
          >
                  {/* Vinyl Disc and Album Art */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black rounded-full overflow-hidden"
                    style={{
                      animation: isPlaying ? 'spin 20s linear infinite' : 'none',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    {/* Mobile vs Desktop disc styling */}
                    {isMobile ? (
                      // Mobile-optimized disc with constrained album art
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        {/* Black Vinyl Background */}
                        <div className="absolute inset-0 bg-black z-0"></div>
                        
                        {/* Album Cover Image - specifically optimized for mobile */}
                        <div className="absolute inset-0 rounded-full overflow-hidden" style={{ contain: 'strict' }}>
                          <div className="relative w-full h-full">
                            <Image 
                              src={getImagePath(track.image)}
                              alt={track.title}
                              fill
                              sizes="280px"
                              style={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                                transform: 'scale(1.05)', /* Slightly scale up to ensure no white gaps */
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%'
                              }}
                              className="rounded-full"
                              priority
                            />
                          </div>
                        </div>
                        
                        {/* Center Hole */}
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
                        
                        {/* Vinyl Grooves */}
                        <div className="absolute inset-0 z-5 pointer-events-none">
                          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      // Desktop-sized disc rendering (original implementation)
                      <>
                        {/* Black Vinyl Background */}
                        <div className="absolute inset-0 bg-black z-0"></div>
                        
                        {/* Album Cover Image */}
                        <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden rounded-full">
                          <Image
                            src={getImagePath(track.image)}
                            alt={track.title}
                            fill
                            style={{
                              objectFit: 'cover',
                              objectPosition: 'center',
                              transform: 'scale(1.05)', /* Slightly scale up to ensure no white gaps */
                              borderRadius: '50%',
                              mixBlendMode: 'normal'
                            }}
                            priority
                          />
                        </div>
                        
                        {/* Center Hole */}
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
                        
                        {/* Vinyl Grooves */}
                        <div className="absolute inset-0 z-5 pointer-events-none">
                          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                          </svg>
                        </div>
                      </>
                    )}
                    
                    {/* Play Button Overlay */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center z-20"
                      style={{
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        opacity: isPlaying ? 0 : 1,
                        transition: 'opacity 0.3s ease'
                      }}
                    >
                      <div className="bg-black bg-opacity-60 p-4 rounded-full">
                        {isPlaying ? (
                          <Pause className="w-10 h-10 text-white" />
                        ) : (
                          <Play className="w-10 h-10 text-white ml-1" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Track Info */}
            <div className="mt-8 text-white">
              <h3 className="text-2xl font-bold">{track.title}</h3>
              <p className="text-lg opacity-80">{track.artist}</p>
            </div>
        </div>
        </div>
      </div>
      
      {/* Mini player for scrolled state */}
      <AnimatePresence>
        {showMiniPlayer && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-50 bg-black bg-opacity-80 backdrop-blur-md p-4 rounded-lg shadow-lg flex items-center"
          >
            <div 
              className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0"
              style={{
                animation: isPlaying ? 'spin 8s linear infinite' : 'none',
              }}
            >
              <Image
                src={getImagePath(track.image)}
                alt={track.title}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="mr-4">
              <p className="text-white text-sm font-medium">{track.title}</p>
              <p className="text-gray-300 text-xs">{track.artist}</p>
            </div>
            <button 
              onClick={handlePlay}
              className="w-8 h-8 flex items-center justify-center bg-white bg-opacity-20 rounded-full"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white ml-0.5" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 