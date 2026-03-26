import { Link } from "react-router-dom";
import Item from "../components/Item";
import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import LoadingSpinner from "../components/LoadingSpinner";
import ItemSkeleton from "../components/ItemSkeleton";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

type ItemType = {
  _id?: string;
  itemName: string;
  itemPrice: string;
  itemDisplayImage: string;
  itemImages: string[];
  // add other properties as needed
};

function HomePage() {
  // State variables
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Ref to prevent duplicate API calls
  const isFetchingRef = useRef(false);

  const MAX_RETRY_ATTEMPTS = 3;
  const ITEMS_PER_PAGE = 10;

  // API call function to fetch paginated data
  const fetchItems = useCallback(
    async (pageNum: number, isRetry = false) => {
      // Prevent duplicate API calls during active loading
      if (isFetchingRef.current) return;

      try {
        isFetchingRef.current = true;

        if (pageNum === 1) {
          setLoading(true);
        } else {
          setIsFetchingMore(true);
        }

        setError(null);

        const res = await axios.get(
          `http://localhost:5000/api/v1/items?page=${pageNum}&limit=${ITEMS_PER_PAGE}`,
        );
        const newItems = res.data.data.items;
        const paginationData = res.data.pagination;

        // Append new items to existing items array
        if (pageNum === 1) {
          setItems(newItems);
        } else {
          setItems((prevItems) => [...prevItems, ...newItems]);
        }

        setHasMore(paginationData.hasMore);

        // Reset retry count on successful fetch
        if (isRetry) {
          setRetryCount(0);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to fetch items."
          : "Failed to fetch items.";

        setError(errorMessage);

        // Retry logic
        if (retryCount < MAX_RETRY_ATTEMPTS) {
          setRetryCount((prev) => prev + 1);
          setTimeout(
            () => {
              isFetchingRef.current = false;
              fetchItems(pageNum, true);
            },
            1000 * (retryCount + 1),
          ); // Exponential backoff
          return;
        }
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
        isFetchingRef.current = false;
      }
    },
    [retryCount],
  );

  // Initial fetch and fetch on page change
  useEffect(() => {
    if (!isFetchingRef.current && (page === 1 || hasMore)) {
      fetchItems(page);
    }
  }, [page, hasMore, fetchItems]);

  // Load more items callback for infinite scroll
  const loadMore = useCallback(() => {
    if (!isFetchingRef.current && hasMore && !loading && !error) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [hasMore, loading, error]);

  // Use the infinite scroll hook
  const sentinelRef = useInfiniteScroll(loadMore, {
    hasMore,
    isLoading: loading || isFetchingMore,
    threshold: 0.5,
    rootMargin: "200px",
  });

  // Manual retry function for errors
  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    fetchItems(page);
  };

  return (
    <div>
      <div className="flex flex-col items-center bg-gray-100 min-h-screen">
        {/* Search Bar */}
        <div className="flex items-center justify-center bg-gray-50 shadow-lg rounded-lg py-4 w-full max-w-full text-center">
          <div className="mr-2 items-start justify-start pr-6">🍔</div>
          <div className="mr-2">Search 🔎</div>
          <input className="h-8 border border-gray-700 rounded min-w-lg"></input>
          <div className="ml-2">Filter</div>
        </div>

        {/* Main Content Area */}
        <div className="text-center shadow-md rounded-lg px-4 md:px-8 pt-6 pb-8 w-full max-w-full">
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 p-2 md:p-4 w-full">
              {/* Initial Loading State with Skeleton */}
              {loading && page === 1 && <ItemSkeleton count={ITEMS_PER_PAGE} />}

              {/* Error State (No Items Loaded) */}
              {error && items.length === 0 && (
                <ErrorMessage
                  message={error}
                  onRetry={handleRetry}
                  retryCount={retryCount}
                  maxRetries={MAX_RETRY_ATTEMPTS}
                  fullPage
                />
              )}

              {/* Empty State (No Items Found) */}
              {!loading && !error && items.length === 0 && (
                <EmptyState
                  title="No Items Available"
                  message="Check back later for new items or try refreshing the page."
                  icon="box"
                />
              )}

              {/* Items Grid with Smooth Transitions */}
              {items.length > 0 && (
                <>
                  {items.map((item, index) => (
                    <div
                      key={item._id ?? index}
                      className="transform transition-all duration-300 ease-in-out 
                                 hover:scale-105 hover:shadow-xl
                                 animate-fadeIn"
                      style={{
                        animationDelay: `${(index % ITEMS_PER_PAGE) * 50}ms`,
                      }}
                    >
                      <Link to={`/itemDescriptionPage?itemId=${item._id}`}>
                        <Item
                          itemId={item._id || ""}
                          itemName={item.itemName}
                          itemPrice={item.itemPrice}
                          itemImage={item.itemDisplayImage}
                        />
                      </Link>
                    </div>
                  ))}

                  {/* Sentinel element for infinite scroll */}
                  {hasMore && !error && (
                    <div ref={sentinelRef} className="col-span-full h-4" />
                  )}

                  {/* Loading More Indicator */}
                  {isFetchingMore && (
                    <div className="col-span-full py-8">
                      <LoadingSpinner
                        size="medium"
                        text="Loading more items..."
                      />
                    </div>
                  )}

                  {/* Error During Pagination */}
                  {error && items.length > 0 && (
                    <ErrorMessage
                      message={error}
                      onRetry={handleRetry}
                      retryCount={retryCount}
                      maxRetries={MAX_RETRY_ATTEMPTS}
                    />
                  )}

                  {/* End of List Indicator */}
                  {!hasMore && !error && (
                    <EmptyState
                      title="You've reached the end!"
                      message="That's all we have for now. Check back later for more items."
                      icon="end"
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
