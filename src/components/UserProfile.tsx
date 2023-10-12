import axios from "axios";
import React, { useState } from "react";
import Snackbar from "../utils/snackbar";
import citiesData from "../utils/city.json";
import key from "../api/key";

interface UserProfileProps {
  userInfo: {
    username: string;
    email: string;
    city: string;
    contact_information: string;
  };
  fetchData: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userInfo, fetchData }) => {
  const [isEditingInfo, setIsEditingInfo] = useState<boolean>(false);
  const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [contactInformation, setContactInformation] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const isFormEmpty = () => {
    return !selectedCity;
  };

  const isPasswordEmpty = () => {
    return !password;
  };

  const handleInfoEditClick = () => {
    setIsEditingInfo(true);
    setCity(userInfo.city);
    setEmail(userInfo.email);
    setContactInformation(userInfo.contact_information);
  };

  const handlePasswordEditClick = () => {
    setIsEditingPassword(true);
  };

  const handleCloseInfoEdit = () => {
    setIsEditingInfo(false);
  };

  const handleClosePasswordEdit = () => {
    setIsEditingPassword(false);
  };

  const handleInfoEdit = async () => {
    const authToken = localStorage.getItem("token");
    try {
      await axios.patch(
        `${key.API_URL}/users/update_info`,
        {
          user: {
            email,
            city: selectedCity,
            contact_information: contactInformation,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSnackbarMessage("Updated successfully");
      setSnackbarOpen(true);
      setIsEditingInfo(false);
      setSelectedCity("");
      fetchData();
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

  const handlePasswordEdit = async () => {
    const authToken = localStorage.getItem("token");
    try {
      await axios.patch(
        `${key.API_URL}/users/update_password`,
        { user: { password } },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSnackbarMessage("Updated successfully");
      setSnackbarOpen(true);
      setIsEditingPassword(false);
      fetchData();
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

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
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

  if (!userInfo) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
      <h2 className="text-3xl font-semibold border-b border-gray-300 pb-4">
        User Profile
      </h2>
      <div className="mt-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">{userInfo.username}</h3>
            {!isEditingInfo ? (
              <button
                className="px-4 py-2 text-white bg-[#D8C1A9] rounded-md hover:bg-[#E8D9C2] focus:outline-none focus:ring focus:ring-blue-400"
                onClick={handleInfoEditClick}
              >
                Edit
              </button>
            ) : (
              <div className="flex space-x-4">
                <button
                  className={`px-4 py-2 text-white ${
                    isFormEmpty()
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-[#D8C1A9] hover:bg-[#E8D9C2] text-white"
                  } rounded-md focus:outline-none focus:ring focus:ring-blue-400`}
                  onClick={handleInfoEdit}
                  disabled={isFormEmpty()}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-blue-400 ring-1 ring-inset ring-gray-300"
                  onClick={handleCloseInfoEdit}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="lg:grid grid-cols-2 gap-4">
          <div className="mb-6">
            <p className="text-gray-600">Email:</p>
            {!isEditingInfo ? (
              <p className="font-semibold">{userInfo.email}</p>
            ) : (
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="font-semibold block w-full h-full shadow-sm sm:text-sm focus:ring-blue-400 focus:border-blue-400 border-gray-300 rounded-md hover:bg-gray-100"
                style={{ fontSize: "1rem" }}
                placeholder="Email address"
                defaultValue={userInfo.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
          </div>
          <div className="mb-6">
            <p className="text-gray-600">City:</p>
            {!isEditingInfo ? (
              <p className="font-semibold">{userInfo.city}</p>
            ) : (
              <>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="off"
                  className="font-semibold block w-full h-full shadow-sm sm:text-sm focus:ring-blue-400 focus:border-blue-400 border-gray-300 rounded-md hover:bg-gray-100"
                  style={{ fontSize: "1rem" }}
                  value={city}
                  placeholder="City"
                  onChange={handleInputChange}
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-10 w-half bg-white border border-gray-300 rounded-lg shadow-lg">
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
              </>
            )}
          </div>
          <div className="col-2 lg:mt-1 mb-6">
            <p className="text-gray-600">Contact Information:</p>
            {!isEditingInfo ? (
              <p className="font-semibold">
                {userInfo.contact_information || "No contact info on record"}
              </p>
            ) : (
              <input
                type="text"
                className="font-semibold block w-full h-full shadow-sm sm:text-sm focus:ring-blue-400 focus:border-blue-400 border-gray-300 rounded-md hover:bg-gray-100"
                style={{ fontSize: "1rem" }}
                defaultValue={userInfo.contact_information}
                onChange={(e) => setContactInformation(e.target.value)}
              />
            )}
          </div>
          <div className="col-2 lg:mt-1 mb-6 min-h-[15vh]">
            {isEditingPassword ? (
              <div className="flex flex-col items-start mb-4">
                <label htmlFor="password" className="text-gray-600">
                  New Password:
                </label>
                <div className="relative w-full">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="block w-full h-10 px-3 py-2 leading-5 rounded-md shadow-sm focus:ring-blue-400 focus:border-blue-400 border-gray-300 transition duration-150 ease-in-out sm:text-sm"
                    placeholder="Password"
                    style={{ fontSize: "1rem" }}
                    defaultValue={""}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    onClick={handlePasswordToggle}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 focus:outline-none"
                  >
                    {showPassword ? (
                      <img
                        src="./password-show.svg"
                        alt="Hide Password"
                        className="h-6"
                      />
                    ) : (
                      <img
                        src="./password-hide.svg"
                        alt="Show Password"
                        className="h-6"
                      />
                    )}
                  </button>
                </div>
                <div className="mt-2 space-x-4">
                  <button
                    className={`px-4 py-2 text-white rounded-md focus:outline-none ${
                      !password
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-[#D8C1A9] hover:bg-[#E8D9C2] text-white"
                    }`}
                    onClick={handlePasswordEdit}
                    disabled={isPasswordEmpty()}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                    onClick={handleClosePasswordEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600">New Password:</p>
                <button
                  className="px-4 py-2 text-white bg-[#D8C1A9] rounded-md hover:bg-[#E8D9C2] focus:outline-none"
                  onClick={handlePasswordEditClick}
                >
                  Edit Password
                </button>
              </>
            )}
          </div>
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

export default UserProfile;
