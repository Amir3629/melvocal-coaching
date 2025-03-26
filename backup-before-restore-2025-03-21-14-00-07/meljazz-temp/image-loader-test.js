module.exports = function testImageLoader({ src }) {
  // Always use absolute URLs in production
  if (process.env.NODE_ENV === 'production') {
    // If it's already an absolute URL, return as is
    if (src.startsWith('http')) {
      return src;
    }
    
    // Remove any leading slash
    const cleanPath = src.startsWith('/') ? src.slice(1) : src;
    return `https://amir3629.github.io/vocal-coaching-website/${cleanPath}`;
  }
  
  // In development, just return the path as is
  return src;
} 