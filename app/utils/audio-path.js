"use client"

export function getAudioPath(audioPath) {
  if (!audioPath) return '';
  
  // Development environment detection
  const isDevelopment = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  
  // Handle relative paths that start with ./ by removing the dot
  let normalizedPath = audioPath.startsWith('./') ? audioPath.substring(1) : audioPath;
  
  // Fix missing slash if needed
  normalizedPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  
  // Ensure it has the correct file extension
  if (!normalizedPath.endsWith('.mp3') && !normalizedPath.endsWith('.ogg') && !normalizedPath.endsWith('.wav')) {
    normalizedPath = `${normalizedPath}.mp3`;
  }
  
  // For development, adjust paths
  if (isDevelopment) {
    // Remove /melvocal-coaching prefix if it exists
    if (normalizedPath.startsWith('/melvocal-coaching/')) {
      return normalizedPath.replace('/melvocal-coaching', '');
    }
    
    return normalizedPath;
  }
  
  // For production, add the /melvocal-coaching prefix if needed
  if (!isDevelopment && !normalizedPath.startsWith('/melvocal-coaching/') && normalizedPath.startsWith('/')) {
    return `/melvocal-coaching${normalizedPath}`;
  }
  
  return normalizedPath;
}

export function debugAudioPath(audioPath) {
  const result = getAudioPath(audioPath);
  console.log(`Audio path: ${audioPath} => ${result}`);
  return result;
} 