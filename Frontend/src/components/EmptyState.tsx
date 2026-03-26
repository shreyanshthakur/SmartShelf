interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: "box" | "search" | "end";
}

function EmptyState({
  title = "No Items Found",
  message = "We couldn't find any items at the moment.",
  icon = "box",
}: EmptyStateProps) {
  const icons = {
    box: (
      <svg
        className="w-16 h-16 md:w-24 md:h-24 text-gray-400 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    search: (
      <svg
        className="w-16 h-16 md:w-24 md:h-24 text-gray-400 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    end: (
      <svg
        className="w-16 h-16 md:w-24 md:h-24 text-gray-400 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
      {/* Icon */}
      <div className="mb-6 animate-bounce">{icons[icon]}</div>

      {/* Title */}
      <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-gray-600 text-sm md:text-base text-center max-w-md">
        {message}
      </p>
    </div>
  );
}

export default EmptyState;
