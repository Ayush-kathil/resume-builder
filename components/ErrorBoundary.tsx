'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /**
   * Optional label used in logs to identify which boundary caught the error.
   * Useful for narrowing down which part of the UI crashed.
   */
  label?: string;
}

/**
 * Global Error Boundary — Fix Crash #5 & #15.
 * Wraps any subtree to prevent white-screen crashes. 
 * Logs errors to the console for debugging and renders a graceful fallback UI.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const label = this.props.label || 'Unknown';
    console.error(`[ErrorBoundary:${label}] Uncaught error:`, error, errorInfo);
    this.setState({ errorInfo });
    // In production you would send to a monitoring service like Sentry here:
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            minHeight: '200px',
            background: '#fff8f8',
            border: '1px solid #fee2e2',
            borderRadius: '1rem',
            color: '#1a1a1a',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h2 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem', maxWidth: '400px' }}>
            This section encountered an error and couldn&apos;t be displayed.
            The rest of the application is still working normally.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              background: '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details
              style={{
                marginTop: '1rem',
                textAlign: 'left',
                fontSize: '0.75rem',
                color: '#ef4444',
                maxWidth: '600px',
                whiteSpace: 'pre-wrap',
              }}
            >
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                Debug info (dev only)
              </summary>
              <strong>{this.state.error.toString()}</strong>
              {this.state.errorInfo?.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
