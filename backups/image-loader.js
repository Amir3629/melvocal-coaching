module.exports = function imageLoader({ src, width, quality }) {
  // Handle absolute URLs
  if (src.startsWith('http')) {
    return src
  }

  // Handle data URLs
  if (src.startsWith('data:')) {
    return src
  }

  // Handle relative paths in production
  const basePath = process.env.NODE_ENV === 'production' ? '/vocal-coaching' : ''
  const path = src.startsWith('/') ? src : `/${src}`
  return `${basePath}${path}`
} 