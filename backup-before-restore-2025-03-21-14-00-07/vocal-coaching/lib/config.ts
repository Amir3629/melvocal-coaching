export const getImageUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In development, use relative paths
  if (process.env.NODE_ENV === 'development') {
    return `/${cleanPath}`;
  }
  
  // For production, use the full GitHub Pages URL
  return `https://amir3629.github.io/vocal-coaching-website/${cleanPath}`;
}; 