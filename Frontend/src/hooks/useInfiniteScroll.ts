import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  rootMargin?: string;
}

const useInfiniteScroll = (
  callback: () => void,
  options: UseInfiniteScrollOptions,
): React.RefObject<HTMLDivElement | null> => {
  const { hasMore, isLoading, threshold = 1.0, rootMargin = "0px" } = options;

  // Ref for the sentinel element (the element we'll observe)
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Ref to store the latest callback to avoid recreating observer
  const callbackRef = useRef<() => void>(callback);

  // Keep callback ref updated with the latest callback
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Main effect to set up Intersection Observer
  useEffect(() => {
    // Don't observe if there's no more data or currently loading
    if (!hasMore || isLoading) {
      return;
    }

    const element = sentinelRef.current;

    // Element not yet mounted
    if (!element) {
      return;
    }

    // Create the Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        // When the sentinel element is visible, trigger the callback
        if (entry.isIntersecting) {
          callbackRef.current();
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin,
        threshold,
      },
    );

    // Start observing the sentinel element
    observer.observe(element);

    // Cleanup: disconnect observer when component unmounts or dependencies change
    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, threshold, rootMargin]);

  return sentinelRef;
};

export default useInfiniteScroll;
