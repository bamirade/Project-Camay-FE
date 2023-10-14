import axios from "axios";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import key from "../api/key";
import Footer from "../components/Footer";
import Snackbar from "../utils/snackbar";

interface Commission {
  commission_id: number;
  buyer_username?: string;
  seller_username?: string;
  title: string;
  price: string;
  stage: string;
  description: string;
  rating: number | null;
}

const MyCommissions = () => {
  const [myCommissions, setMyCommissions] = useState<Commission[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [isRating, setIsRating] = useState<boolean>(false);
  const [selectedRating, setSelectedRating] = useState<number>();
  const [rate, setRate] = useState<number>(5);

  const fetchData = async () => {
    try {
      const userType = localStorage.getItem("type");
      const authToken = localStorage.getItem("token");
      const apiUrl = `${key.API_URL}/commission/${userType?.toLowerCase()}`;

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setMyCommissions(response.data.commissions);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || error.message;
        console.log(errorMessage);
        window.location.href = "/not-found";
      } else {
        console.error(`Unexpected Error:`, error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStage = async (id: number, stage: string) => {
    const authToken = localStorage.getItem("token");
    try {
      if (stage === "Completed") {
        setSelectedRating(id);
        setIsRating(true);
      } else {
        await axios.patch(
          `${key.API_URL}/commission/${stage}/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setSnackbarMessage("Updated Succesfully");
        setSnackbarOpen(true);
        fetchData();
      }
    } catch (error) {
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

  const handleCloseRate = () => {
    setIsRating(false);
    setRate(5);
  };

  const handleRate = async () => {
    const authToken = localStorage.getItem("token");
    try {
      await axios.patch(
        `${key.API_URL}/commission/rate/${selectedRating}`,
        { rating: rate },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSnackbarMessage("Commission rated successfully");
      setSnackbarOpen(true);
      handleCloseRate();
      fetchData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || error.message;
        console.log(errorMessage);
        setSnackbarMessage(errorMessage.error.toString());
      } else {
        console.error(`Unexpected Error:`, error);
      }
    }
  };

  const handleSelectRate = (rate: number) => {
    setRate(rate);
  };

  return (
    <>
      <Header />
      <div className="max-w-screen-lg mx-auto p-4 min-w-[90vw] min-h-[82.5vh]">
        <h2 className="text-3xl font-semibold mb-6">My Commissions</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {myCommissions.map((commission) => (
            <div
              key={commission.commission_id}
              className="bg-white shadow-lg rounded-lg p-6"
            >
              <h3 className="text-xl font-semibold mb-2">{commission.title}</h3>
              {commission.buyer_username && (
                <h3 className="text-xl font-semibold mb-2">
                  Buyer: {commission.buyer_username}
                </h3>
              )}
              {commission.seller_username && (
                <h3 className="text-xl font-semibold mb-2">
                  Artist: {commission.seller_username}
                </h3>
              )}
              <p className="text-gray-700 text-sm">
                Price: PHP{commission.price}
              </p>
              <button
                className={`px-4 py-2 text-white rounded-md focus:outline-none0 ${
                  (localStorage.getItem("type") === "Buyer" &&
                    (commission.stage === "Pending" ||
                      commission.rating !== null)) ||
                  (localStorage.getItem("type") === "Seller" &&
                    (commission.stage === "InProgress" ||
                      commission.stage === "Completed"))
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#D8C1A9] hover:bg-[#E8D9C2] text-white"
                }`}
                disabled={
                  (localStorage.getItem("type") === "Buyer" &&
                    (commission.stage === "Pending" ||
                      commission.rating !== null)) ||
                  (localStorage.getItem("type") === "Seller" &&
                    (commission.stage === "InProgress" ||
                      commission.stage === "Completed"))
                }
                onClick={() =>
                  updateStage(commission.commission_id, commission.stage)
                }
              >
                {commission.stage === "Pending"
                  ? "Mark as In Progress"
                  : commission.stage === "InProgress"
                  ? "Mark as Complete"
                  : commission.stage === "Completed"
                  ? "Rate"
                  : "Pending"}
              </button>
              <p className="text-gray-700 mt-2">
                {commission.description.length > 15 ? (
                  <>
                    {commission.description.slice(0, 25)}...
                    <button>See More</button>
                  </>
                ) : (
                  commission.description
                )}
              </p>
            </div>
          ))}
        </div>
        {isRating && (
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
                          Rate Commission
                        </h3>
                        <div className="mt-2">
                          <p>Rating:</p>
                          <ul
                            className="my-1 flex list-none gap-1 p-0"
                            data-te-rating-init
                          >
                            <li
                              onClick={() => handleSelectRate(1)}
                              className="hover:cursor-pointer"
                            >
                              <span
                                className="text-primary [&>svg]:h-5 [&>svg]:w-5"
                                title="Bad"
                                data-te-rating-icon-ref
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill={`${rate >= 1 ? "yellow" : "none"}`}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                  />
                                </svg>
                              </span>
                            </li>
                            <li
                              onClick={() => handleSelectRate(2)}
                              className="hover:cursor-pointer"
                            >
                              <span
                                className="text-primary [&>svg]:h-5 [&>svg]:w-5"
                                title="Poor"
                                data-te-rating-icon-ref
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill={`${rate >= 2 ? "yellow" : "none"}`}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                  />
                                </svg>
                              </span>
                            </li>
                            <li
                              onClick={() => handleSelectRate(3)}
                              className="hover:cursor-pointer"
                            >
                              <span
                                className="text-primary [&>svg]:h-5 [&>svg]:w-5"
                                title="OK"
                                data-te-rating-icon-ref
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill={`${rate >= 3 ? "yellow" : "none"}`}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                  />
                                </svg>
                              </span>
                            </li>
                            <li
                              onClick={() => handleSelectRate(4)}
                              className="hover:cursor-pointer"
                            >
                              <span
                                className="text-primary [&>svg]:h-5 [&>svg]:w-5"
                                title="Good"
                                data-te-rating-icon-ref
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill={`${rate >= 4 ? "yellow" : "none"}`}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                  />
                                </svg>
                              </span>
                            </li>
                            <li
                              onClick={() => handleSelectRate(5)}
                              className="hover:cursor-pointer"
                            >
                              <span
                                className="text-primary [&>svg]:h-5 [&>svg]:w-5"
                                title="Excellent"
                                data-te-rating-icon-ref
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill={`${rate >= 5 ? "yellow" : "none"}`}
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                  />
                                </svg>
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-[#D8C1A9] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#E8D9C2] sm:ml-3 sm:w-auto"
                        onClick={handleRate}
                      >
                        Rate
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={handleCloseRate}
                      >
                        Cancel
                      </button>
                    </div>
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
      <Footer />
    </>
  );
};

export default MyCommissions;
