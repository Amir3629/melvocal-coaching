"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  componentName?: string;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches errors in its child component tree
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const { componentName } = this.props;
    
    // Log the error to console
    console.error(`Error in ${componentName || 'component'}:`, error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Save to localStorage for debugging
    try {
      if (typeof localStorage !== 'undefined') {
        const errors = JSON.parse(localStorage.getItem('melvocal-errors') || '[]');
        errors.push({
          timestamp: new Date().toISOString(),
          component: componentName || 'unknown',
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack
        });
        localStorage.setItem('melvocal-errors', JSON.stringify(errors));
      }
    } catch (e) {
      // Silently fail
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (typeof this.props.fallback === 'function' && this.state.error) {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="error-boundary p-4 bg-black bg-opacity-90 text-white rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4">
            {this.props.componentName 
              ? `Error in ${this.props.componentName} component`
              : 'There was an error in this component'}
          </p>
          {this.state.error && (
            <p className="text-red-400 text-sm font-mono">
              {this.state.error.message}
            </p>
          )}
          <button 
            onClick={this.handleReset}
            className="mt-3 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 