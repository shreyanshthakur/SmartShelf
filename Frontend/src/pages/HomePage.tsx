import { Link } from "react-router-dom";
import Item from "../components/Item";
import axios from "axios";
import { useEffect, useState } from "react";

type ItemType = {
  _id?: string;
  itemName: string;
  itemPrice: string;
  itemDisplayImage: string;
  itemImages: string[];
  // add other properties as needed
};

function HomePage() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (isFetchingMore || !hasMore) return;
        if (page === 1) {
          setLoading(true);
        } else {
          setIsFetchingMore(true);
        }

        const limit = 10;
        const res = await axios.get(
          `http://localhost:5000/api/v1/items?page=${page}&limit=${limit}`,
        );
        const newItems = res.data.data.items;
        const paginationData = res.data.pagination;

        if (page === 1) {
          setItems(newItems);
        } else {
          setItems((prevItems) => [...prevItems, ...newItems]);
        }

        setHasMore(paginationData.hasMore);
      } catch (error) {
        console.error(error);
        setError("Failed ot fetch items.");
      } finally {
        setLoading(false);
        setIsFetchingMore(false);
      }
    };
    fetchItems();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // If user is 300px from bottom
      const nearBottom = scrollTop + windowHeight >= docHeight - 300;

      if (nearBottom && hasMore && !isFetchingMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup remove listener when component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetchingMore, loading]);

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
              {loading ? (
                <div>Loading...</div>
              ) : error ? (
                <div>{error}</div>
              ) : (
                items.map((item, index) => (
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
                ))
              )}
              {isFetchingMore && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-600">Loading more items...</p>
                </div>
              )}
              {!hasMore && items.length > 0 && !loading && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">You've reached the end!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
