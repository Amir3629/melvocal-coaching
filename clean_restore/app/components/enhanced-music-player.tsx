"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Play, Pause, Music } from "lucide-react";
import { getAudioPath } from "@/app/utils/paths";

// Add event system for media coordination
const MEDIA_STOP_EVENT = 'stopAllMedia';

export default function EnhancedMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const track = {
    title: "Blues for John",
    artist: "Melvo Jazz",
    file: "/audio/AUDIO-2025-03-19-16-15-29",
    youtubeId: "hFdMHvB6-Jk",
    image: "/photo_8_2025-02-27_12-05-55.jpg"
  };

  // Get YouTube thumbnail URL - use higher quality image
  const getYouTubeThumbnail = (youtubeId: string) => {
    // Use the highest quality thumbnail available
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
  };

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

  // Update audio src
  useEffect(() => {
    if (audioRef.current) {
      // Use direct path to the audio file
      audioRef.current.src = `/audio/AUDIO-2025-03-19-16-15-29.mp3`;
      console.log("Audio source set to:", `/audio/AUDIO-2025-03-19-16-15-29.mp3`);
      
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
      if (audioRef.current) {
        audioRef.current.pause();
        console.log("Audio paused");
      }
    } else {
      // Dispatch event to stop other media
      window.dispatchEvent(new Event(MEDIA_STOP_EVENT));
      setIsPlaying(true);
      setIsLoading(true);
      
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
              });
          }
        } catch (err) {
          console.error("Exception while playing audio:", err);
          setError("Failed to play audio. Please try again.");
          setIsPlaying(false);
          setIsLoading(false);
        }
      }
    }
  };

  // Handle audio ended
  const handleEnded = () => {
    setIsPlaying(false);
    setShowMiniPlayer(false);
  };

  // Handle audio error
  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio error:", e);
    setError("Failed to play audio. Please try again.");
    setIsPlaying(false);
    setIsLoading(false);
    setShowMiniPlayer(false);
  };

  // Scroll to music section when mini player is clicked
  const scrollToMusicSection = () => {
    // Removed auto-scrolling behavior
    console.log("Mini player clicked");
  };

  return (
    <div className="relative w-full py-24 overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-0"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white mb-6">Meine Musik</h2>
        <div className="w-16 h-1 bg-[#C8A97E] mb-12"></div>
        
        {/* Single Disc Container */}
        <div className="relative w-full h-96 mx-auto mb-4">
          {/* Main Vinyl Disc */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30"
            transition={{ duration: 0.3 }}
            style={{ boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)' }}
            onClick={handlePlay}
          >
            {/* Main disc */}
            <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl">
              {/* Disc image background - spinning only when playing */}
              <motion.div 
                className="absolute inset-0 rounded-full overflow-hidden"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ 
                  duration: 40, 
                  ease: "linear", 
                  repeat: isPlaying ? Infinity : 0,
                  repeatType: "loop" 
                }}
              >
                <Image 
                  src={track.image}
                  alt={track.title}
                  fill
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                  className="opacity-100"
                  priority
                  unoptimized
                />
              </motion.div>
              
              {/* Inner disc with grooves - spinning only when playing */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-black/30 backdrop-blur-none"
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ 
                  duration: 40, 
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
                    className="w-24 h-24 rounded-full bg-black flex items-center justify-center hover:bg-black/70 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlay}
                    transition={{ duration: 0.5 }}
                  >
                    {isLoading ? (
                      <div className="w-8 h-8 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin"></div>
                    ) : isPlaying ? (
                      <Pause className="w-8 h-8 text-[#C8A97E]" />
                    ) : (
                      <Play className="w-9 h-9 text-[#C8A97E] ml-1" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Track title and artist */}
        <div className="text-center mt-8 mb-4">
          <h3 className="text-xl font-medium text-white mb-1">{track.title}</h3>
          <p className="text-sm text-[#C8A97E]">{track.artist}</p>
        </div>
      </div>
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onError={handleError}
        preload="auto"
        className="hidden"
        src="/audio/AUDIO-2025-03-19-16-15-29.mp3"
      />
      
      {/* Show any error messages */}
      {error && (
        <div className="text-red-500 mt-4 text-center">
          {error}
        </div>
      )}

      {/* Floating Mini Player */}
      <AnimatePresence>
        {showMiniPlayer && isPlaying && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-black/80 backdrop-blur-lg rounded-full p-2 pl-4 pr-3 shadow-2xl border border-[#C8A97E]/20"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <div className="flex items-center space-x-3 cursor-pointer">
              <Music className="w-5 h-5 text-[#C8A97E]" />
              <div className="text-white text-sm">{track.title}</div>
            </div>
            <motion.button
              className="w-8 h-8 rounded-full bg-[#C8A97E]/10 hover:bg-[#C8A97E]/20 flex items-center justify-center transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
            >
              <Pause className="w-4 h-4 text-[#C8A97E]" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 