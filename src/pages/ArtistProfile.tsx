import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import key from "../api/key";
import Header from "../components/Header";

interface ArtistData {
  username: string;
  bio: string;
  rating: number;
  avatar_url: string | null;
  cover_url: string | null;
}

const ArtistProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${key.API_URL}/artists/${username}`);
        setArtistData(response.data);
        console.log(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data || error.message;
          console.log(errorMessage);
          navigate("/not-found");
        } else {
          console.error(`Unexpected Error:`, error);
        }
      }
    };

    fetchData();
  }, [username, navigate]);

  return (
    <div className="mx-auto mt-5">
      {artistData ? (
        <>
          <Header />
            <div className="relative h-40">
              <img
                src={artistData.cover_url || "/default_cover.webp"}
                alt="Profile Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </div>

            <div className="relative flex justify-center -mt-16 h-40">
              <img
                src={artistData.avatar_url || "/default_avatar.webp"}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg h-full w-auto"
              />
            </div>

            <div className="text-center py-4">
              <h1 className="text-3xl font-semibold text-black">
                {artistData.username}
              </h1>
              <p className="text-gray-400 text-lg">{artistData.bio}</p>
              <p className="mt-2 text-black">
                {artistData.rating !== 0
                  ? `Rating: ${artistData.rating}`
                  : "Rating is currently unavailable"}
              </p>
            </div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default ArtistProfile;
