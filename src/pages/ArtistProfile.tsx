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
    axios
      .get(`${key.API_URL}/artists/${username}`)
      .then((response) => {
        setArtistData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching artist data:", error);
        if (error.response && error.response.status === 404) {
          navigate("/not-found");
        }
        console.log(error);
      });
  }, [username, navigate]);

  return (
    <div className="container mx-auto mt-5">
      {artistData ? (
        <>
          <Header />
          <div>
            <div className="relative">
              <img
                src={artistData.cover_url || "/default_cover.webp"}
                alt="Profile Cover"
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-40"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <img
                src={artistData.avatar_url || "/default_avatar.webp"}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-white"
              />
            </div>
            <div className="text-center mt-4">
              <h1 className="text-2xl font-semibold text-black">
                {artistData.username}
              </h1>
              <p className="text-black-500">{artistData.bio}</p>
              <p className="mt-2 text-black">Rating: {artistData.rating}</p>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ArtistProfile;
