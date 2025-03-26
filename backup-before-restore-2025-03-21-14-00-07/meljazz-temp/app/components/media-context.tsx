"use client"

import React, { createContext, useContext, useState } from 'react'

type MediaType = 'music' | 'video' | null

interface MediaContextType {
  currentlyPlaying: MediaType
  setCurrentlyPlaying: (type: MediaType) => void
  stopAllMedia: () => void
}

const MediaContext = createContext<MediaContextType | undefined>(undefined)

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<MediaType>(null)

  const stopAllMedia = () => {
    setCurrentlyPlaying(null)
    
    // Create a custom event to notify all media players to stop
    const stopEvent = new CustomEvent('stopAllMedia')
    window.dispatchEvent(stopEvent)
  }

  return (
    <MediaContext.Provider value={{ currentlyPlaying, setCurrentlyPlaying, stopAllMedia }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  const context = useContext(MediaContext)
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider')
  }
  return context
} 