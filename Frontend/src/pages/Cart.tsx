import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeFromCart,
  updateCartItemQuantity,
  type CartItem,
} from "../features/cartSlice";
import type { AppDispatch, RootState } from "../store";

export const Cart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalAmount, loading, error } = useSelector(
    (state: RootState) => state.cart
  );

  useEffect(() => {
    console.log("[DEBUG] Cart component mounted, fetching cart...");
    dispatch(fetchCart());
  }, [dispatch]);
  console.log("[DEBUG] Cart state - items:", items);
  console.log("[DEBUG] Cart state - items length:", items?.length);
  console.log("[DEBUG] Cart state - loading:", loading);
  console.log("[DEBUG] Cart state - error:", error);
  const handleRemove = (itemId: string) => {
    dispatch(removeFromCart({ itemId }));
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    dispatch(updateCartItemQuantity({ itemId, quantity: newQuantity }));
  };

  if (loading) return <div>Loading cart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!items) return <div>Your cart is empty</div>;
  if (items.length === 0) return <div>Your cart is empty</div>;

  return (
    <div className="items-center flex justify-center text-xl text-gray-700 text-shadow-blue-950 text min-h-screen">
      {items.map((item: CartItem) => (
        <div key={item._id}>
          <h3>{item.productId.itemName}</h3>
          <p>Price: ${item.priceAtTimeOfAdding}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) =>
              handleQuantityChange(item._id, parseInt(e.target.value))
            }
          />
          <button onClick={() => handleRemove(item._id)}>Remove</button>
        </div>
      ))}
      <h2>Total: ${totalAmount}</h2>
    </div>
  );
};
