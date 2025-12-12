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
  // Fetch all items list to populate on HomePage
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/v1/items");
        setItems(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch items.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center bg-gray-100">
        <div className="flex items-center justify-center bg-gray-50 shadow-lg rounded-lg py-4 w-full max-w-full text-center">
          <div className="mr-2 items-start justify-start pr-6">🍔</div>
          <div className="mr-2">Search 🔎</div>
          <input className="h-8 border border-gray-700 rounded min-w-lg"></input>
          <div className="ml-2">Filter</div>
        </div>
        <div className="text-center shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-full h-50">
          sliding images banner
        </div>
        <div className="text-center shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-full min-h-screen h-50">
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
            </div>
          </div>
        </div>
      </div>
      {/* Add a spacer to push content above the footer */}
      <div className="flex-1" />
    </div>
  );
}

export default HomePage;
