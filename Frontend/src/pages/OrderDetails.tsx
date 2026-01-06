// Frontend/src/pages/OrderDetails.tsx

import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { fetchOrderById } from "../features/orderSlice";

export const OrderDetails = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { currentOrder, loading, error } = useSelector(
    (state: RootState) => state.order
  );

  const orderId = searchParams.get("orderId");

  // Fetch order details when component mounts or orderId changes
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    } else {
      // If no orderId, redirect to orders page
      navigate("/orders");
    }
  }, [orderId, dispatch, navigate]);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status badge color helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      case "placed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // Payment status color helper
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "pending":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/orders"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // No order found
  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Link
            to="/orders"
            className="text-indigo-600 hover:underline mt-2 inline-block"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total items
  const totalItems = currentOrder.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/orders"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Orders
        </Link>

        {/* Order Header Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Order #{currentOrder._id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600">
                Placed on {formatDate(currentOrder.createdAt)}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(
                currentOrder.status
              )}`}
            >
              {currentOrder.status.charAt(0).toUpperCase() +
                currentOrder.status.slice(1)}
            </span>
          </div>

          {/* Order Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-indigo-600">
                ${currentOrder.totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Status</p>
              <p
                className={`text-lg font-semibold ${getPaymentStatusColor(
                  currentOrder.paymentStatus
                )}`}
              >
                {currentOrder.paymentStatus.charAt(0).toUpperCase() +
                  currentOrder.paymentStatus.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Estimated Delivery</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Date(currentOrder.estimateDeliverDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Items ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </h2>
          <div className="space-y-4">
            {currentOrder.orderItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <img
                  src={item.productId.itemDisplayImage}
                  alt={item.productId.itemName}
                  className="w-20 h-20 object-cover rounded-md border"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {item.productId.itemName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    Price: ${item.priceAtTimeOfAdding.toFixed(2)} each
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800">
                    ${(item.priceAtTimeOfAdding * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Delivery Information
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
              <p className="text-gray-800">{currentOrder.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="text-gray-800 capitalize">
                {currentOrder.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Order Timeline (Optional - shows order history) */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Timeline
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                ✓
              </div>
              <div className="ml-4">
                <p className="font-semibold text-gray-800">Order Placed</p>
                <p className="text-sm text-gray-500">
                  {formatDate(currentOrder.createdAt)}
                </p>
              </div>
            </div>

            {currentOrder.status === "completed" && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                  ✓
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">Delivered</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(currentOrder.updatedAt)}
                  </p>
                </div>
              </div>
            )}

            {currentOrder.status === "cancelled" && (
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">
                  ✕
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">Order Cancelled</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(currentOrder.updatedAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
