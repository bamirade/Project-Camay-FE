import { useState } from "react";
import Header from "../components/Header";

const LandingPage = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center overflow-y-hidden">
        <div
          className={`${
            showSidebar ? "w-1/2" : "w-full"
          } transition-all duration-300 ease-in-out`}
        >
          <nav className="p-4">
            <button
              className="text-gray-600 text-3xl focus:outline-none"
              onClick={toggleSidebar}
            >
              &#8801;
            </button>
          </nav>
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-semibold mb-4">Project: CAMAY</h1>
          </div>
        </div>
        {showSidebar && (
          <div
            className={`w-1/2 bg-white p-8 transition-all duration-300 ease-in-out`}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome to Project: CAMAY
            </h2>
            <p className="text-gray-600 mb-4">
              Your gateway to artisan works and a thriving marketplace.
            </p>
            <p className="text-gray-600 mb-4">
              We're currently under development and working hard to bring you an
              amazing platform to showcase and discover artisan creations.
            </p>
            <p className="text-gray-600">
              Our mission is to support local artisans, enlarge their network by
              city, and provide a platform for their incredible creations.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default LandingPage;
