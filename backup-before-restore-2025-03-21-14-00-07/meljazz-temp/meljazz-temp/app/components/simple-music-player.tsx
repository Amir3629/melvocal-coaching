"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from "lucide-react";
import { getAudioPath } from "@/app/utils/paths";

interface Track {
  id: number;
  title: string;
  artist: string;
  file: string;
  duration: number; // in seconds
}

const defaultTracks: Track[] = [
  {
    id: 1,
    title: "Jazz Improvisation",
    artist: "Mel Jazz",
    file: "/audio/music-sample-1",
    duration: 180
  },
  {
    id: 2,
    title: "Soul Expressions",
    artist: "Mel Jazz",
    file: "/audio/music-sample-2",
    duration: 210
  },
  {
    id: 3,
    title: "Vocal Techniques",
    artist: "Mel Jazz",
    file: "/audio/music-sample-3",
    duration: 195
  }
];

export default function SimpleMusicPlayer() {
  const [tracks] = useState<Track[]>(defaultTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  
  const progressBarRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentTrack = tracks[currentTrackIndex];
  
  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error("Failed to play audio:", err);
        });
      }
    }
  };
  
  // Handle track change
  const changeTrack = (direction: 'next' | 'prev') => {
    setCurrentTime(0);
    
    if (direction === 'next') {
      setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
    } else {
      setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
    }
  };
  
  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    
    if (audioRef.current) {
      const newTime = percent * currentTrack.duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
  };
  
  // Update current time
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);
  
  // Handle audio ended
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    changeTrack('next');
  };
  
  // Update audio src when track changes
  useEffect(() => {
    if (audioRef.current) {
      const audioPath = getAudioPath(currentTrack.file);
      audioRef.current.src = `${audioPath}.mp3`;
      
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Failed to play audio:", err);
        });
      }
    }
  }, [currentTrackIndex, currentTrack.file]);
  
  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <div className="w-16 h-16 bg-[#C8A97E] rounded-full flex items-center justify-center mr-4">
          <Music className="w-8 h-8 text-black" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{currentTrack.title}</h3>
          <p className="text-sm text-gray-400">{currentTrack.artist}</p>
        </div>
      </div>
      
      <div 
        className="h-2 bg-gray-700 rounded-full mb-2 cursor-pointer"
        ref={progressBarRef}
        onClick={handleProgressBarClick}
      >
        <div 
          className="h-full bg-[#C8A97E] rounded-full"
          style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-400 mb-6">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(currentTrack.duration)}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <button 
          className="text-white hover:text-[#C8A97E] transition-colors"
          onClick={() => changeTrack('prev')}
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          className="w-12 h-12 bg-[#C8A97E] rounded-full flex items-center justify-center text-black hover:bg-[#B89A6F] transition-colors"
          onClick={togglePlayPause}
        >
          {isPlaying ? (
            <Pause size={20} />
          ) : (
            <Play size={20} className="ml-1" />
          )}
        </button>
        
        <button 
          className="text-white hover:text-[#C8A97E] transition-colors"
          onClick={() => changeTrack('next')}
        >
          <SkipForward size={24} />
        </button>
      </div>
      
      <div className="mt-6 flex items-center">
        <button 
          className="text-white hover:text-[#C8A97E] transition-colors mr-2"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        
        <input 
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C8A97E]"
        />
      </div>
      
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        className="hidden"
      />
    </div>
  );
} 