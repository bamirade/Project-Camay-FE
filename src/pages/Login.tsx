import React, { useState } from "react";
import axios from "axios";
import Snackbar from "../utils/snackbar";
import key from "../api/key";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${key.API_URL}/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, user_type } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("type", user_type);
        setSnackbarMessage("Login successful");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarOpen(true);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || error.message;
        console.log(errorMessage);
        setSnackbarMessage(errorMessage.error.toString());
      } else {
        console.error(`Unexpected Error:`, error);
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/background-image.jpg")' }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-md w-full bg-white bg-opacity-90 rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Log in to your account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-500 placeholder-gray-400"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-500 placeholder-gray-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="text-indigo-600 border-gray-300 rounded focus:ring focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="text-indigo-600 hover:underline">
                  Resend Email Confirmation?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log In
            </button>
            <p className="text-center text-gray-500 text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="text-indigo-600 hover:underline">
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default Login;
