import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Signin from "./pages/Signin";
import { Cart } from "./pages/Cart";
import { ItemDescriptionPage } from "./pages/ItemDescriptionPage";

function App() {
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
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
