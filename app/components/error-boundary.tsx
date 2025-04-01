"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  context?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component to catch and handle React errors
 * Prevents the entire application from crashing due to errors in child components
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(`Error in ${this.props.context || 'component'}:`, error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // You can also log to an error reporting service like Sentry here
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error);
    // }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error!, this.handleReset);
      }
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-fallback p-4 rounded-md bg-red-50 border border-red-100">
          <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          {this.state.error && (
            <details className="mt-2">
              <summary className="cursor-pointer text-red-600">Error details</summary>
              <p className="mt-1 text-sm text-red-500 whitespace-pre-wrap font-mono">
                {this.state.error.toString()}
              </p>
            </details>
          )}
          <button 
            onClick={this.handleReset}
            className="mt-3 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-sm rounded transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 