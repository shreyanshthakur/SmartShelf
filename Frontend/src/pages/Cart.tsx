import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeFromCart,
  updateCartItemQuantity,
  type CartItem,
} from "../features/cartSlice";
import type { AppDispatch, RootState } from "../store";
import { useNavigate } from "react-router-dom";

export const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, totalAmount, loading, error } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (itemId: string) => {
    dispatch(removeFromCart({ itemId }));
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    dispatch(updateCartItemQuantity({ itemId, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500">Add some items to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Cart Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* Cart Items - Vertical Layout */}
        <div className="space-y-4 mb-8">
          {items.map((item: CartItem) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6 hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <img
                src={item.productId.itemDisplayImage}
                alt={item.productId.itemName}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {item.productId.itemName}
                </h3>
                <p className="text-lg text-indigo-600 font-bold">
                  ${item.priceAtTimeOfAdding.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Stock: {item.productId.itemStock}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (item.quantity > 1) {
                      handleQuantityChange(item._id, item.quantity - 1);
                    }
                  }}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">
                  {item.quantity}
                </span>
                <button
                  onClick={() => {
                    if (item.quantity < item.productId.itemStock) {
                      handleQuantityChange(item._id, item.quantity + 1);
                    }
                  }}
                  disabled={item.quantity >= item.productId.itemStock}
                  className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Item Subtotal */}
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Subtotal</p>
                <p className="text-xl font-bold text-gray-800">
                  ${(item.priceAtTimeOfAdding * item.quantity).toFixed(2)}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(item._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-lg font-semibold text-gray-800">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Shipping:</span>
              <span className="text-lg font-semibold text-gray-800">Free</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total:</span>
              <span className="text-2xl font-bold text-indigo-600">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
          <button
            className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            onClick={() => {
              handleCheckout();
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
