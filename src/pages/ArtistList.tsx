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
                    {artist.rating !== 0
                      ? artist.rating
                      : "currently unavailable"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
};

export default ArtistList;
