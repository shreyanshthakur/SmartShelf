import { Link } from "react-router-dom";
import Item from "../components/Item";
import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

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
      <div className="flex flex-col items-center bg-gray-100">
        <div className="flex items-center justify-center bg-gray-50 shadow-lg rounded-lg py-4 w-full max-w-full text-center">
          <div className="mr-2 items-start justify-start pr-6">🍔</div>
          <div className="mr-2">Search 🔎</div>
          <input className="h-8 border border-gray-700 rounded min-w-lg"></input>
          <div className="ml-2">Filter</div>
        </div>
        <div className="text-center shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-full">
          <div className="w-full flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4 w-full">
              {loading && page === 1 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600">Loading items...</p>
                </div>
              ) : error && items.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  {retryCount < MAX_RETRY_ATTEMPTS ? (
                    <p className="text-gray-600">
                      Retrying... (Attempt {retryCount + 1} of{" "}
                      {MAX_RETRY_ATTEMPTS})
                    </p>
                  ) : (
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {items.map((item, index) => (
                    <Link
                      key={item._id ?? index}
                      to={`/itemDescriptionPage?itemId=${item._id}`}
                    >
                      <Item
                        itemId={item._id || ""}
                        itemName={item.itemName}
                        itemPrice={item.itemPrice}
                        itemImage={item.itemDisplayImage}
                      />
                    </Link>
                  ))}

                  {/* Sentinel element for infinite scroll */}
                  {hasMore && !error && (
                    <div ref={sentinelRef} className="col-span-full h-4" />
                  )}

                  {/* Loading more indicator */}
                  {isFetchingMore && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-600">Loading more items...</p>
                    </div>
                  )}

                  {/* Error during pagination load */}
                  {error && items.length > 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-red-600 mb-4">{error}</p>
                      <button
                        onClick={handleRetry}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* End of list indicator */}
                  {!hasMore && items.length > 0 && !error && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-500">You've reached the end!</p>
                    </div>
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
