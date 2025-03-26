"use client"

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  youtubeUrl: string;
  youtubeId: string;
}

const tracks: MusicTrack[] = [
  {
    id: '1',
    title: 'Jazz Performance',
    artist: 'Live at B-Flat Jazz Club Berlin',
    youtubeId: 'hFdMHvB6-Jk',
    thumbnail: `https://i3.ytimg.com/vi/hFdMHvB6-Jk/hqdefault.jpg`,
    youtubeUrl: 'https://www.youtube.com/watch?v=hFdMHvB6-Jk'
  },
  {
    id: '2',
    title: 'Vocal Workshop',
    artist: 'Complete Vocal Technique Demonstration',
    youtubeId: 'ZvWZr6TNh9Y',
    thumbnail: `https://i3.ytimg.com/vi/ZvWZr6TNh9Y/hqdefault.jpg`,
    youtubeUrl: 'https://www.youtube.com/watch?v=ZvWZr6TNh9Y'
  },
  {
    id: '3',
    title: 'Jazz Standards',
    artist: 'Live Performance Highlights',
    youtubeId: 'r58-5DBfMpY',
    thumbnail: `https://i3.ytimg.com/vi/r58-5DBfMpY/hqdefault.jpg`,
    youtubeUrl: 'https://www.youtube.com/watch?v=r58-5DBfMpY'
  },
  {
    id: '4',
    title: 'Vocal Jazz',
    artist: 'Studio Session',
    youtubeId: '0zARqh3xwnw',
    thumbnail: `https://i3.ytimg.com/vi/0zARqh3xwnw/hqdefault.jpg`,
    youtubeUrl: 'https://www.youtube.com/watch?v=0zARqh3xwnw'
  },
  {
    id: '5',
    title: 'Jazz Ensemble',
    artist: 'Live at Jazz Club',
    youtubeId: 'AWsarzdZ1u8',
    thumbnail: `https://i3.ytimg.com/vi/AWsarzdZ1u8/hqdefault.jpg`,
    youtubeUrl: 'https://www.youtube.com/watch?v=AWsarzdZ1u8'
  },
  {
    id: '6',
    title: 'Vocal Performance',
    artist: 'Special Concert',
    youtubeId: 'GidIMbCmtyk',
    thumbnail: `https://i3.ytimg.com/vi/GidIMbCmtyk/hqdefault.jpg`,
    youtubeUrl: 'https://www.youtube.com/watch?v=GidIMbCmtyk'
  },
  {
    id: '7',
    title: 'Jazz Collaboration',
    artist: 'Featured Performance',
    youtubeId: 'QgZKO_f5FlM',
    thumbnail: `https://i3.ytimg.com/vi/QgZKO_f5FlM/hqdefault.jpg`,
    youtubeUrl: 'https://www.youtube.com/watch?v=QgZKO_f5FlM'
  }
];

export default function MusicSection() {
  const { t } = useTranslation();
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTrackSelect = (track: MusicTrack) => {
    if (currentTrack.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrack(tracks[previousIndex]);
    setIsPlaying(true);
  };

  return (
    <section className="w-full bg-black py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-4xl font-playfair text-center text-gold mb-12">
          {t('music.title')}
        </h2>
        
        {/* Main Player */}
        <div className="bg-zinc-900/80 backdrop-blur-lg rounded-xl p-6 mb-12 shadow-2xl max-w-5xl mx-auto hover:bg-zinc-900/90 transition-all duration-300">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&rel=0`}
              title={currentTrack.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            />
          </div>
          
          {/* Player Controls */}
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">{currentTrack.title}</h3>
                <p className="text-gold text-lg">{currentTrack.artist}</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePrevious}
                  className="p-3 rounded-full hover:bg-zinc-800 transition-colors text-white"
                  aria-label="Previous track"
                >
                  <SkipBack className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 rounded-full bg-gold hover:bg-[#B69A6E] transition-colors"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-black" />
                  ) : (
                    <Play className="w-6 h-6 text-black" />
                  )}
                </button>
                <button 
                  onClick={handleNext}
                  className="p-3 rounded-full hover:bg-zinc-800 transition-colors text-white"
                  aria-label="Next track"
                >
                  <SkipForward className="w-6 h-6" />
                </button>
                <button 
                  className="p-3 rounded-full hover:bg-zinc-800 transition-colors text-white"
                  aria-label="Volume"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => handleTrackSelect(track)}
              className={`group bg-zinc-900/80 backdrop-blur-lg rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-zinc-900/90 ${
                currentTrack.id === track.id ? 'ring-2 ring-gold scale-[1.02] shadow-lg' : ''
              }`}
            >
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={track.thumbnail}
                  alt={track.title}
                  width={480}
                  height={360}
                  className="rounded-t-lg object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                  currentTrack.id === track.id 
                    ? 'bg-black/40 backdrop-blur-sm' 
                    : 'bg-black/0 group-hover:bg-black/30'
                }`}>
                  {currentTrack.id === track.id && (
                    <span className="text-white text-lg font-medium px-4 py-2 rounded-full bg-gold/90 shadow-lg transform -translate-y-2">
                      {isPlaying ? 'Now Playing' : 'Paused'}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-white font-medium text-lg truncate mb-1">{track.title}</h4>
                <p className="text-gold text-sm truncate">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 