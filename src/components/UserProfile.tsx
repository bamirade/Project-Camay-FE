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
    <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
      <h2 className="text-3xl font-semibold border-b border-gray-300 pb-4">
        User Profile
      </h2>
      <div className="mt-4">
        <div className="mb-4">
          <h3 className="text-xl font-semibold">{userInfo.username}</h3>
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
            <p className="font-semibold">{userInfo.contact_information || "No contact info on record"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
