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

  useEffect(() => {
    const type = localStorage.getItem("type");
    const authToken = localStorage.getItem("token");

    if (type === "Seller") {
      setIsSeller(true);
      axios
        .get(`${key.API_URL}/users/info`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          const { user_info, seller_info, image_urls } = response.data;
          setUserInfo(user_info);
          setSellerInfo(seller_info);
          setImagesURL(image_urls);
        });
    } else {
      setIsSeller(false);
      axios
        .get(`${key.API_URL}/users/info`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          const { user_info } = response.data;
          setUserInfo(user_info);
        });
    }
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <UserProfile userInfo={userInfo} />
        {isSeller && (
          <SellerProfile sellerInfo={sellerInfo} imagesURL={imagesURL} />
        )}
      </div>
    </>
  );
};

export default Profile;
