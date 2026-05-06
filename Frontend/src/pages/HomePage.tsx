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
  itemPrice: string | number;
  itemDisplayImage: string;
  itemImages: string[];
  // add other properties as needed
};

type SortBy = "newest" | "price" | "rating";
type SortOrder = "asc" | "desc";

type FilterState = {
  category: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
};

const DEFAULT_FILTERS: FilterState = {
  category: "",
  minPrice: "",
  maxPrice: "",
  minRating: "",
  sortBy: "newest",
  sortOrder: "desc",
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
  const [inputValue, setInputValue] = useState(""); // what user is typing
  const [searchQuery, setSearchQuery] = useState(""); // committed query that triggers API
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] =
    useState<FilterState>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  // Ref to prevent duplicate API calls
  const isFetchingRef = useRef(false);

  const MAX_RETRY_ATTEMPTS = 3;
  const ITEMS_PER_PAGE = 10;

  // API call function to fetch paginated data
  const fetchItems = useCallback(
    async (
      pageNum: number,
      isRetry = false,
      search: string,
      filters: FilterState,
    ) => {
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

        const params = new URLSearchParams({
          page: String(pageNum),
          limit: String(ITEMS_PER_PAGE),
        });

        if (search.trim()) {
          params.set("search", search.trim());
        }
        if (filters.category.trim()) {
          params.set("category", filters.category.trim());
        }
        if (filters.minPrice.trim()) {
          params.set("minPrice", filters.minPrice.trim());
        }
        if (filters.maxPrice.trim()) {
          params.set("maxPrice", filters.maxPrice.trim());
        }
        if (filters.minRating.trim()) {
          params.set("minRating", filters.minRating.trim());
        }
        params.set("sortBy", filters.sortBy);
        params.set("sortOrder", filters.sortOrder);

        const res = await axios.get(
          `http://localhost:5000/api/v1/items?${params.toString()}`,
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
              fetchItems(pageNum, true, search, filters);
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
      fetchItems(page, false, searchQuery, appliedFilters);
    }
  }, [page, hasMore, fetchItems, searchQuery, appliedFilters]);

  // Reset pagination whenever committed search query or applied filters change
  useEffect(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
    isFetchingRef.current = false;
  }, [searchQuery, appliedFilters]);

  const commitSearch = () => {
    setSearchQuery(inputValue);
  };

  const applyFilters = () => {
    setAppliedFilters({
      ...draftFilters,
      category: draftFilters.category.trim(),
      minPrice: draftFilters.minPrice.trim(),
      maxPrice: draftFilters.maxPrice.trim(),
      minRating: draftFilters.minRating.trim(),
    });
  };

  const clearFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const hasAppliedFilters =
    Boolean(appliedFilters.category) ||
    Boolean(appliedFilters.minPrice) ||
    Boolean(appliedFilters.maxPrice) ||
    Boolean(appliedFilters.minRating) ||
    appliedFilters.sortBy !== "newest" ||
    appliedFilters.sortOrder !== "desc";

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
    fetchItems(page, false, searchQuery, appliedFilters);
  };

  return (
    <div>
      <div className="flex items-center justify-center bg-white shadow-lg rounded-xl py-4 px-6 w-full max-w-4xl mx-auto my-4 gap-3">
        {/* Search icon + input */}
        <div className="flex items-center flex-1 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 bg-white">
          <span
            className="text-gray-400 mr-2 cursor-pointer hover:text-blue-500"
            onClick={commitSearch}
          >
            🔎
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commitSearch()}
            placeholder="Search for products..."
            className="flex-1 outline-none text-gray-700 bg-transparent"
            aria-label="Search products"
          />
          {inputValue && (
            <button
              onClick={() => {
                setInputValue("");
                setSearchQuery("");
              }}
              className="text-gray-400 hover:text-gray-600 ml-2"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter button */}
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
        >
          <span>⚙️</span> Filter
        </button>
      </div>

      {showFilters && (
        <div className="bg-white shadow-md rounded-xl py-4 px-6 w-full max-w-4xl mx-auto mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <input
              type="text"
              value={draftFilters.category}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              placeholder="Category"
              className="border border-gray-300 rounded-lg px-3 py-2"
              aria-label="Filter by category"
            />

            <input
              type="number"
              min="0"
              value={draftFilters.minPrice}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  minPrice: e.target.value,
                }))
              }
              placeholder="Min price"
              className="border border-gray-300 rounded-lg px-3 py-2"
              aria-label="Minimum price"
            />

            <input
              type="number"
              min="0"
              value={draftFilters.maxPrice}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  maxPrice: e.target.value,
                }))
              }
              placeholder="Max price"
              className="border border-gray-300 rounded-lg px-3 py-2"
              aria-label="Maximum price"
            />

            <select
              value={draftFilters.minRating}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  minRating: e.target.value,
                }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2"
              aria-label="Minimum rating"
            >
              <option value="">Any rating</option>
              <option value="1">1+ stars</option>
              <option value="2">2+ stars</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
              <option value="5">5 stars</option>
            </select>

            <select
              value={draftFilters.sortBy}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  sortBy: e.target.value as SortBy,
                }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2"
              aria-label="Sort by"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price">Sort: Price</option>
              <option value="rating">Sort: Rating</option>
            </select>

            <select
              value={draftFilters.sortOrder}
              onChange={(e) =>
                setDraftFilters((prev) => ({
                  ...prev,
                  sortOrder: e.target.value as SortOrder,
                }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2"
              aria-label="Sort order"
            >
              <option value="desc">Order: Descending</option>
              <option value="asc">Order: Ascending</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Clear
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center bg-gray-100 min-h-screen">
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
              {!loading &&
                !error &&
                items.length === 0 &&
                (searchQuery || hasAppliedFilters ? (
                  <EmptyState
                    title="No Results Found"
                    message="No items match your current search and filters."
                    icon="search"
                  />
                ) : (
                  <EmptyState
                    title="No Items Available"
                    message="Check back later for new items or try refreshing the page."
                    icon="box"
                  />
                ))}

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
                          itemPrice={String(item.itemPrice)}
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
