import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import UserProfile from "../components/UserProfile";
import SellerProfile from "../components/SellerProfile";
import key from "../api/key";
import Snackbar from "../utils/snackbar";
import CommissionType from "../components/CommissionType";
import Footer from "../components/Footer";

interface UserInfo {
  username: string;
  email: string;
  city: string;
  contact_information: string;
  id: number;
}

interface SellerInfo {
  bio: string;
}

interface ImagesURL {
  avatar_url: string;
  cover_url: string;
  works1_url: string;
  works2_url: string;
  works3_url: string;
  works4_url: string;
}

const Profile: React.FC = () => {
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [sellerInfo, setSellerInfo] = useState<SellerInfo | null>(null);
  const [imagesURL, setImagesURL] = useState<ImagesURL | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const fetchData = async () => {
    const type = localStorage.getItem("type");
    const authToken = localStorage.getItem("token");
    try {
      const response = await axios.get(`${key.API_URL}/users/info`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const { user_info, seller_info, image_urls } = response.data;
      setUserInfo(user_info);

      if (type === "Seller") {
        setIsSeller(true);
        setSellerInfo(seller_info);
        setImagesURL(image_urls);
      } else {
        setIsSeller(false);
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      {userInfo ? (
        <>
          <Header />
          <div className="container mx-auto p-4 min-h-[82.5vh]">
            <h1 className="text-2xl font-semibold">Profile</h1>
            {userInfo && (
              <UserProfile userInfo={userInfo} fetchData={fetchData} />
            )}
            {isSeller && (
              <>
                <SellerProfile
                  sellerInfo={sellerInfo}
                  imagesURL={imagesURL}
                  fetchData={fetchData}
                />
                <CommissionType />
              </>
            )}
          </div>
          <Footer />
        </>
      ) : (
        <>
          <Header />
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="animate-spin rounded-full border-t-4 border-[#D8C1A9] border-solid h-12 w-12 mb-2"></div>
            <h1 className="text-gray-700 text-lg">Loading...</h1>
          </div>
          <Footer />
        </>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default Profile;
