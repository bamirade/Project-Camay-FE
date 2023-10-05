import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Reconfirm from "./pages/Reconfirm";
import Cart from "./pages/Cart";
import ArtistProfile from "./pages/ArtistProfile";
import ArtistList from "./pages/ArtistList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    setLoading(false);
  }, []);

  return (
    <Router>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/artists/:username" element={<ArtistProfile />} />
          <Route path="/artists/" element={<ArtistList />} />

          {!isLoggedIn && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reconfirm" element={<Reconfirm />} />
            </>
          )}
          {isLoggedIn && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
