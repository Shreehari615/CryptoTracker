import React from 'react';

/**
 * ErrorState Component
 * 
 * Displays a friendly error message with a retry button.
 * Used when API calls fail or data cannot be loaded.
 */
const ErrorState = React.memo(function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Error Icon */}
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-crypto-red"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Something went wrong
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
        {message || 'Failed to load data. Please check your connection and try again.'}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium 
                     rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 
                     focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Try Again
        </button>
      )}
    </div>
  );
});

export default ErrorState;
