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