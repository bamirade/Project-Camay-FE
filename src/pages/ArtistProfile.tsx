import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import key from "../api/key";
import Header from "../components/Header";
import ColorThief from "../utils/colorthief";
import WorksPortfolio from "../components/WorksPortfolio";
import Footer from "../components/Footer";
import Commission from "../components/Commission";

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
  const [isSeller, setIsSelller] = useState<boolean>(false);
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

    const determineSeller = () => {
      const type = localStorage.getItem("type");
      if (type === "Seller") {
        setIsSelller(true);
      } else {
        setIsSelller(false);
      }
    };

    fetchData();
    determineSeller();
  }, [username, navigate]);

  useEffect(() => {
    const getColorFromImage = async () => {
      const imageElement = new Image();
      const coverUrl = artistData?.cover_url || "/default_cover.webp";

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
    const targetElement = document.getElementById("works-section");

    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const createShareURL = () => {
    const shareLink = `https://www.facebook.com/sharer/sharer.php?u=https://project-camay-pgcd.onrender.com/artists/${username}`;
    return encodeURI(shareLink);
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
                background: `linear-gradient(to bottom, rgba(${
                  imageColor.join(",") || "216,193,169"
                }, 0.4) 0%, rgba(${imageColor.join(",")}, 0) 100%)`,
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
              {artistData.rating !== 0 ? (
                <ul
                  className="my-1 flex list-none gap-1 p-0 w-full justify-center"
                  data-te-rating-init
                >
                  <li>
                    <span
                      className="text-primary [&>svg]:h-5 [&>svg]:w-5"
                      title="Bad"
                      data-te-rating-icon-ref
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={`${artistData.rating >= 1 ? "yellow" : "none"}`}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </span>
                  </li>
                  <li>
                    <span
                      className="text-primary [&>svg]:h-5 [&>svg]:w-5"
                      title="Poor"
                      data-te-rating-icon-ref
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={`${artistData.rating >= 2 ? "yellow" : "none"}`}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </span>
                  </li>
                  <li>
                    <span
                      className="text-primary [&>svg]:h-5 [&>svg]:w-5"
                      title="OK"
                      data-te-rating-icon-ref
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={`${artistData.rating >= 3 ? "yellow" : "none"}`}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </span>
                  </li>
                  <li>
                    <span
                      className="text-primary [&>svg]:h-5 [&>svg]:w-5"
                      title="Good"
                      data-te-rating-icon-ref
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={`${artistData.rating >= 4 ? "yellow" : "none"}`}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </span>
                  </li>
                  <li>
                    <span
                      className="text-primary [&>svg]:h-5 [&>svg]:w-5"
                      title="Excellent"
                      data-te-rating-icon-ref
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill={`${artistData.rating >= 5 ? "yellow" : "none"}`}
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </span>
                  </li>
                </ul>
              ) : (
                "Rating is currently unavailable"
              )}
            </p>
            <div id="fb-root"></div>
            <script
              async
              defer
              crossOrigin="anonymous"
              src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0"
              nonce="g1xF8ZXR"
            ></script>
            <div
              className="fb-share-button flex justify-center"
              data-href={`https://project-camay-pgcd.onrender.com/artists/${username}`}
              data-layout="button"

            >
              <a
                target="_blank"
                href={createShareURL()}
                className="fb-xfbml-parse-ignore"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="blue"
                >
                  <path d="M15,3C8.373,3,3,8.373,3,15c0,6.016,4.432,10.984,10.206,11.852V18.18h-2.969v-3.154h2.969v-2.099c0-3.475,1.693-5,4.581-5 c1.383,0,2.115,0.103,2.461,0.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18h-3.106v8.697 C22.481,26.083,27,21.075,27,15C27,8.373,21.627,3,15,3z"></path>
                </svg>
              </a>
            </div>
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
            {!isSeller && (
              <button
                className={`text-black font-semibold py-2 px-4 rounded ml-2 text-xl ${
                  selectedTab ? "underline" : ""
                }`}
                id="works-section"
                onClick={() => handleTabChangeTwo()}
              >
                Commission Me
              </button>
            )}
          </div>
          {!selectedTab ? (
            <WorksPortfolio artistData={artistData} />
          ) : (
            <Commission />
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
