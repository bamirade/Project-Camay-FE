import axios from "axios";
import { useState, useEffect } from "react";
import key from "../api/key";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

interface Artist {
  username: string;
  city: string;
  avatar_url: string | null;
  rating: number;
}

const ArtistList = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const navigate = useNavigate();

  const navigateToArtistPage = (username: string) => {
    navigate(`/artists/${username}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${key.API_URL}/artists/`);
        setArtists(response.data.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data || error.message;
          console.log(errorMessage);
        } else {
          console.error(`Unexpected Error:`, error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      {artists ? (
        <div className="p-4 min-h-[82.5vh]">
          <h2 className="text-3xl font-semibold mb-4">Artist List</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {artists.map((artist, index) => (
              <li
                key={index}
                className="bg-white rounded-lg shadow-md p-4 hover:cursor-pointer hover:bg-gray-200"
                onClick={() => navigateToArtistPage(artist.username)}
              >
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="lg:w-1/2 w-32 h-32 mb-4 sm:mb-0 md:w-48 md:h-48">
                    <img
                      src={artist.avatar_url || "/default_avatar.webp"}
                      alt={`Avatar of ${artist.username}`}
                      className="lg:w-auto w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {artist.username}
                    </h3>
                    <p className="text-gray-600 mb-2">City: {artist.city}</p>
                    <p className="text-gray-600">
                      Rating:{" "}
                      {artist.rating !== 0 ? (
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
                                fill={`${
                                  artist.rating >= 1 ? "yellow" : "none"
                                }`}
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
                                fill={`${
                                  artist.rating >= 2 ? "yellow" : "none"
                                }`}
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
                                fill={`${
                                  artist.rating >= 3 ? "yellow" : "none"
                                }`}
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
                                fill={`${
                                  artist.rating >= 4 ? "yellow" : "none"
                                }`}
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
                                fill={`${
                                  artist.rating >= 5 ? "yellow" : "none"
                                }`}
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
                        "currently unavailable"
                      )}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="animate-spin rounded-full border-t-4 border-[#D8C1A9] border-solid h-12 w-12 mb-2"></div>

          <h1 className="text-gray-700 text-lg">Loading...</h1>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ArtistList;
