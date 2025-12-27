import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { fetchCart } from "../features/cartSlice";
import { PaymentForm } from "../components/PaymentForm";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../config/stripe";

export const Checkout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
  });

  const shippingCost = 10;
  const taxRate = 0.1;
  const tax = totalAmount * taxRate;
  const finalTotal = totalAmount + shippingCost + tax;

  useEffect(() => {
    if (paymentMethod === "card" && items.length > 0) {
      createPaymentIntent();
    }
  }, [paymentMethod, items]);

  const createPaymentIntent = async () => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/create-payment-intent`,
        {},
        { withCredentials: true }
      );

      setClientSecret(response.data.clientSecret);
      setPaymentIntentId(response.data.paymentIntentId);
    } catch (error: unknown) {
      console.error("Payment intent creation error: ", error);
      setError(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to initialize payment"
      );
    }
  };

  const handlePaymentSuccess = async (confirmedPaymentIntent: string) => {
    await handlePlaceOrder(confirmedPaymentIntent);
  };

  const handlePlaceOrder = async (confirmedPaymentIntent?: string) => {
    // Validation
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone) {
      setError("Please fill in all required shipping information");
      return;
    }

    if (
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.state ||
      !shippingInfo.zipCode
    ) {
      setError("Please fill in complete shipping address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format delivery address
      const deliveryAddress = `${shippingInfo.fullName}, ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}, ${shippingInfo.country}. Contact: ${shippingInfo.phone}, ${shippingInfo.email}`;

      // Create order
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/order`,
        {
          deliveryAddress,
          paymentMethod: paymentMethod === "cod" ? "cash" : paymentMethod,
          paymentIntentId: confirmedPaymentIntent || paymentIntentId,
        },
        { withCredentials: true }
      );

      if (response.data.order) {
        // Fetch cart to get updated (cleared) state from backend
        await dispatch(fetchCart());

        alert(
          `Order placed successfully! Order ID: ${response.data.order._id}`
        );
        navigate("/");
      }
    } catch (error: unknown) {
      console.error("Order placement error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || "Failed to place order. Please try again.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const options = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "stripe" as const,
      },
    }),
    [clientSecret]
  );

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Shipping Info */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={shippingInfo.fullName}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, fullName: e.target.value })
              }
              className="w-full border rounded-lg p-3"
            />
            <input
              type="email"
              placeholder="Email *"
              value={shippingInfo.email}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, email: e.target.value })
              }
              className="w-full border rounded-lg p-3"
            />
            <input
              type="tel"
              placeholder="Phone *"
              value={shippingInfo.phone}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, phone: e.target.value })
              }
              className="w-full border rounded-lg p-3"
            />
            <input
              type="text"
              placeholder="Address *"
              value={shippingInfo.address}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, address: e.target.value })
              }
              className="w-full border rounded-lg p-3"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="City *"
                value={shippingInfo.city}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, city: e.target.value })
                }
                className="w-full border rounded-lg p-3"
              />
              <input
                type="text"
                placeholder="State *"
                value={shippingInfo.state}
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, state: e.target.value })
                }
                className="w-full border rounded-lg p-3"
              />
            </div>
            <input
              type="text"
              placeholder="ZIP Code *"
              value={shippingInfo.zipCode}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
              }
              className="w-full border rounded-lg p-3"
            />

            <h2 className="text-xl font-semibold mt-8 mb-4">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value as "card")}
                  className="w-4 h-4"
                />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value as "cod")}
                  className="w-4 h-4"
                />
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary & Payment */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between">
                  <span>
                    {item.productId?.itemName} x {item.quantity}
                  </span>
                  <span>
                    ${(item.priceAtTimeOfAdding * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <hr />
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <hr className="border-t-2" />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Section */}
          <div className="mt-8">
            {paymentMethod === "card" ? (
              <>
                {clientSecret && (
                  <Elements stripe={stripePromise} options={options}>
                    <PaymentForm
                      onPaymentSuccess={handlePaymentSuccess}
                      amount={finalTotal}
                    />
                  </Elements>
                )}
                {!clientSecret && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">
                      Loading payment form...
                    </p>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => handlePlaceOrder()}
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? "Placing Order..." : "Place Order (COD)"}
              </button>
            )}
          </div>

          {error && (
            <div className="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
