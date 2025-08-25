import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // 自定义降级后的 UI
      return (
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
          <div className='max-w-md mx-auto text-center p-6'>
            <div className='mb-4'>
              <svg
                className='mx-auto h-12 w-12 text-red-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              Something went wrong
            </h2>
            <p className='text-gray-600 mb-4'>
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>
            <div className='space-y-2'>
              <button
                onClick={() => window.location.reload()}
                className='w-full px-4 py-2 bg-tag-blue text-white rounded-lg hover:bg-blue-600 transition-colors'
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.history.back()}
                className='w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors'
              >
                Go Back
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className='mt-4 text-left'>
                <summary className='cursor-pointer text-sm text-gray-500'>
                  Error Details (Development)
                </summary>
                <pre className='mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto'>
                  {this.state.error && this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
