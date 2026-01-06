import { Link } from "react-router-dom";
import type { Order } from "../features/orderSlice";

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "placed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate total items
  const totalItems = order.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Order Header */}
      <div className="flex justify-between items-start mb-4 pb-4 border-b">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order #{order._id.slice(-8).toUpperCase()}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{orderDate}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-4">
        {order.orderItems.map((item) => (
          <div key={item._id} className="flex items-center gap-4">
            <img
              src={item.productId.itemDisplayImage}
              alt={item.productId.itemName}
              className="w-16 h-16 object-cover rounded-md border"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-800">
                {item.productId.itemName}
              </p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-gray-800">
              ${item.priceAtTimeOfAdding.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Order Footer */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{totalItems}</span> item
          {totalItems !== 1 ? "s" : ""}
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-xl font-bold text-indigo-600">
              ${order.totalAmount.toFixed(2)}
            </p>
          </div>
          <Link
            to={`/order-details?orderId=${order._id}`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
