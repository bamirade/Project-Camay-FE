import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import UserProfile from "../components/UserProfile";
import SellerProfile from "../components/SellerProfile";
import key from "../api/key";

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
      console.error("An error occurred while fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        {userInfo && <UserProfile userInfo={userInfo} />}
        {isSeller && (
          <SellerProfile
            sellerInfo={sellerInfo}
            imagesURL={imagesURL}
            fetchData={fetchData}
          />
        )}
      </div>
    </>
  );
};

export default Profile;
