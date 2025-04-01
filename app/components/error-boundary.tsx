"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  componentName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component to catch and handle React errors
 * Prevents the entire application from crashing due to errors in child components
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render shows the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // You could log to an error reporting service here
    // Example: logErrorToService(error, errorInfo, this.props.componentName);
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, componentName, fallback } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      return fallback || (
        <div 
          style={{
            padding: '20px',
            border: '1px solid #ffcccc',
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 0, 0, 0.05)',
            margin: '10px 0',
            maxWidth: '800px'
          }}
        >
          <h2 style={{ margin: '0 0 10px', color: '#cc0000', fontSize: '18px' }}>
            Something went wrong {componentName ? `in ${componentName}` : ''}
          </h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary style={{ cursor: 'pointer', color: '#666' }}>
              View error details
            </summary>
            <pre style={{ 
              margin: '10px 0', 
              padding: '10px', 
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              fontSize: '14px',
              overflow: 'auto'
            }}>
              {error?.toString()}
              {errorInfo?.componentStack}
            </pre>
          </details>
          <div style={{ marginTop: '15px' }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              style={{
                padding: '8px 12px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // Return children if there's no error
    return children;
  }
}

export default ErrorBoundary; 