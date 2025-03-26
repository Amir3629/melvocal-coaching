"use client"

export function getImagePath(imagePath) {
  // Check if we're running in the browser
  const isBrowser = typeof window !== 'undefined';
  
  // Determine environment
  const isDevelopment = isBrowser && window.location.hostname === 'localhost';
  const isProduction = !isDevelopment;
  
  // If the image path already starts with http or https, return it as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Handle production paths
  if (isProduction) {
    // If path already has the /vocal-coaching prefix, return as is
    if (imagePath.startsWith('/vocal-coaching/')) {
      return imagePath;
    }
    
    // Add the prefix for production environment
    return `/vocal-coaching${imagePath}`;
  }
  
  // Handle development paths
  else {
    // Remove the /vocal-coaching prefix if it exists in development
    if (imagePath.startsWith('/vocal-coaching/')) {
      return imagePath.replace('/vocal-coaching', '');
    }
    
    // Return as is for development
    return imagePath;
  }
} 