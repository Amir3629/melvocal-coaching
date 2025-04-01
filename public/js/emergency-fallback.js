/**
 * Emergency fallback script for the Mel Jazz website
 * If the site doesn't initialize within a specific timeout,
 * this script will redirect to the static fallback page.
 */
(function() {
  // Configuration
  const TIMEOUT_MS = 7000; // 7 seconds
  const FALLBACK_URL = '/melvocal-coaching/fallback.html';
  const APP_READY_FLAG = 'app-initialized';
  
  // Only run in production
  if (window.location.hostname.includes('localhost') || 
      window.location.port === '3000' ||
      window.location.port === '3001') {
    console.log('[Emergency Fallback] Disabled in development mode');
    return;
  }
  
  // Don't run on the fallback page itself
  if (window.location.pathname.includes('fallback.html')) {
    return;
  }
  
  // Check if we're already in an emergency redirect loop
  if (sessionStorage.getItem('emergency-redirect-count')) {
    const count = parseInt(sessionStorage.getItem('emergency-redirect-count') || '0', 10);
    
    // If we've already redirected too many times, stop trying
    if (count >= 2) {
      console.error('[Emergency Fallback] Too many redirects, stopping');
      return;
    }
    
    // Increment the redirect count
    sessionStorage.setItem('emergency-redirect-count', (count + 1).toString());
  } else {
    // First redirect, set the count to 1
    sessionStorage.setItem('emergency-redirect-count', '1');
  }
  
  // Set up fallback timer
  const fallbackTimer = setTimeout(function() {
    // Check if the app has already initialized
    if (window[APP_READY_FLAG]) {
      return;
    }
    
    console.error('[Emergency Fallback] Application failed to load in time, redirecting to fallback page');
    
    // Save error information
    try {
      const errors = JSON.parse(localStorage.getItem('melvocal-errors') || '[]');
      errors.push({
        timestamp: new Date().toISOString(),
        type: 'timeout',
        message: 'Application failed to load in ' + TIMEOUT_MS + 'ms',
        url: window.location.href
      });
      localStorage.setItem('melvocal-errors', JSON.stringify(errors));
    } catch (e) {
      // Silently fail
    }
    
    // Redirect to the fallback page
    window.location.href = FALLBACK_URL + '?from=' + encodeURIComponent(window.location.pathname) + 
                           '&reason=timeout&ts=' + Date.now();
  }, TIMEOUT_MS);
  
  // Set up a flag for successful initialization
  window.markAppAsInitialized = function() {
    window[APP_READY_FLAG] = true;
    clearTimeout(fallbackTimer);
    console.log('[Emergency Fallback] Application initialized successfully');
  };
  
  // Also listen for the 'load' event as a backup
  window.addEventListener('load', function() {
    // Wait a bit longer after load to ensure React has hydrated
    setTimeout(function() {
      // If the app hasn't explicitly marked itself as ready, do it now
      if (!window[APP_READY_FLAG]) {
        // Check if the page seems functional by looking for common elements
        const hasHeader = document.querySelector('header') || document.querySelector('nav');
        const hasContent = document.querySelector('main') || document.querySelector('#__next');
        
        if (hasHeader && hasContent) {
          window.markAppAsInitialized();
        }
      }
    }, 2000);
  });
})(); 