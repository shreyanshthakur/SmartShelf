import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { addToCart } from "../features/cartSlice";

// Props: itemImage can be a string (URL) or a File/Blob, itemName and itemPrice are strings
interface ItemProps {
  itemId: string;
  itemName: string;
  itemPrice: string;
  itemImage: string;
}

const Item: React.FC<ItemProps> = ({
  itemId,
  itemName,
  itemPrice,
  itemImage,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.cart);

  const handleAddToCart = async () => {
    try {
      await dispatch(
        addToCart({
          productId: itemId,
          quantity: "1",
        })
      ).unwrap();

      alert(`${itemName} added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart: ", error);
      alert("Failed to add item to cart");
    }
  };
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-200">
      <img
        src={itemImage}
        alt={itemName}
        className="w-36 h-36 object-cover mb-4 rounded-lg border border-gray-200 shadow-sm bg-gray-50"
      />
      <div className="text-lg font-semibold text-gray-800 mb-1 text-center truncate w-full">
        {itemName}
      </div>
      <div className="text-base font-bold text-indigo-600 mb-2 text-center">
        {itemPrice}
      </div>
      <button className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition">
        Buy Now
      </button>
      <button
        className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition"
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add to cart"}
      </button>
    </div>
  );
};

export default Item;
