// Direct viewport fix
document.addEventListener('DOMContentLoaded', function() {
  // Force black background on all critical elements
  const elementsToFix = [
    document.documentElement,
    document.body,
    document.getElementById('__next'),
    document.querySelector('main')
  ];
  
  elementsToFix.forEach(el => {
    if (!el) return;
    
    // Apply critical styles
    el.style.width = '100vw';
    el.style.minWidth = '100vw';
    el.style.maxWidth = '100vw';
    el.style.margin = '0';
    el.style.padding = '0';
    el.style.backgroundColor = 'black';
    el.style.overflowX = 'hidden';
    el.style.position = 'relative';
    el.style.left = '0';
    el.style.right = '0';
  });
  
  // Add fixed black background that extends beyond viewport
  var blackBackground = document.createElement('div');
  blackBackground.style.position = 'fixed';
  blackBackground.style.top = '0';
  blackBackground.style.left = '-50px';
  blackBackground.style.right = '-50px';
  blackBackground.style.bottom = '0';
  blackBackground.style.width = 'calc(100vw + 100px)';
  blackBackground.style.backgroundColor = 'black';
  blackBackground.style.zIndex = '-9999';
  document.body.insertBefore(blackBackground, document.body.firstChild);
  
  // Target all JSS elements
  const jssElements = document.querySelectorAll('[class*="jss"], [class^="jsx-"], [class*="5baaba"]');
  jssElements.forEach(function(el) {
    el.style.width = '100vw';
    el.style.maxWidth = '100vw';
    el.style.marginLeft = '0';
    el.style.marginRight = '0';
    el.style.paddingLeft = '0';
    el.style.paddingRight = '0';
    el.style.backgroundColor = 'black';
    el.style.left = '0';
    el.style.right = '0';
  });
  
  // Force all sections to be full viewport width
  var sections = document.querySelectorAll('section, #hero, main, .container');
  sections.forEach(function(section) {
    section.style.width = '100vw';
    section.style.minWidth = '100vw';
    section.style.maxWidth = '100vw';
    section.style.left = '0';
    section.style.right = '0';
    section.style.margin = '0';
    section.style.marginLeft = '0';
    section.style.marginRight = '0';
    section.style.padding = '0';
    section.style.paddingLeft = '0';
    section.style.paddingRight = '0';
    section.style.backgroundColor = 'black';
    section.style.boxSizing = 'border-box';
    section.style.position = 'relative';
    section.style.overflowX = 'hidden';
  });
  
  // Look for containers with mx-auto or max-w classes
  var tailwindContainers = document.querySelectorAll('[class*="mx-auto"], [class*="max-w-"]');
  tailwindContainers.forEach(function(container) {
    container.style.width = '100vw';
    container.style.maxWidth = '100vw';
    container.style.margin = '0';
    container.style.marginLeft = '0';
    container.style.marginRight = '0';
    container.style.left = '0';
    container.style.right = '0';
    container.style.backgroundColor = 'black';
  });
  
  // Fix hero video
  var heroVideos = document.querySelectorAll('#hero video, #hero .absolute');
  heroVideos.forEach(function(video) {
    video.style.width = '100vw';
    video.style.minWidth = '100vw';
    video.style.maxWidth = '100vw';
    video.style.left = '0';
    video.style.backgroundColor = 'black';
    video.style.objectFit = 'cover';
  });
  
  // Fix for iOS devices
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
      ('ontouchstart' in window && /AppleWebKit/.test(navigator.userAgent))) {
    document.body.classList.add('ios-device');
    
    // Override any possible element that could cause black bars
    document.querySelectorAll('div').forEach(function(div) {
      if (div.offsetWidth < window.innerWidth && 
          (getComputedStyle(div).margin === 'auto' || 
           getComputedStyle(div).marginLeft === 'auto' || 
           getComputedStyle(div).marginRight === 'auto' ||
           getComputedStyle(div).maxWidth !== 'none')) {
        div.style.width = '100vw';
        div.style.maxWidth = '100vw';
        div.style.marginLeft = '0';
        div.style.marginRight = '0';
        div.style.left = '0';
        div.style.right = '0';
        div.style.backgroundColor = 'black';
      }
    });
    
    // Add viewport meta tag if it doesn't exist
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover');
    }
  }
});

// Run on load event as well
window.addEventListener('load', function() {
  // Target viewport meta
  var viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
  }
  
  // Create new viewport meta if it doesn't exist
  if (!viewportMeta) {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(meta);
  }
}); 