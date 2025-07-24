import axios from "axios";
import { useState } from "react";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault(); // to stop browser from loading the whole page on submit
    setError(null);
    setLoading(true);

    // create new account in database
    try {
      console.log("[DEBUG] Calling the signup api");
      const response = await axios.post(`http://localhost:5000/api/v1/signup`, {
        userEmail: email,
        userPassword: password,
      });

      // set local storage token and userId
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create account. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Create a new account
          </h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email Address
              </label>
              <input
                className="shadow appearance-none border rounded px-3 py-2 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline"
                type="email"
                placeholder="Your email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded px-3 py-2 text-gray-700 w-full leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Your password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <p className="text-gray-600 flex text-xs font-light">
                Already have an account?
                <a
                  href="/login"
                  className="text-blue-500 hover:text-blue-700 ml-1 font-semibold"
                >
                  Login
                </a>
              </p>
            </div>
            {error && (
              <p className="text-red-500 text-xs italic mb-4">{error}</p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Signin;
