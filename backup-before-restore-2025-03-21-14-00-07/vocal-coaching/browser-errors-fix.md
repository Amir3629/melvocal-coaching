# Browser Errors Fix Guide

## 1. "Failed to load resource: net::ERR_BLOCKED_BY_CLIENT"

This error occurs when a browser extension (like an ad-blocker) is blocking resources on your site.

### Solution:

1. **Review resource naming**: 
   - Avoid using names that might trigger ad-blockers (like "ad", "banner", "track", etc.)
   - Rename any files or paths that might be triggering ad-blockers

2. **For audio files**:
   - Rename audio files to avoid triggering blockers (e.g., "track1.mp3" → "music-sample-1.mp3")
   - Host audio files on your own domain rather than third-party services

3. **For users**:
   - Add a message on your site asking users to whitelist your domain in their ad-blockers
   - Example message: "Having trouble with audio playback? Please whitelist this site in your ad-blocker."

## 2. "NotSupportedError: The element has no supported sources"

This error indicates the browser cannot find audio sources it can play.

### Solution:

1. **Update audio elements**:
   ```jsx
   <audio 
     ref={audioRef} 
     onEnded={handleEnded}
     onError={(e) => console.error("Audio error:", e)}
   >
     <source src={`${basePath}/audio/${currentTrack.file}.mp3`} type="audio/mpeg" />
     <source src={`${basePath}/audio/${currentTrack.file}.ogg`} type="audio/ogg" />
     Your browser does not support the audio element.
   </audio>
   ```

2. **Ensure correct file paths**:
   - Double-check that audio files exist at the specified paths
   - For production, make sure paths include "/vocal-coaching/" prefix
   - For development, use relative paths without the prefix

3. **Provide multiple formats**:
   - Include both MP3 and OGG formats for better browser compatibility

## 3. "Failed to load resource: the server responded with a status of 404 ()"

This means a resource (file) couldn't be found at the specified URL.

### Solution:

1. **Check file paths**:
   - Verify all image, audio, and other resource paths
   - For production environment, ensure paths include "/vocal-coaching/" prefix
   - Example:
     ```jsx
     const imagePath = process.env.NODE_ENV === 'production'
       ? "/vocal-coaching/images/about/profile.jpg"
       : "/images/about/profile.jpg"
     ```

2. **Verify file existence**:
   - Check that all referenced files exist in your repository
   - Ensure file names match exactly (case-sensitive)

3. **Fix dynamic paths**:
   - Use a consistent approach for all resource paths:
     ```jsx
     // Add this helper function to a utils file
     export function getAssetPath(path) {
       const basePath = process.env.NODE_ENV === 'production' 
         ? "/vocal-coaching" 
         : "";
       return `${basePath}${path}`;
     }
     
     // Then use it like this:
     import { getAssetPath } from "@/app/utils/paths";
     
     // In your component
     <Image src={getAssetPath("/images/services/singing.jpg")} alt="Singing" />
     ```

## Implementation Steps

1. Check all components that load external resources (images, audio, etc.)
2. Apply the path fixes consistently across all components
3. Provide multiple audio formats for better compatibility
4. Add error handling to audio and image components
5. Test in both development and production environments

Remember to clear your browser cache after making these changes to ensure you're seeing the latest version of your site. 