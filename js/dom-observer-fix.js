// Set scrollRestoration to auto - let the browser handle it naturally
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'auto';
}

// Safe implementation that waits for DOM to be ready
(function() {
  let savedScrollY = 0;
  
  // Check for modals and handle scroll locking
  function checkForModals() {
    const hasModal = document.querySelector('[role="dialog"], .modal, .fixed.inset-0');
    const isLocked = document.body.classList.contains('modal-open');
    
    if (hasModal && !isLocked) {
      // Save position and lock
      savedScrollY = window.scrollY;
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.body.style.position = 'relative';
    } 
    else if (!hasModal && isLocked) {
      // Unlock
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.style.position = '';
      
      // Restore scroll position directly
      window.scrollTo(0, savedScrollY);
    }
  }
  
  // Wait for the DOM to be fully loaded before observing
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing MutationObserver');
    
    // Now it's safe to observe document.body
    if (document.body) {
      const observer = new MutationObserver(checkForModals);
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
      
      // Initial check
      checkForModals();
    } else {
      console.error('Document body not available');
    }
  });
  
  // Make checkForModals available globally for debugging
  window.checkForModals = checkForModals;
})();

// Observer fix for dynamic elements
document.addEventListener('DOMContentLoaded', function() {
  // Force black background for iOS
  document.documentElement.style.backgroundColor = 'black';
  document.body.style.backgroundColor = 'black';
  
  // Ensure all sections and containers are full width
  const allSections = document.querySelectorAll('section, .container, main, #__next');
  allSections.forEach(section => {
    section.style.width = '100%';
    section.style.maxWidth = '100%';
    section.style.backgroundColor = 'black';
  });
  
  // Create an observer instance
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          
          // Check if the node is an element
          if (node.nodeType === 1) {
            // Fix section elements
            if (node.tagName === 'SECTION') {
              node.style.width = '100%';
              node.style.maxWidth = '100%';
              node.style.backgroundColor = 'black';
            }
            
            // Fix any sections, containers inside the new element
            const sections = node.querySelectorAll('section, .container, main');
            if (sections) {
              sections.forEach(section => {
                section.style.width = '100%';
                section.style.maxWidth = '100%';
                section.style.backgroundColor = 'black';
              });
            }
          }
        }
      }
    });
  });
  
  // Configure and start the observer
  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
}); 