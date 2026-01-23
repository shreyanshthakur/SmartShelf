import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Signin from "./pages/Signin";
import { Cart } from "./pages/Cart";
import { ItemDescriptionPage } from "./pages/ItemDescriptionPage";
import { checkAuth } from "./utils/authUtils";
import { Checkout } from "./pages/Checkout";
import { Orders } from "./pages/Orders";
import { OrderDetails } from "./pages/OrderDetails";
import { Profile } from "./pages/Profile";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication status when app loads
    checkAuth(dispatch);
  }, [dispatch]);

  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signin />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/itemDescriptionPage"
            element={<ItemDescriptionPage />}
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
