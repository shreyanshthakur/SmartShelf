// Props: itemImage can be a string (URL) or a File/Blob, itemName and itemPrice are strings
interface ItemProps {
  itemName: string;
  itemPrice: string;
}

const Item: React.FC<ItemProps> = ({ itemName, itemPrice }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-200">
      <img
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
    </div>
  );
};

export default Item;
