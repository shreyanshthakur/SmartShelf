import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import type { AppDispatch, RootState } from "../store";
import { addToCart } from "../features/cartSlice";

interface Item {
  _id: string;
  itemName: string;
  itemPrice: number;
  itemDisplayImage?: string;
  itemDescription?: string;
  itemStock?: number;
}

export const ItemDescriptionPage = () => {
  const [searchParams] = useSearchParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch<AppDispatch>();
  const { loading: cartLoading, error: cartError } = useSelector(
    (state: RootState) => state.cart
  );

  const itemId = searchParams.get("itemId");
  const backendUrl =
    import.meta.env.REACT_APP_BACKEND_URL || `http://localhost:5000`;

  useEffect(() => {
    if (!itemId) {
      setError("Item ID is not provided");
      setLoading(false);
      return;
    }

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${backendUrl}/api/v1/items/${itemId}`
        );

        const itemData = response.data.item;

        if (!itemData) {
          setError("Item not found");
          return;
        }
        setItem(itemData);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Failed to load item");
        } else {
          setError("Failed to load item");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [itemId, backendUrl]);

  const handleAddToCart = async () => {
    if (!item) return;

    try {
      await dispatch(
        addToCart({
          productId: item._id,
          quantity: quantity,
        })
      ).unwrap();

      alert("Item added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-600">No item found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div className="flex items-center justify-center bg-gray-50 rounded-xl p-8">
              <img
                src={item.itemDisplayImage || "/placeholder.png"}
                alt={item.itemName}
                className="max-w-full h-auto max-h-96 object-contain rounded-lg"
              />
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {item.itemName}
                </h1>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-indigo-600">
                    ${item.itemPrice}
                  </span>
                </div>
              </div>

              {item.itemDescription && (
                <div className="border-t border-gray-200 pt-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {item.itemDescription}
                  </p>
                </div>
              )}

              {item.itemStock !== undefined && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Stock:
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      item.itemStock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.itemStock > 0
                      ? `${item.itemStock} available`
                      : "Out of stock"}
                  </span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity:
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.itemStock || 999}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(
                        Math.max(
                          1,
                          Math.min(
                            parseInt(e.target.value) || 1,
                            item.itemStock || 999
                          )
                        )
                      )
                    }
                    className="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(quantity + 1, item.itemStock || 999))
                    }
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {cartError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {cartError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition">
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={
                    cartLoading ||
                    (item.itemStock !== undefined && item.itemStock === 0)
                  }
                  className="flex-1 px-6 py-3 bg-white text-indigo-600 font-semibold border-2 border-indigo-600 rounded-lg shadow-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
                >
                  {cartLoading ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
