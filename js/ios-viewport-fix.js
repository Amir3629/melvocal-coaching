/**
 * iOS Viewport Fix
 * 
 * This script specifically targets iOS Safari to fix the black bars issue
 * by implementing multiple approaches:
 * 1. Forces viewport settings
 * 2. Applies direct DOM styling
 * 3. Creates a full-viewport background
 */

(function() {
  // Only run on iOS
  if ((/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) || 
      ('ontouchstart' in window && /AppleWebKit/.test(navigator.userAgent))) {
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initFix);
    } else {
      initFix();
    }
    
    // Re-apply on orientation change and resize
    window.addEventListener('orientationchange', initFix);
    window.addEventListener('resize', initFix);
    
    // Calculate and set real viewport width
    function setRealViewportWidth() {
      // Get the actual viewport width
      const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      
      // Set it as a CSS variable
      document.documentElement.style.setProperty('--real-vw', viewportWidth + 'px');
      
      // Apply to all major containers
      const elements = [
        document.documentElement,
        document.body,
        document.getElementById('__next'),
        ...Array.from(document.querySelectorAll('main, .container, section'))
      ];
      
      elements.forEach(el => {
        if (!el) return;
        el.style.width = viewportWidth + 'px';
        el.style.maxWidth = viewportWidth + 'px';
        el.style.marginLeft = '0';
        el.style.marginRight = '0';
      });
    }
    
    // Run immediately and on resize
    setRealViewportWidth();
    window.addEventListener('resize', setRealViewportWidth);
  }
  
  function initFix() {
    // STEP 1: Fix viewport meta
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover, user-scalable=yes');
    }
    
    // STEP 2: Add iOS specific class to html
    document.documentElement.classList.add('ios');
    
    // STEP 3: Fix root elements
    document.documentElement.style.width = '100vw';
    document.documentElement.style.minWidth = '100vw';
    document.documentElement.style.maxWidth = '100vw';
    document.documentElement.style.backgroundColor = 'black';
    document.documentElement.style.overflowX = 'hidden';
    
    document.body.style.width = '100vw';
    document.body.style.minWidth = '100vw';
    document.body.style.maxWidth = '100vw';
    document.body.style.backgroundColor = 'black';
    document.body.style.overflowX = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // STEP 4: Add full-viewport background
    if (!document.getElementById('ios-bg-fix')) {
      const bg = document.createElement('div');
      bg.id = 'ios-bg-fix';
      bg.style.position = 'fixed';
      bg.style.top = '0';
      bg.style.left = '0';
      bg.style.right = '0';
      bg.style.bottom = '0';
      bg.style.width = '100vw';
      bg.style.height = '100vh';
      bg.style.backgroundColor = 'black';
      bg.style.zIndex = '-9999';
      document.body.insertBefore(bg, document.body.firstChild);
    }
    
    // STEP 5: Fix all sections
    const sections = document.querySelectorAll('section, #hero, main, .container');
    sections.forEach(section => {
      section.style.width = '100vw';
      section.style.minWidth = '100vw';
      section.style.maxWidth = '100vw';
      section.style.marginLeft = '0';
      section.style.marginRight = '0';
      section.style.paddingLeft = '0';
      section.style.paddingRight = '0';
      section.style.backgroundColor = 'black';
    });
    
    // STEP 6: Fix hero video
    const heroVideos = document.querySelectorAll('#hero video, #hero .absolute');
    heroVideos.forEach(video => {
      video.style.width = '100vw';
      video.style.maxWidth = '100vw';
      video.style.left = '0';
      video.style.right = '0';
      video.style.backgroundColor = 'black';
    });
  }
})();
