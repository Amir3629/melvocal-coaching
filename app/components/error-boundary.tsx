"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch React errors and prevent the entire app from crashing
 * Especially useful for catching React Error #130 (invalid props)
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    // Additional debugging for Error #130
    if (error.message && error.message.includes('Objects are not valid as a React child')) {
      console.error('--------- DEBUG INFO FOR ERROR #130 ---------');
      console.error('This error is likely caused by an object being passed directly to JSX');
      console.error('Check the component props and ensure all values are properly converted to strings');
      console.error('Common culprits include dates, API responses, and nested objects');
    }
    
    this.setState({ errorInfo });
  }

  public render() {
    const { componentName } = this.props;
    
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
          <h2 className="text-lg font-semibold mb-2">Something went wrong{componentName ? ` in ${componentName}` : ''}</h2>
          <p className="mb-2">The application encountered an error. Please try again later.</p>
          <details className="text-sm">
            <summary className="cursor-pointer font-medium">Error details (click to expand)</summary>
            <p className="mt-2 font-mono text-xs bg-white/50 p-2 rounded">
              {this.state.error?.message || 'Unknown error'}
            </p>
            {this.state.errorInfo && (
              <div className="mt-2">
                <p className="font-medium">Component Stack:</p>
                <pre className="mt-1 text-xs bg-white/50 p-2 rounded overflow-auto max-h-[200px]">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
          </details>
          <button
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
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