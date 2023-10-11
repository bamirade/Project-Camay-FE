import axios from "axios";
import React, { useState } from "react";
import Snackbar from "../utils/snackbar";

interface UserProfileProps {
  userInfo: {
    username: string;
    email: string;
    city: string;
    contact_information: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ userInfo }) => {
  const [isEditingInfo, setIsEditingInfo] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const handleInfoEditClick = () => {
    setIsEditingInfo(true);
  };

  const handleCloseInfoEdit = () => {
    setIsEditingInfo(false);
  };

  const handleInfoEdit = async () => {
    const authToken = localStorage.getItem("token");
    const userID = localStorage.getItem("user_id");
    try {
      console.log(authToken, userID);
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
                  className="px-4 py-2 text-white bg-[#D8C1A9] rounded-md hover:bg-[#E8D9C2] focus:outline-none focus:ring focus:ring-blue-400"
                  onClick={handleInfoEdit}
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Email:</p>
            <p className="font-semibold">{userInfo.email}</p>
          </div>
          <div>
            <p className="text-gray-600">City:</p>
            <p className="font-semibold">{userInfo.city}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">Contact Information:</p>
            <p className="font-semibold">
              {userInfo.contact_information || "No contact info on record"}
            </p>
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
