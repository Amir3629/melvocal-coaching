"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component to catch React errors and prevent the entire app from crashing
 * Especially useful for catching React Error #130 (invalid props)
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="mb-2">The application encountered an error. Please try again later.</p>
          <details className="text-sm">
            <summary className="cursor-pointer">Error details</summary>
            <p className="mt-2">{this.state.error?.message || 'Unknown error'}</p>
          </details>
          <button
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => this.setState({ hasError: false, error: null })}
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