interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryCount?: number;
  maxRetries?: number;
  fullPage?: boolean;
}

function ErrorMessage({
  message,
  onRetry,
  retryCount = 0,
  maxRetries = 3,
  fullPage = false,
}: ErrorMessageProps) {
  const containerClass = fullPage
    ? "col-span-full flex flex-col items-center justify-center py-16 px-4"
    : "col-span-full text-center py-8 px-4";

  return (
    <div className={containerClass}>
      {/* Error Icon */}
      <div className="mb-4">
        <svg
          className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Error Message */}
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-red-600 mb-6 text-sm md:text-base max-w-md">
        {message}
      </p>

      {/* Retry Status or Button */}
      {onRetry && (
        <>
          {retryCount < maxRetries ? (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
              <p className="text-sm md:text-base">
                Retrying... (Attempt {retryCount + 1} of {maxRetries})
              </p>
            </div>
          ) : (
            <button
              onClick={onRetry}
              className="group relative px-6 py-3 bg-blue-500 text-white font-medium rounded-lg 
                         hover:bg-blue-600 active:bg-blue-700 
                         transition-all duration-200 ease-in-out
                         transform hover:scale-105 active:scale-95
                         shadow-md hover:shadow-lg
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default ErrorMessage;
