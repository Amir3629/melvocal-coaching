export function getImagePath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // Add the production prefix if in production
  return process.env.NODE_ENV === 'production'
    ? `/vocal-coaching/${cleanPath}`
    : `/${cleanPath}`
}

// Debug function to log image path resolution
export function debugImagePath(originalPath: string): void {
  console.log({
    original: originalPath,
    processed: getImagePath(originalPath),
    environment: process.env.NODE_ENV,
  })
} 