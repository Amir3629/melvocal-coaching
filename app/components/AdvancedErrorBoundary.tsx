'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  context?: string
}

interface State {
  hasError: boolean
  error?: Error
}

class AdvancedErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Advanced Error Boundary caught an error:', error);
    console.error('Component stack:', info.componentStack);
    
    // You can add real error tracking service integration here
    // Example: if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(error, {
    //     contexts: { 
    //       react: { componentStack: info.componentStack },
    //       context: this.props.context 
    //     }
    //   });
    // }
    
    // Log additional context if provided
    if (this.props.context) {
      console.error('Error context:', this.props.context);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <button onClick={this.handleReset}>Try again</button>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.toString()}</pre>
          </details>
        </div>
      )
    }
    return this.props.children
  }
}

export default AdvancedErrorBoundary 