import { useEffect, useState } from "react";
import Header from "../components/Header";
import UserProfile from "../components/UserProfile";
import SellerProfile from "../components/SellerProfile";

const Profile = () => {
  const [isSeller, setIsSeller] = useState<boolean>(false);
  useEffect(() => {
    const type = localStorage.getItem("type");

    if (type === "Seller") {
      setIsSeller(true);
    } else {
      setIsSeller(false);
    }
  }, []);

  return (
    <>
      <Header />
      <h1>Profile</h1>
      <UserProfile />
      {isSeller && <SellerProfile />}
    </>
  );
};

export default Profile;
