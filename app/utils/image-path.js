"use client"

export function getImagePath(imagePath) {
  if (!imagePath) return '';
  
  // Development environment detection
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Handle relative paths that start with ./ by removing the dot
  let normalizedPath = imagePath.startsWith('./') ? imagePath.substring(1) : imagePath;
  
  // Fix missing slash if needed
  normalizedPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  
  // For development, try both paths
  if (isDevelopment) {
    // Remove /melvocal-coaching prefix if it exists
    if (normalizedPath.startsWith('/melvocal-coaching/')) {
      return normalizedPath.replace('/melvocal-coaching', '');
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
    
    // Handle special case for music-new SVG files
    if (normalizedPath.includes('/music-new/') && normalizedPath.endsWith('.svg')) {
      return normalizedPath;
    }
    
    return normalizedPath;
  }
  
  // For production, add the /melvocal-coaching prefix if needed
  if (!isDevelopment && !normalizedPath.startsWith('/melvocal-coaching/') && normalizedPath.startsWith('/')) {
    return `/melvocal-coaching${normalizedPath}`;
  }
  
  return normalizedPath;
} 

export function debugImagePath(imagePath) {
  const result = getImagePath(imagePath);
  console.log(`Image path: ${imagePath} => ${result}`);
  return result;
} 
