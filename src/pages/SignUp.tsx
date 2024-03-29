import { useState } from "react";
import Snackbar from "../utils/snackbar";
import axios from "axios";
import key from "../api/key";
import citiesData from "../utils/city.json";

const SignUp = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [userType, setUserType] = useState<string>("Buyer");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");

  const isFormEmpty = () => {
    return !username || !email || !password || !selectedCity;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isFormEmpty()) {
      setSnackbarMessage("Please fill in all required fields.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await axios.post(`${key.API_URL}/register`, {
        user: {
          username,
          email,
          password,
          city,
          user_type: userType,
        },
      });

      if (response.status === 201) {
        setSnackbarMessage("Sign up successfully. Email Confirmation Sent");
        setSnackbarOpen(true);
        console.log(response);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCity(input);

    const filteredSuggestions = citiesData.cities.filter((suggestion) =>
      suggestion.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (selectedCity: string) => {
    setCity(selectedCity);
    setSelectedCity(selectedCity);
    setSuggestions([]);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/background-image.webp")' }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-md w-full bg-white bg-opacity-90 rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Sign Up for an Account
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                style={{ borderColor: "#D8C1A9" }}
                className="block w-full px-4 py-2 border-[#D8C1A9] rounded-md focus:ring focus:ring-[#E8D9C2] placeholder-gray-400"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

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
                className="block w-full px-4 py-2 border rounded-md focus:ring focus:ring-[#E8D9C2] placeholder-gray-400"
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
                autoComplete="new-password"
                className="block w-full px-4 py-2 border rounded-md focus:ring focus:ring-[#E8D9C2] placeholder-gray-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4 relative">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                autoComplete="off"
                className="block w-full px-4 py-2 border rounded-md focus:ring focus:ring-[#E8D9C2] placeholder-gray-400"
                placeholder="City"
                value={city}
                onChange={handleInputChange}
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                  {suggestions.slice(0, 5).map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                User Type
              </label>
              <select
                className="block w-full px-4 py-2 border rounded-md focus:ring focus:ring-[#E8D9C2]"
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 ${
                isFormEmpty()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#D8C1A9] hover:bg-[#E8D9C2] text-white"
              } font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              disabled={isFormEmpty()}
            >
              Sign Up
            </button>
            <p className="text-center text-gray-500 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-[#D8C1A9] hover:underline">
                Log in
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

export default SignUp;
