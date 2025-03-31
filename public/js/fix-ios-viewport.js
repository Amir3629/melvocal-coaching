// iOS specific viewport fixes
(function() {
  // Fix for mobile viewport height issues on iOS
  function setAppHeight() {
    const doc = document.documentElement;
    if (doc) {
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    }
    
    // Force black background on all containers
    if (document.body) {
      document.body.style.backgroundColor = 'black';
    }
    if (document.documentElement) {
      document.documentElement.style.backgroundColor = 'black';
    }
    
    // Find all potential containers and make sure they're full width
    const containers = document.querySelectorAll('section, .container, main, div[id="__next"], #hero');
    containers.forEach(el => {
      if (el) {
        el.style.width = '100%';
        el.style.maxWidth = '100%';
        el.style.backgroundColor = 'black';
      }
    });
  }
  
  // Run on load
  setAppHeight();
  
  // Run on resize and orientation change
  window.addEventListener('resize', setAppHeight);
  window.addEventListener('orientationchange', setAppHeight);
  
  // Force black backgrounds for iOS Safari
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    if (document.documentElement) {
      document.documentElement.style.backgroundColor = 'black';
    }
    if (document.body) {
      document.body.style.backgroundColor = 'black';
    }
    
    // Handle safe areas in iOS
    if (document.documentElement) {
      document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
      document.documentElement.style.setProperty('--sal', 'env(safe-area-inset-left)');
      document.documentElement.style.setProperty('--sar', 'env(safe-area-inset-right)');
    }
  }
})(); 