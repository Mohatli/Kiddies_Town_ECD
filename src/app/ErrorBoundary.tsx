import { useState, useEffect, useCallback, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

function ErrorBoundaryInner({ children, fallbackTitle = 'Something went wrong' }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      event.preventDefault();
      setError(event.error || new Error(event.message));
    };
    window.addEventListener('error', handler);
    return () => window.removeEventListener('error', handler);
  }, []);

  useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      setError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)));
    };
    window.addEventListener('unhandledrejection', handler);
    return () => window.removeEventListener('unhandledrejection', handler);
  }, []);

  const handleReset = useCallback(() => setError(null), []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-rose-100 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{fallbackTitle}</h1>
            <p className="text-sm text-slate-500 mt-2">
              An unexpected error occurred. You can try refreshing the page or returning home.
            </p>
            <p className="text-xs text-slate-400 mt-3 font-mono bg-slate-100 rounded-lg p-3 break-all">
              {error.message}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Try Again
            </button>
            <a
              href="/"
              className="px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return <ErrorBoundaryInner {...props} />;
}
