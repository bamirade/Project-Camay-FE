import axios from "axios";
import { useEffect, useState } from "react";
import key from "../api/key";
import Snackbar from "../utils/snackbar";

interface CommissionTypeInfo {
  title: string;
  price: number;
  id: number;
}

const CommissionType = () => {
  const [commissionTypes, setCommissionTypes] = useState<CommissionTypeInfo[]>(
    []
  );
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [commissionTitle, setCommissionTitle] = useState<string>("");
  const [commissionPrice, setCommissionPrice] = useState<string | number>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<number>();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchCommissionTypes = async () => {
    const authToken = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `${key.API_URL}/commission_types/my_commissions`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setCommissionTypes(response.data);
    } catch (error) {
      console.error("Error fetching commission types:", error);
    }
  };

  useEffect(() => {
    fetchCommissionTypes();
  }, []);

  const handleEdit = (index: number, editedCommission: CommissionTypeInfo) => {
    setEditIndex(index);
    setCommissionTitle(editedCommission.title);
    setCommissionPrice(editedCommission.price);
  };

  const handleDeleteClick = (editedCommission: CommissionTypeInfo) => {
    setSelected(editedCommission.id);
    setIsDeleting(true);
  };

  const handleCloseDeleteClick = () => {
    setIsDeleting(false);
  };

  const handleSave = async (editedCommission: CommissionTypeInfo) => {
    const authToken = localStorage.getItem("token");
    console.log(
      `${key.API_URL}/commission_types/my_commissions/${editedCommission.id}`
    );
    try {
      await axios.patch(
        `${key.API_URL}/commission_types/my_commissions/${editedCommission.id}`,
        {
          commission_type: {
            title: commissionTitle,
            price: commissionPrice,
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
      setEditIndex(null);
      fetchCommissionTypes();
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

  const handleDelete = async () => {
    const authToken = localStorage.getItem("token");
    try {
      await axios.delete(
        `${key.API_URL}/commission_types/my_commissions/${selected}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSnackbarMessage("Deleted successfully");
      setSnackbarOpen(true);
      handleCloseDeleteClick();
      fetchCommissionTypes();
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
    <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
      <h2 className="text-3xl font-semibold border-b border-gray-300 pb-4">
        Commission Types
      </h2>

      <ul>
        {commissionTypes && commissionTypes.length > 0 ? (
          commissionTypes.map((commission, index) => (
            <li
              key={index}
              className="flex flex-col lg:flex-row items-center justify-between border-b border-gray-300 py-4 lg:py-2 lg:w-full"
            >
              {editIndex === index ? (
                <div className="lg:w-full flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4 lg:justify-between">
                  <label
                    htmlFor="title"
                    className="text-gray-600 font-semibold"
                  >
                    Title:
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    defaultValue={commission.title}
                    onChange={(e) => setCommissionTitle(e.target.value)}
                    className="border rounded p-2 lg:w-1/2"
                  />
                  <label
                    htmlFor="price"
                    className="text-gray-600 font-semibold"
                  >
                    Price:
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={commission.price}
                    className="border rounded p-2 lg:w-1/4"
                    onChange={(e) => setCommissionPrice(e.target.value)}
                  />
                  <div className="flex space-x-4 mt-2 lg:mt-0">
                    <button
                      onClick={() => handleSave(commission)}
                      className="text-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditIndex(null)}
                      className="text-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row items-center justify-between w-full">
                  <div className="lg:flex items-center lg:justify-start w-full lg:w-1/2 md:w-full flex justify-around">
                    <span className="text-lg font-semibold lg:w-1/2">
                      {commission.title}:
                    </span>
                    <span className="text-green-600">
                      PHP {commission.price}
                    </span>
                  </div>
                  <div className="lg:flex items-center w-full lg:w-1/4 justify-between mt-2 lg:mt-0 flex justify-around">
                    <button
                      onClick={() => handleEdit(index, commission)}
                      className="text-black hover:text-gray-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(commission)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        ) : (
          <div className="flex items-center justify-center py-4">
            <p className="text-gray-500 text-lg">No items to display</p>
          </div>
        )}
      </ul>

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
                        Remove Commission?
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to remove this commission?
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
                    onClick={handleCloseDeleteClick}
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

export default CommissionType;
