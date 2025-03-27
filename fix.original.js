// Performance Optimization and Fix Script for melvocal-coaching
(function() {
  'use strict';
  
  console.log('Performance optimizer running...');
  
  // Detect if we're on GitHub Pages to handle path differences
  const isGitHubPages = window.location.hostname === 'amir3629.github.io';
  const basePath = isGitHubPages ? '/melvocal-coaching' : '';
  
  // Execute critical tasks immediately to improve FCP and LCP
  const now = performance.now();
  
  // Critical image list for preloading - updated based on Lighthouse report
  const criticalImages = [
    { path: 'images/backgrounds/hero-bg.webp', priority: 'high' }, // Highest priority: LCP element based on new audit
    { path: 'images/logo/ml-logo.webp', priority: 'high' },
    { path: 'images/services/singing.webp', priority: 'auto' },
    { path: 'images/services/coaching.webp', priority: 'auto' },
  ];
  
  // Map of images that need immediate resize to optimal dimensions
  const imageResizeMap = {
    'services-bg.jpg': { width: 1280, height: 720 },
    'hero-bg.jpg': { width: 1280, height: 720 },
    'hero-bg.webp': { width: 1280, height: 720 },
    'singing.jpg': { width: 800, height: 533 },
    'coaching.jpg': { width: 800, height: 533 },
    'workshop.jpg': { width: 800, height: 533 },
    'chor.jpg': { width: 800, height: 533 },
    'performance1.jpg': { width: 800, height: 533 },
    'performance2.jpg': { width: 800, height: 533 },
    'performance3.jpg': { width: 800, height: 533 },
    'performance4.jpg': { width: 800, height: 533 },
    'contact-bg.jpg': { width: 1280, height: 720 },
    'profile.jpg': { width: 800, height: 533 },
    'ml-logo.PNG': { width: 295, height: 207 } // Add logo with correct dimensions
  };

  // Immediately preload the hero background (LCP element) before DOM is fully loaded
  function preloadHeroBackground() {
    const heroImagePath = `${basePath}/images/backgrounds/hero-bg.webp`;
    
    // Create a new image object and force a load
    const img = new Image();
    img.fetchPriority = 'high';
    img.decoding = 'sync';
    img.onload = function() {
      console.log('Hero background preloaded successfully');
      
      // Immediately apply to any hero elements if they exist
      document.querySelectorAll('.hero-bg, [data-hero-bg]').forEach(el => {
        if (el.tagName === 'IMG') {
          el.src = heroImagePath;
        } else {
          el.style.backgroundImage = `url(${heroImagePath})`;
        }
      });
    };
    img.src = heroImagePath;
    
    // Also add a preload link for browsers that support it
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = heroImagePath;
    link.fetchPriority = 'high';
    link.type = 'image/webp';
    document.head.appendChild(link);
  }
  
  // Run critical preloading immediately
  preloadHeroBackground();

  // Fix image paths and optimize for all images
  function fixImagePaths() {
    const startTime = performance.now();
    document.querySelectorAll('img').forEach(function(img) {
      const src = img.src || '';
      
      // Skip if already processed
      if (img.hasAttribute('data-optimized')) return;
      img.setAttribute('data-optimized', 'true');
      
      // Fix vocal-coaching paths
      if (src.includes('/vocal-coaching/')) {
        img.src = src.replace('/vocal-coaching/', '/melvocal-coaching/');
      }
      
      // Fix image dimensions - add width and height attributes to prevent layout shifts
      addImageDimensions(img);
      
      // Fix aspect ratio issues
      fixAspectRatio(img);
      
      // Convert critical images to WebP if browser supports it
      if (supportsWebP() && 
          (src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png'))) {
        try {
          // Only convert if not already WebP
          if (!src.endsWith('.webp')) {
            // Preserve fetchpriority and other attributes
            const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
            if (isImageCritical(src)) {
              // For critical images, preload both formats for browser compatibility
              preloadImage(webpSrc, img.fetchPriority === 'high');
            }
            // Allow the browser to choose the best format
            img.srcset = `${webpSrc} 1x, ${src} 1x`;
          }
        } catch (e) {
          console.warn('WebP conversion error:', e);
        }
      }
      
      // Remove lazy loading from critical above-the-fold images
      if (isImageCritical(src)) {
        img.loading = 'eager';
        img.fetchPriority = 'high';
        img.decoding = 'sync';
        
        // Force decode for immediate display
        if (img.decode) {
          try {
            img.decode().then(() => {
              console.log('Decoded critical image:', src);
            }).catch(err => {
              console.warn('Error decoding image:', err);
            });
          } catch (e) {
            console.warn('Decode not supported');
          }
        }
      } else if (!img.hasAttribute('loading') && !isInViewport(img)) {
        // Add lazy loading to off-screen images that don't have loading attribute set
        img.loading = 'lazy';
      }
      
      // Apply direct sizing to oversized images
      resizeOversizedImage(img);
      
      // Fix logo aspect ratio specifically
      if (src.includes('ml-logo.PNG') || src.includes('ml-logo.webp')) {
        fixLogoAspectRatio(img);
      }
      
      // Ensure hero-bg image has width and height attributes
      if (src.includes('hero-bg')) {
        if (!img.hasAttribute('width')) img.setAttribute('width', '1280');
        if (!img.hasAttribute('height')) img.setAttribute('height', '720');
      }
    });
    console.log('Image paths fixed in ' + (performance.now() - startTime) + 'ms');
  }
  
  // Fix logo aspect ratio specifically
  function fixLogoAspectRatio(img) {
    // Get the correct dimensions for the logo
    const correctDimensions = imageResizeMap['ml-logo.PNG'];
    if (!correctDimensions) return;
    
    // Set the correct intrinsic dimensions
    img.setAttribute('width', correctDimensions.width);
    img.setAttribute('height', correctDimensions.height);
    
    // If the image has object-contain class, ensure it preserves aspect ratio
    if (img.classList.contains('object-contain')) {
      img.style.objectFit = 'contain';
      img.style.width = 'auto';
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      
      // If the parent is forcing proportions, add aspect ratio property
      const aspectRatio = correctDimensions.width / correctDimensions.height;
      img.style.aspectRatio = `${aspectRatio}`;
    }
  }
  
  // Check if element is in viewport
  function isInViewport(element) {
    if (!element.getBoundingClientRect) return true;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  
  // Add width and height attributes to prevent layout shifts
  function addImageDimensions(img) {
    // Only proceed if image doesn't already have explicit dimensions
    if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
      const src = img.src || '';
      const computedStyle = window.getComputedStyle(img);
      const displayWidth = parseInt(computedStyle.width, 10) || img.clientWidth;
      const displayHeight = parseInt(computedStyle.height, 10) || img.clientHeight;
      
      if (displayWidth && displayHeight) {
        img.setAttribute('width', displayWidth);
        img.setAttribute('height', displayHeight);
      }
    }
  }
  
  // Fix aspect ratio issues by applying correct object-fit and dimensions
  function fixAspectRatio(img) {
    const src = img.src || '';
    const fileName = src.split('/').pop();
    
    // Ensure w-full h-full images have explicit dimensions
    if (img.classList.contains('w-full') && img.classList.contains('h-full')) {
      const parent = img.parentElement;
      if (parent && !img.hasAttribute('width') && !img.hasAttribute('height')) {
        // Use parent's dimensions as a fallback
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;
        if (parentWidth && parentHeight) {
          img.setAttribute('width', parentWidth);
          img.setAttribute('height', parentHeight);
        }
      }
    }
    
    // Check if image has object-cover class which might distort aspect ratio
    if (img.classList.contains('object-cover')) {
      // Ensure the image maintains correct proportions with object-fit
      img.style.objectFit = 'cover';
      
      // For service cards specifically, adjust height to maintain proportion
      if (src.includes('/services/')) {
        // Preserve aspect ratio for service images
        const parent = img.closest('[data-service-card]');
        if (parent) {
          const containerWidth = parent.clientWidth;
          // Apply appropriate height based on original aspect ratio (typically 3:2 for these images)
          const aspectHeight = Math.round(containerWidth * (2/3));
          img.style.height = aspectHeight + 'px';
        }
      }
    }
  }
  
  // Resize oversized images directly to optimal dimensions
  function resizeOversizedImage(img) {
    const src = img.src || '';
    
    // Extract filename from path
    const match = src.match(/([^/]+)\.(jpg|jpeg|png|webp)$/i);
    if (match) {
      const fileName = match[1];
      const fileExt = match[2];
      
      // Check if this image needs resizing based on our map
      for (const [key, dimensions] of Object.entries(imageResizeMap)) {
        if (src.includes(key)) {
          // Apply optimal dimensions
          if (dimensions.width && dimensions.height) {
            // Set intrinsic size attributes for faster layout
            if (!img.hasAttribute('width')) {
              img.setAttribute('width', dimensions.width);
            }
            if (!img.hasAttribute('height')) {
              img.setAttribute('height', dimensions.height);
            }
            
            // If image is significantly larger than display size, attempt to rescale
            if (img.naturalWidth > dimensions.width * 1.5) {
              // For background images that need to be large for visual impact
              if (key.includes('bg') || key.includes('hero')) {
                // Keep original but optimize rendering
                img.style.objectFit = 'cover';
              } else {
                // For content images, limit actual rendering size
                img.style.maxWidth = dimensions.width + 'px';
                img.style.maxHeight = dimensions.height + 'px';
              }
            }
          }
          break;
        }
      }
    }
  }
  
  // Check if an image is in our critical list
  function isImageCritical(src) {
    if (!src) return false;
    
    // Hero background is always critical
    if (src.includes('hero-bg')) return true;
    
    return criticalImages.some(function(criticalImage) {
      return src.includes(criticalImage.path) || 
             src.includes(criticalImage.path.replace('.webp', '.jpg')) ||
             src.includes(criticalImage.path.replace('.webp', '.png'));
    });
  }
  
  // Preload an image
  function preloadImage(src, highPriority) {
    // Check if link already exists
    const existingLink = document.querySelector(`link[rel="preload"][href="${src}"]`);
    if (existingLink) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    if (highPriority) {
      link.fetchPriority = 'high';
    }
    document.head.appendChild(link);
  }
  
  // Detect WebP support
  function supportsWebP() {
    try {
      return document.createElement('canvas')
        .toDataURL('image/webp')
        .indexOf('data:image/webp') === 0;
    } catch (e) {
      return false;
    }
  }
  
  // Optimize CSS delivery to prevent render blocking
  function optimizeCssDelivery() {
    const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
    styleSheets.forEach(function(link) {
      // Skip critical CSS and already optimized links
      if (link.hasAttribute('data-critical') || link.media === 'print') {
        return;
      }
      
      // Make non-critical CSS non-render-blocking
      link.media = 'print';
      link.setAttribute('onload', 'this.media="all"');
    });
  }
  
  // Fix all link elements (stylesheets, favicons, etc.)
  function fixLinkElements() {
    document.querySelectorAll('link').forEach(function(link) {
      const href = link.getAttribute('href') || '';
      
      if (href.includes('/vocal-coaching/')) {
        link.setAttribute('href', href.replace('/vocal-coaching/', '/melvocal-coaching/'));
      }
    });
  }
  
  // Add device detection for mobile optimization
  function detectDeviceType() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      document.documentElement.classList.add('is-mobile');
      
      // Add passive event listeners for better performance on mobile
      addPassiveListeners();
      
      // Reduce motion for better performance
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('reduce-motion');
      }
      
      return 'mobile';
    }
    return 'desktop';
  }
  
  // Apply mobile-specific optimizations
  function applyMobileOptimizations() {
    // Reduce JavaScript execution by debouncing events
    debounceScrollEvents();
    
    // Reduce image quality on mobile for faster loading
    document.querySelectorAll('img:not([data-critical])').forEach(img => {
      // Mark non-critical images for lower quality on mobile
      if (!isImageCritical(img.src)) {
        img.style.imageRendering = 'auto';
      }
    });
  }
  
  // Debounce scroll events to reduce main thread work
  function debounceScrollEvents() {
    // Store original event listener
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    
    // Override with debounced version for scroll and resize events
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (type === 'scroll' || type === 'resize') {
        let debounceTimer;
        const debouncedListener = function(e) {
          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }
          debounceTimer = setTimeout(() => {
            listener.apply(this, [e]);
          }, 100); // 100ms debounce
        };
        
        // Call original with debounced listener
        return originalAddEventListener.call(
          this, 
          type, 
          debouncedListener, 
          options
        );
      }
      
      // Default behavior for other events
      return originalAddEventListener.call(this, type, listener, options);
    };
  }
  
  // Add passive event listeners for touch and scroll
  function addPassiveListeners() {
    const supportsPassive = (function() {
      let result = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get: function() { result = true; return true; }
        });
        window.addEventListener('testPassive', null, opts);
        window.removeEventListener('testPassive', null, opts);
      } catch (e) {}
      return result;
    })();
    
    if (supportsPassive) {
      const passiveEvents = ['touchstart', 'touchmove', 'wheel', 'mousewheel'];
      passiveEvents.forEach(function(event) {
        window.addEventListener(event, function(){}, { passive: true });
      });
    }
  }
  
  // Fix font loading to avoid render blocking
  function optimizeFontLoading() {
    document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]').forEach(function(link) {
      link.setAttribute('media', 'print');
      link.setAttribute('onload', "this.media='all'");
    });
  }
  
  // Pre-connect to necessary domains
  function addPreconnections() {
    // Only need two essential preconnections
    const domains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];
    
    domains.forEach(function(domain) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
      
      // Add crossorigin attribute for fonts domains
      if (domain.includes('gstatic')) {
        link.setAttribute('crossorigin', '');
      }
    });
  }
  
  // Preload critical images for LCP
  function preloadCriticalImages() {
    criticalImages.forEach(function(image) {
      preloadImage(`${basePath}/${image.path}`, image.priority === 'high');
    });
  }
  
  // Add inline CSS for critical rendering path
  function addCriticalCSS() {
    // Add inline CSS for major layout elements to avoid FOUC
    const criticalCSS = `
      img { max-width: 100%; height: auto; }
      img.object-cover { object-fit: cover; }
      img.object-contain { object-fit: contain; aspect-ratio: auto; }
      .reduce-motion * { transition-duration: 0.001s !important; animation-duration: 0.001s !important; }
      
      /* Fix hero layout immediately */
      .hero-section, [data-hero] {
        position: relative;
        min-height: 60vh;
      }
      
      /* Optimize main thread work by using GPU acceleration for certain elements */
      .hero-bg, [data-hero-bg], .parallax, .animate-on-scroll {
        transform: translateZ(0);
        will-change: transform;
      }
      
      /* Fix accessibility - ensure buttons always have a visible focus state */
      button:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 2px;
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    document.head.appendChild(style);
  }
  
  // Fix browser errors for missing files
  function fixMissingResources() {
    // Replace all references to missing files
    const imageFixes = {
      'photo_8_2025-02-27_12-05-55.jpg': '/melvocal-coaching/images/about/profile.jpg'
    };
    
    // Fix image src attributes for known missing files
    Object.entries(imageFixes).forEach(([missing, replacement]) => {
      document.querySelectorAll(`img[src*="${missing}"]`).forEach(img => {
        console.log(`Fixing missing resource: ${missing} -> ${replacement}`);
        img.src = replacement;
      });
    });
    
    // Also find and fix any broken src attributes that might cause 404 errors
    document.querySelectorAll('img').forEach(img => {
      if (img.getAttribute('src') === null || img.getAttribute('src') === '') {
        // Set a default placeholder
        img.src = `${basePath}/images/placeholders/avatar.svg`;
      }
    });
  }
  
  // Fix GitHub Pages paths if we're on GitHub Pages
  function fixGitHubPagesPaths() {
    // Fix base href if needed
    const baseElement = document.querySelector('base');
    if (baseElement) {
      const href = baseElement.getAttribute('href') || '';
      if (href === '/' || href === '/vocal-coaching/') {
        baseElement.setAttribute('href', '/melvocal-coaching/');
      }
    }
    
    // Fix form actions
    document.querySelectorAll('form').forEach(form => {
      const action = form.getAttribute('action') || '';
      if (action.startsWith('/') && !action.startsWith('/melvocal-coaching/')) {
        form.setAttribute('action', '/melvocal-coaching' + action);
      }
    });
  }
  
  // Add minimal CSP for XSS protection
  function addSecurityHeaders() {
    // Only add if not already present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', 'Content-Security-Policy');
      meta.setAttribute('content', "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data:; connect-src 'self'; font-src 'self' https://fonts.gstatic.com;");
      document.head.appendChild(meta);
    }
  }
  
  // Make buttons accessible by adding screen reader labels
  function fixAccessibilityIssues() {
    // Fix buttons without accessible names
    document.querySelectorAll('button:not([aria-label]):not([title])').forEach(button => {
      // Check if button has no text content
      if (!button.textContent.trim()) {
        // Try to infer purpose from children
        const img = button.querySelector('img[alt]');
        if (img && img.alt) {
          button.setAttribute('aria-label', img.alt);
        }
        else if (button.classList.contains('menu-button')) {
          button.setAttribute('aria-label', 'Menu');
        }
        else if (button.classList.contains('close-button')) {
          button.setAttribute('aria-label', 'Close');
        }
        else {
          // Default for buttons we can't classify
          button.setAttribute('aria-label', 'Button');
        }
      }
    });
    
    // Add captions to videos
    document.querySelectorAll('video').forEach(video => {
      if (!video.querySelector('track[kind="captions"]')) {
        // Add an empty track for captions
        const track = document.createElement('track');
        track.kind = 'captions';
        track.label = 'English';
        track.srclang = 'en';
        // Default to empty VTT file if we don't have actual captions
        track.src = `${basePath}/captions/default.vtt`; 
        video.appendChild(track);
      }
    });
  }
  
  // Service Worker Registration
  function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      // Delay service worker registration to prioritize critical rendering
      setTimeout(() => {
        const swPath = isGitHubPages ? '/melvocal-coaching/service-worker.js' : '/service-worker.js';
        
        navigator.serviceWorker.register(swPath)
          .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      }, 3000); // Delay by 3 seconds
    }
  }
  
  // Initialize performance optimizations
  function initPerformanceOptimizations() {
    // Add critical CSS immediately
    addCriticalCSS();
    
    // Add preconnections to speed up resource loading
    addPreconnections();
    
    // Fix GitHub Pages paths if needed
    if (isGitHubPages) {
      fixGitHubPagesPaths();
    }

    // Fix image paths and optimize loading
    fixImagePaths();
    
    // Optimize CSS delivery
    optimizeCssDelivery();
    
    // Fix link elements
    fixLinkElements();
    
    // Add device-specific optimizations
    const deviceType = detectDeviceType();
    if (deviceType === 'mobile') {
      applyMobileOptimizations();
    }
    
    // Fix missing resources
    fixMissingResources();
    
    // Font optimization
    optimizeFontLoading();
    
    // Add security headers
    addSecurityHeaders();
    
    // Fix accessibility issues
    fixAccessibilityIssues();
    
    // Register service worker for caching
    registerServiceWorker();
    
    console.log('Performance optimizations completed in ' + (performance.now() - now) + 'ms');
  }
  
  // Run optimizations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceOptimizations);
  } else {
    initPerformanceOptimizations();
  }
})(); 