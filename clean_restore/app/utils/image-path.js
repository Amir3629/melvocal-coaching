"use client"

export function getImagePath(imagePath) {
  if (!imagePath) return '';
  
  // Development environment detection
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Fix missing slash if needed
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // For development, try both paths
  if (isDevelopment) {
    // Remove /vocal-coaching prefix if it exists
    if (normalizedPath.startsWith('/vocal-coaching/')) {
      return normalizedPath.replace('/vocal-coaching', '');
    }
    
    // If it's a path that typically needs placeholders, modify to use available images
    if (normalizedPath.includes('/gallery/') || 
        normalizedPath.includes('/backgrounds/') || 
        normalizedPath.includes('/services/')) {
      
      // Direct the path to where we created the placeholders
      if (normalizedPath.endsWith('.jpg') || normalizedPath.endsWith('.png') || normalizedPath.endsWith('.webp')) {
        return normalizedPath;
      }
    }
    
    // Handle special case for music cursor
    if (normalizedPath.includes('music-cursor.png')) {
      return '/images/music-cursor.png';
    }
    
    return normalizedPath;
  }
  
  // For production, add the /vocal-coaching prefix if needed
  if (!isDevelopment && !normalizedPath.startsWith('/vocal-coaching/') && normalizedPath.startsWith('/')) {
    return `/vocal-coaching${normalizedPath}`;
  }
  
  return normalizedPath;
} 