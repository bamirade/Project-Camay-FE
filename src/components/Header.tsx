import { useEffect, useState } from "react";
import Snackbar from "../utils/snackbar";
import { PageIndicator } from "../utils/pageindicator";
import axios from "axios";
import key from "../api/key";
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

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [type, setType] = useState<boolean>(true);
  const [commissionCount, setCommissionCount] = useState(0);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("type");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    if (type === "Buyer") {
      setType(true);
    } else if (type === "Seller") {
      setType(false);
    }

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

        const commissions = response.data.commissions;
        const nonCompletedCommissions = commissions.filter(
          (commission: Commission) => commission.stage !== "Completed"
        );

        setCommissionCount(nonCompletedCommissions.length);
      } catch (error) {
        console.error("Error fetching commission data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setSnackbarMessage("Logout successful");
    setSnackbarOpen(true);
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <header
        className="bg-white p-4 max-h-32"
        style={{ boxShadow: "0 2px 4px rgba(216, 193, 169, 0.5)" }}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex grow-0 lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-black hover:text-gray-600 transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          <div
            className={`flex items-center ${
              isMenuOpen ? "hidden" : "lg:block md:grow justify-center"
            }`}
            style={{
              flexGrow: window.matchMedia("(max-width: 768px)").matches
                ? "1"
                : "0",
              justifyContent: window.matchMedia("(max-width: 768px)").matches
                ? "center"
                : "flex-start",
            }}
          >
            <a href="/">
              <img src="/icon2.webp" alt="Logo" className="h-auto w-64" />
            </a>
          </div>

          <div
            className={`lg:flex space-x-4 items-center ${
              isMenuOpen ? "flex h-16 items-center" : "hidden"
            }`}
          >
            {isLoggedIn ? (
              <>
                <a
                  href="/"
                  className="text-black hover:text-gray-600 transition duration-300 font-semibold"
                >
                  Home
                </a>
                <a
                  href="/profile"
                  className="text-black hover:text-gray-600 transition duration-300 font-semibold"
                >
                  Profile
                </a>
                <button
                  onClick={handleLogout}
                  className="bg-[#D8C1A9] hover:bg-[#E8D9C2] text-white font-semibold py-2 px-4 rounded-full transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="text-black hover:text-gray-600 transition duration-300 font-semibold"
              >
                Login
              </a>
            )}
            {type && (
              <a
                href="/commissions"
                className="text-black hover:text-gray-600 transition duration-300"
              >
                <div className="relative py-2">
                  <div className="t-0 absolute left-3">
                    <p className="flex h-1 w-1 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                      {commissionCount}
                    </p>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="file: h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </div>
              </a>
            )}
          </div>
        </div>
        <div className="flex justify-end text-xs mr-2 lg:show mb:hidden">
          <PageIndicator />
        </div>
      </header>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
}

export default Header;
