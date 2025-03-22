/**
 * Utility functions for handling asset paths in both development and production environments
 */

/**
 * Returns the correct path for an asset based on the current environment
 * In production, prepends "/vocal-coaching" to the path
 * In development, uses the path as is
 * 
 * @param path The asset path (should start with a slash)
 * @returns The complete path adjusted for the current environment
 */
export function getAssetPath(path: string): string {
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // In production, prepend "/vocal-coaching" to the path
  const basePath = process.env.NODE_ENV === 'production' 
    ? "/vocal-coaching" 
    : "";
    
  return `${basePath}${normalizedPath}`;
}

/**
 * Returns the correct audio path for the current environment
 * 
 * @param filename The audio filename without extension
 * @returns The complete audio path adjusted for the current environment
 */
export function getAudioPath(filename: string): string {
  return getAssetPath(`/audio/${filename}`);
}

/**
 * Returns the correct image path for the current environment
 * 
 * @param category The image category folder (e.g., 'backgrounds', 'services')
 * @param filename The image filename with extension
 * @returns The complete image path adjusted for the current environment
 */
export function getImagePath(category: string, filename: string): string {
  return getAssetPath(`/images/${category}/${filename}`);
}

/**
 * Checks if the current environment is production
 * 
 * @returns true if the current environment is production, false otherwise
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
} 