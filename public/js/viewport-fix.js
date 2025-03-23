// Viewport Fix Script for Mobile
(function() {
  // Force correct viewport scaling on mobile
  function updateViewport() {
    // Force viewport to device width
    document.documentElement.style.width = '100%';
    document.documentElement.style.maxWidth = '100%';
    document.documentElement.style.overflow = 'hidden';
    
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100%';
    document.body.style.overflow = 'hidden';
    
    // Apply to main container
    const mainContainer = document.getElementById('__next') || document.body.firstElementChild;
    if (mainContainer) {
      mainContainer.style.width = '100%';
      mainContainer.style.maxWidth = '100%';
      mainContainer.style.minWidth = '100%';
      mainContainer.style.left = '0';
      mainContainer.style.right = '0';
      mainContainer.style.position = 'relative';
    }
    
    // Apply to all root level elements
    if (document.body.children) {
      Array.from(document.body.children).forEach(element => {
        if (element.tagName !== 'SCRIPT') {
          element.style.width = '100%';
          element.style.maxWidth = '100%';
          element.style.boxSizing = 'border-box';
        }
      });
    }
  }
  
  // Execute on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateViewport);
  } else {
    updateViewport();
  }
  
  // Also run on resize
  window.addEventListener('resize', updateViewport);
  
  // Fix for iOS Safari
  window.addEventListener('orientationchange', function() {
    // Small timeout to ensure orientation has fully changed
    setTimeout(updateViewport, 100);
  });
})(); 