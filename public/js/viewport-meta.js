// Script to force viewport meta tag with document.write
(function() {
  // This ensures our viewport meta tag is processed before anything else
  document.write('<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />');
})(); 