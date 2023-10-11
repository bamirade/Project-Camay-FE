import React, { useState } from "react";
import Snackbar from "../utils/snackbar";
import axios from "axios";
import key from "../api/key";

interface SellerProfileProps {
  sellerInfo: {
    bio: string;
  } | null;
  imagesURL: {
    avatar_url: string;
    cover_url: string;
    works1_url: string;
    works2_url: string;
    works3_url: string;
    works4_url: string;
  } | null;
  fetchData: () => void;
}

const SellerProfile: React.FC<SellerProfileProps> = ({
  sellerInfo,
  imagesURL,
  fetchData,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [bio, setBio] = useState<string>("");

  const handleMouseEnter = (imageKey: string) => {
    setIsHovered(true);
    setHoveredImage(imageKey);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setHoveredImage(null);
  };

  const handleEditClick = () => {
    setSelectedImage(hoveredImage);
    setIsEditing(true);
    setNewImage(null);
  };

  const handleBioEditClick = () => {
    setIsEditingBio(true);
  };

  const handleDeleteClick = () => {
    setSelectedImage(hoveredImage);
    setIsDeleting(true);
  };

  const handleCloseDelete = () => {
    setIsDeleting(false);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleCloseBioEdit = () => {
    setIsEditingBio(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setNewImage(file || null);
  };

  const handleDelete = async () => {
    const authToken = localStorage.getItem("token");
    const userID = localStorage.getItem("user_id");
    try {
      await axios.delete(
        `${key.API_URL}/artists/${selectedImage}/delete/${userID}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSnackbarMessage("Deleted successfully");
      setSnackbarOpen(true);
      setIsDeleting(false);
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

  const handleEdit = async () => {
    const authToken = localStorage.getItem("token");
    const userID = localStorage.getItem("user_id");
    if (newImage) {
      const formData = new FormData();
      formData.append(`user[${selectedImage?.slice(0, -4)}]`, newImage);
      try {
        await axios.patch(
          `${key.API_URL}/artists/${selectedImage}/update/${userID}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setSnackbarMessage("Replaced successfully");
        setSnackbarOpen(true);
        setIsEditing(false);
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
    }
  };

  const handleBioEdit = async () => {
    const authToken = localStorage.getItem("token");
    const userID = localStorage.getItem("user_id");
    try {
      await axios.patch(
        `${key.API_URL}/artists/update_bio/${userID}`,
        { user: { seller: { bio } } },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSnackbarMessage("Replaced successfully");
      setSnackbarOpen(true);
      setIsEditingBio(false);
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

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!sellerInfo || !imagesURL) return null;

  return (
    <div className="bg-white rounded-md shadow-lg mb-10">
      <h2 className="text-3xl font-semibold px-6 py-4 border-b border-gray-300">
        Seller Profile
      </h2>

      <div className="flex flex-col md:flex-row md:items-center p-6 border-b border-gray-300">
        <div className="md:flex-shrink-0 h-full w-full md:w-1/3 md:mr-6">
          <p className="text-gray-600 mb-2">Seller Avatar</p>
          <div
            className="w-full h-full overflow-hidden rounded-full relative"
            onMouseEnter={() => handleMouseEnter("avatar_url")}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={imagesURL.avatar_url || "/default_avatar.webp"}
              alt="Seller Avatar"
              className="w-full h-full object-cover"
            />
            {isHovered && hoveredImage === "avatar_url" && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                <button
                  className="text-white px-4 py-2 rounded-md mr-2"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                {imagesURL.avatar_url && (
                  <button
                    className="text-white px-4 py-2 rounded-md"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="md:w-2/3">
          <p className="text-gray-600 mb-2">Seller Cover Photo</p>
          <div
            className="w-full h-full overflow-hidden rounded-md relative"
            onMouseEnter={() => handleMouseEnter("cover_url")}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={imagesURL.cover_url || "/default_cover.webp"}
              alt="Seller Cover Photo"
              className="w-full h-full max-h-[66.765vh] min-h-[66.765vh] object-cover"
            />
            {isHovered && hoveredImage === "cover_url" && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                <button
                  className="text-white px-4 py-2 rounded-md mr-2"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                {imagesURL.cover_url && (
                  <button
                    className="text-white px-4 py-2 rounded-md"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Seller Bio</h3>
          {!isEditingBio ? (
            <button
              className="px-4 py-2 text-white bg-[#D8C1A9] rounded-md hover:bg-[#E8D9C2] focus:outline-none focus:ring focus:ring-blue-400"
              onClick={handleBioEditClick}
            >
              Edit
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 text-white bg-[#D8C1A9] rounded-md hover:bg-[#E8D9C2] focus:outline-none focus:ring focus:ring-blue-400"
                onClick={handleBioEdit}
              >
                Save
              </button>
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:ring-blue-400 ring-1 ring-inset ring-gray-300"
                onClick={handleCloseBioEdit}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {!isEditingBio ? (
          <p className="text-gray-700 text-base">
            {sellerInfo.bio || "Bio is currently empty"}
          </p>
        ) : (
          <input
            type="text"
            className="block w-full h-full shadow-sm sm:text-sm focus:ring-blue-400 focus:border-blue-400 border-gray-300 rounded-md hover:bg-gray-100"
            style={{ fontSize: "1rem" }}
            defaultValue={sellerInfo.bio || "Bio is currently empty"}
            onChange={(e) => setBio(e.target.value)}
          />
        )}
      </div>

      <h3 className="text-xl font-semibold p-6">Works</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-6">
        <div>
          <p className="text-gray-600 mb-2">Works 1</p>
          <div
            className="relative w-full h-64 overflow-hidden rounded-md"
            onMouseEnter={() => handleMouseEnter("works1_url")}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={imagesURL.works1_url || "/default_works.webp"}
              alt="Works 1"
              className="w-full h-full object-cover"
            />
            {isHovered && hoveredImage === "works1_url" && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                <button
                  className="text-white px-4 py-2 rounded-md mr-2"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                {imagesURL.works1_url && (
                  <button
                    className="text-white px-4 py-2 rounded-md"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="text-gray-600 mb-2">Works 2</p>
          <div
            className="relative w-full h-64 overflow-hidden rounded-md"
            onMouseEnter={() => handleMouseEnter("works2_url")}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={imagesURL.works2_url || "/default_works.webp"}
              alt="Works 2"
              className="w-full h-full object-cover"
            />
            {isHovered && hoveredImage === "works2_url" && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                <button
                  className="text-white px-4 py-2 rounded-md mr-2"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                {imagesURL.works2_url && (
                  <button
                    className="text-white px-4 py-2 rounded-md"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="text-gray-600 mb-2">Works 3</p>
          <div
            className="relative w-full h-64 overflow-hidden rounded-md"
            onMouseEnter={() => handleMouseEnter("works3_url")}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={imagesURL.works3_url || "/default_works.webp"}
              alt="Works 3"
              className="w-full h-full object-cover"
            />
            {isHovered && hoveredImage === "works3_url" && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                <button
                  className="text-white px-4 py-2 rounded-md mr-2"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                {imagesURL.works3_url && (
                  <button
                    className="text-white px-4 py-2 rounded-md"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="text-gray-600 mb-2">Works 4</p>
          <div
            className="relative w-full h-64 overflow-hidden rounded-md"
            onMouseEnter={() => handleMouseEnter("works4_url")}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={imagesURL.works4_url || "/default_works.webp"}
              alt="Works 4"
              className="w-full h-full object-cover"
            />
            {isHovered && hoveredImage === "works4_url" && (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                <button
                  className="text-white px-4 py-2 rounded-md mr-2"
                  onClick={handleEditClick}
                >
                  Edit
                </button>
                {imagesURL.works4_url && (
                  <button
                    className="text-white px-4 py-2 rounded-md"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isDeleting && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3
                        className="text-base font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Remove{" "}
                        {selectedImage
                          ? selectedImage.slice(0, -5) === "works"
                            ? selectedImage.charAt(0).toUpperCase() +
                              selectedImage.slice(1, -5) +
                              " " +
                              selectedImage.charAt(5).toUpperCase() +
                              selectedImage.slice(6, -4)
                            : selectedImage.charAt(0).toUpperCase() +
                              selectedImage.slice(1, -4)
                          : "selectedImage"}
                        ?
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to remove{" "}
                          {selectedImage
                            ? selectedImage.slice(0, -5) === "works"
                              ? selectedImage.charAt(0).toUpperCase() +
                                selectedImage.slice(1, -5) +
                                " " +
                                selectedImage.charAt(5).toUpperCase() +
                                selectedImage.slice(6, -4)
                              : selectedImage.charAt(0).toUpperCase() +
                                selectedImage.slice(1, -4)
                            : "selectedImage"}
                          ? The image will be permanently removed from your
                          portfolio. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={handleDelete}
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleCloseDelete}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditing && (
        <div
          className="relative z-10"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#D8C1A9] sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-orange-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="white"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3
                        className="text-base font-semibold leading-6 text-gray-900"
                        id="modal-title"
                      >
                        Replace{" "}
                        {selectedImage
                          ? selectedImage.slice(0, -5) === "works"
                            ? selectedImage.charAt(0).toUpperCase() +
                              selectedImage.slice(1, -5) +
                              " " +
                              selectedImage.charAt(5).toUpperCase() +
                              selectedImage.slice(6, -4)
                            : selectedImage.charAt(0).toUpperCase() +
                              selectedImage.slice(1, -4)
                          : "selectedImage"}
                        ?
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to replace{" "}
                          {selectedImage
                            ? selectedImage.slice(0, -5) === "works"
                              ? selectedImage.charAt(0).toUpperCase() +
                                selectedImage.slice(1, -5) +
                                " " +
                                selectedImage.charAt(5).toUpperCase() +
                                selectedImage.slice(6, -4)
                              : selectedImage.charAt(0).toUpperCase() +
                                selectedImage.slice(1, -4)
                            : "selectedImage"}
                          ? The image will be replaced from your portfolio.{" "}
                          {selectedImage
                            ? selectedImage.charAt(0).toUpperCase() +
                                selectedImage.slice(1, -4) ===
                              "Cover"
                              ? "(Recommended Cover Ratio: 16:9)"
                              : null
                            : null}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload New Image
                    </label>
                    <div className="mt-1 flex items-center space-x-2">
                      <label className="flex items-center justify-center bg-[#D8C1A9] text-white rounded-md cursor-pointer hover:bg-[#E8D9C2]">
                        <span className="py-2 px-4">Choose Image</span>
                        <input
                          type="file"
                          accept=".jpeg, .jpg, .png, .tiff, .tif"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-gray-500 font-medium">
                        {newImage?.name || "No file selected"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-[#D8C1A9] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E8D9C2] sm:ml-3 sm:w-auto"
                    onClick={handleEdit}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={handleCloseEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default SellerProfile;
