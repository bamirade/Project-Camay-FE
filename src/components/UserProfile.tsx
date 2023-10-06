import React from "react";

interface UserProfileProps {
  userInfo: {
    username: string;
    email: string;
    city: string;
    contact_information: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ userInfo }) => {
  if (!userInfo) return null;
  return (
    <>
      <div className="bg-white p-4 shadow-md rounded-md mt-4 mb-10">
        <h2 className="text-xl font-semibold">User Profile</h2>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">{userInfo.username}</h2>
          </div>
        </div>
        <p>Email: {userInfo.email}</p>
        <p>City: {userInfo.city}</p>
        <p>Contact Information: {userInfo.contact_information}</p>
      </div>
    </>
  );
};

export default UserProfile;
