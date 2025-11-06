import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../features/userSlice";
import type { RootState } from "../store";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [cartItemCount] = useState(0);
  const { firstName, isLoggedIn } = useSelector(
    (state: RootState) => state.user
  ) as { firstName: string | null; isLoggedIn: boolean };
  const dispatch = useDispatch();

  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container flex items-center justify-between px-10 mx-10">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="text-xl font-bold hover:text-blue-300 transition duration-300"
        >
          SmartShelf
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-300 font-semibold"
                : "hover:text-blue-300 transition duration-300"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? "text-blue-300 font-semibold"
                : "hover:text-blue-300 transition duration-300"
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-blue-300 font-semibold"
                : "hover:text-blue-300 transition duration-300"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive
                ? "text-blue-300 font-semibold"
                : "hover:text-blue-300 transition duration-300"
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive
                ? "text-blue-300 font-semibold"
                : "hover:text-blue-300 transition duration-300"
            }
          >
            Sign Up
          </NavLink>
          {/* Add more navigation links as needed */}
        </nav>

        {/* Mobile Navigation (you might need to add more logic for toggling) */}
        <div className="md:hidden">
          <button className="text-white hover:text-blue-300 focus:outline-none">
            {/* You can use an icon here, e.g., a hamburger menu */}
            Menu
          </button>
          {/* You'll likely want to conditionally render a mobile navigation menu here */}
        </div>

        <Link
          to="/cart"
          className="text-xl bg-blue-500 hover:bg-blue-700 text-white py-2 rounded-xl p-2"
        >
          Cart {cartItemCount}
        </Link>

        {/* Profile Section */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-blue-600 font-bold">
                👤
              </div>

              <span className="text-sm font-semibold mr-20">
                {firstName || "Loading..."}
              </span>
              <button
                onClick={() => dispatch(logout())}
                className="bg-red-500 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-full text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-full text-sm focus:outline-none focus:shadow-outline"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
