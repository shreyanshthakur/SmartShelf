import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useDispatch } from "react-redux";
import { setUser } from "../features/userSlice";

axios.defaults.withCredentials = true;
// interface AuthResponse {
//   token: string;
//   userId: string;
// }

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/login`,
        loginData,
        { withCredentials: true }
      );
      console.log("response: ", response);
      if (response && response.data && response.data.success) {
        dispatch(
          setUser({
            userId: response.data.userId,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
          })
        );
        navigate("/"); // Redirect to dashboard after successful login
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Welcome Back!
        </h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
            <a
              href="/forgot-password" // Replace with your actual forgot password route
              className="inline-block align-baseline font-semibold text-sm text-blue-500 hover:text-blue-800"
            >
              Forgot Password?
            </a>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-xs italic mb-4">{errorMessage}</p>
          )}
          <p className="text-center text-gray-600 text-xs">
            Don't have an account?{" "}
            <a
              href="/signup" // Replace with your actual signup route
              className="font-semibold text-blue-500 hover:text-blue-800"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
