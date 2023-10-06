import React from "react";

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
}

const SellerProfile: React.FC<SellerProfileProps> = ({
  sellerInfo,
  imagesURL,
}) => {
  if (!sellerInfo || !imagesURL) return null;

  return (
    <div className="bg-white rounded-md shadow-lg mb-10">
      <h2 className="text-3xl font-semibold px-6 py-4 border-b border-gray-300">
        Seller Profile
      </h2>

      <div className="flex flex-col md:flex-row md:items-center p-6 border-b border-gray-300">
        <div className="md:flex-shrink-0 w-full md:w-1/3 md:mr-6">
          <p className="text-gray-600 mb-2">Seller Avatar</p>
          <div className="w-full h-64 md:h-48 overflow-hidden rounded-full">
            <img
              src={imagesURL.avatar_url || "/default_avatar.webp"}
              alt="Seller Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="md:w-2/3">
          <p className="text-gray-600 mb-2">Seller Cover Photo</p>
          <div className="w-full h-64 overflow-hidden rounded-md">
            <img
              src={imagesURL.cover_url || "/default_cover.webp"}
              alt="Seller Cover Photo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">Seller Bio</h3>
        <p className="text-gray-700">
          {sellerInfo.bio || "Bio is currently empty"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-6">
        <div>
          <p className="text-gray-600 mb-2">Works 1</p>
          <div className="w-full h-64 overflow-hidden rounded-md">
            <img
              src={imagesURL.works1_url || "/default_works.webp"}
              alt="Works 1"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <p className="text-gray-600 mb-2">Works 2</p>
          <div className="w-full h-64 overflow-hidden rounded-md">
            <img
              src={imagesURL.works2_url || "/default_works.webp"}
              alt="Works 2"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <p className="text-gray-600 mb-2">Works 3</p>
          <div className="w-full h-64 overflow-hidden rounded-md">
            <img
              src={imagesURL.works3_url || "/default_works.webp"}
              alt="Works 3"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div>
          <p className="text-gray-600 mb-2">Works 4</p>
          <div className="w-full h-64 overflow-hidden rounded-md">
            <img
              src={imagesURL.works4_url || "/default_works.webp"}
              alt="Works 4"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
