// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Register service worker if available
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/js/service-worker.js')
      .then(registration => {
        console.log('Service worker registered successfully:', registration.scope);
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  }

  // Fix for "Cannot read properties of null (reading 'style')" error
  // Only access DOM elements when we're sure they exist
  const safelySetStyle = (selector, styleProperty, value) => {
    const element = document.querySelector(selector);
    if (element) {
      element.style[styleProperty] = value;
    }
  };

  // Fix for mobile viewports
  const updateViewport = () => {
    // Only run these operations if the elements exist
    if (document.documentElement && document.body) {
      const viewportWidth = window.innerWidth;
      document.documentElement.style.width = viewportWidth + 'px';
      document.body.style.width = viewportWidth + 'px';
    }
  };

  // Run once on load
  updateViewport();

  // Also run on resize
  window.addEventListener('resize', updateViewport);

  // Fix for deprecated meta tag
  const fixMetaTags = () => {
    // Check for apple-mobile-web-app-capable meta tag
    const appleMobileTag = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
    if (appleMobileTag && !document.querySelector('meta[name="mobile-web-app-capable"]')) {
      // Add the standard mobile-web-app-capable meta tag
      const mobileTag = document.createElement('meta');
      mobileTag.setAttribute('name', 'mobile-web-app-capable');
      mobileTag.setAttribute('content', 'yes');
      document.head.appendChild(mobileTag);
    }
  };

  fixMetaTags();

  // Properly handle audio elements
  const setupAudio = () => {
    document.querySelectorAll('audio').forEach(audio => {
      // Add error handling
      audio.addEventListener('error', (e) => {
        console.log('Audio error:', e.target.error);
      });
      
      // Add load handling
      audio.addEventListener('canplaythrough', () => {
        console.log('Audio can play through, ready to play');
      });
      
      // Handle loading errors
      audio.addEventListener('stalled', () => {
        console.log('Audio stalled, attempting to reload');
        if (audio.src) {
          const currentSrc = audio.src;
          audio.src = '';
          setTimeout(() => {
            audio.src = currentSrc;
          }, 1000);
        }
      });
    });
  };

  setupAudio();

  // Check for and log found sections
  const logSections = () => {
    const sections = ['hero', 'services', 'about', 'testimonials', 'contact'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        console.log(`Section with id "${section}" found`);
      } else {
        console.log(`Section with id "${section}" not found`);
      }
    });
  };

  logSections();
}); 