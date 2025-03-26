"use client"

// This file defines global variables or polyfills to prevent reference errors

// Define AIChat globally to prevent "AIChat is not defined" errors
if (typeof window !== 'undefined') {
  // Only run on client side
  if (!(window as any).AIChat) {
    (window as any).AIChat = {
      // Placeholder implementation
      initialize: () => {},
      render: () => {},
      open: () => {},
      close: () => {},
    };
  }
}

export {}; 