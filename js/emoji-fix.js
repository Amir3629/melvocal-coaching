// Fix for emoji display in headings on mobile
(function() {
  // Function to fix emoji display in various elements
  function fixEmojiDisplay() {
    // Elements that might contain emoji
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, button, .modal-title, .progress-indicator span');
    
    headings.forEach(element => {
      // Force LTR direction
      element.style.direction = 'ltr';
      element.style.unicodeBidi = 'isolate';
      
      // Also apply to child elements that might contain emoji
      const children = element.querySelectorAll('*');
      children.forEach(child => {
        child.style.direction = 'ltr';
        child.style.unicodeBidi = 'isolate';
      });
    });
    
    // Specific fix for booking modal
    const modalElements = document.querySelectorAll('.modal-container *');
    modalElements.forEach(element => {
      if (element.tagName === 'H1' || 
          element.tagName === 'H2' || 
          element.tagName === 'H3' || 
          element.tagName === 'BUTTON' || 
          element.classList.contains('progress-indicator') ||
          element.parentElement?.classList.contains('progress-indicator')) {
        element.style.direction = 'ltr';
        element.style.unicodeBidi = 'isolate';
      }
    });
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixEmojiDisplay);
  } else {
    fixEmojiDisplay();
  }
  
  // Also run when new content might be added (like when modal opens)
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        fixEmojiDisplay();
      }
    });
  });
  
  // Start observing for dynamically added content
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Also run on any click that might open modals
  document.addEventListener('click', () => {
    setTimeout(fixEmojiDisplay, 100);
  });
})(); 