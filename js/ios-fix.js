// iOS Safari-specific fixes
(function() {
  // Only run on iOS Safari
  if ((/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || 
      ('ontouchstart' in window && /AppleWebKit/.test(navigator.userAgent))) {
    
    // Add iOS-specific class to html element
    document.documentElement.classList.add('ios');
    
    // Fix viewport width
    function fixViewport() {
      // Force black background
      document.documentElement.style.backgroundColor = 'black';
      document.body.style.backgroundColor = 'black';
      
      // Expand view to full width
      document.documentElement.style.width = '100%';
      document.body.style.width = '100%';
      
      // Apply to all major containers
      const containers = document.querySelectorAll('body, #__next, main, section, .container');
      containers.forEach(container => {
        container.style.width = '100%';
        container.style.maxWidth = '100%';
        container.style.backgroundColor = 'black';
        container.style.margin = '0';
        container.style.padding = '0';
      });
      
      // Fix safari viewport issue with a minimal approach
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
      
      // Create a black background layer if needed
      if (!document.getElementById('ios-bg-fix')) {
        const bgFix = document.createElement('div');
        bgFix.id = 'ios-bg-fix';
        bgFix.style.position = 'fixed';
        bgFix.style.top = '0';
        bgFix.style.left = '0';
        bgFix.style.right = '0';
        bgFix.style.bottom = '0';
        bgFix.style.zIndex = '-1000';
        bgFix.style.backgroundColor = 'black';
        document.body.appendChild(bgFix);
      }
    }
    
    // Run immediately
    fixViewport();
    
    // Run on resize and orientation change
    window.addEventListener('resize', fixViewport);
    window.addEventListener('orientationchange', fixViewport);
    
    // Fix video sizing
    const videoElements = document.querySelectorAll('video');
    videoElements.forEach(video => {
      video.style.width = '100%';
      video.style.maxWidth = '100%';
      video.style.backgroundColor = 'black';
    });
  }
})(); 