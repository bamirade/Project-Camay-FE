import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import key from "../api/key";
import Header from "../components/Header";
import ColorThief from "../utils/colorthief";
import WorksPortfolio from "../components/WorksPortfolio";
import Footer from "../components/Footer";

interface ArtistData {
  username: string;
  bio: string;
  rating: number;
  avatar_url: string | null;
  cover_url: string | null;
  works1_url: string;
  works2_url: string;
  works3_url: string;
  works4_url: string;
}

const ArtistProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [imageColor, setImageColor] = useState([0, 0, 0]);
  const [selectedTab, setSelectedTab] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${key.API_URL}/artists/${username}`);
        setArtistData(response.data);
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

  useEffect(() => {
    const getColorFromImage = async () => {
      const imageElement = new Image();
      const coverUrl = artistData?.cover_url || "default_cover_image.webp";

      imageElement.src = coverUrl;

      imageElement.onload = async () => {
        const color = await ColorThief.getColor(imageElement.src);
        setImageColor(color);
      };
    };

    if (artistData) {
      getColorFromImage();
    }
  }, [artistData]);

  const handleTabChangeOne = () => {
    setSelectedTab(false);

    const targetElement = document.getElementById("works-section");

    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleTabChangeTwo = () => {
    setSelectedTab(true);
  };

  return (
    <div className="mx-auto">
      {artistData ? (
        <>
          <Header />
          <div className="relative h-80 mx-auto">
            <img
              src={artistData.cover_url || "/default_cover.webp"}
              alt="Profile Cover"
              className="w-full h-full object-cover max-w-full md:max-w-[90vw] mx-auto"
            />
            <div
              className={`absolute inset-0 z-[-1]`}
              style={{
                background: `linear-gradient(to bottom, rgba(${imageColor.join(
                  ","
                ) || "216,193,169"}, 0.4) 0%, rgba(${imageColor.join(",")}, 0) 100%)`,
              }}
            ></div>
          </div>

          <div className="relative flex justify-center -mt-16 h-80">
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
            <p className="text-gray-400 text-lg">
              {artistData.bio || "Bio is currently empty"}
            </p>
            <p className="mt-2 text-black">
              {artistData.rating !== 0
                ? `Rating: ${artistData.rating}`
                : "Rating is currently unavailable"}
            </p>
          </div>
          <div className="mt-4 text-center">
            <button
              className={`text-black font-semibold py-2 px-4 rounded text-xl ${
                !selectedTab ? "underline" : ""
              }`}
              onClick={() => handleTabChangeOne()}
            >
              Works
            </button>
            <button
              className={`text-black font-semibold py-2 px-4 rounded ml-2 text-xl ${
                selectedTab ? "underline" : ""
              }`}
              id="works-section"
              onClick={() => handleTabChangeTwo()}
            >
              Commission Me
            </button>
          </div>
          {!selectedTab ? (
            <WorksPortfolio artistData={artistData} />
          ) : (
            <p>commisions</p>
          )}
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
    </div>
  );
};

export default ArtistProfile;
